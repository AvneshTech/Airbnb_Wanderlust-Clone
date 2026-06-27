// Standalone smoke test: boots the real app against an in-memory Mongo and
// exercises auth -> listing -> review -> booking flow with a cookie jar.
const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
  const mem = await MongoMemoryServer.create();
  process.env.SECRET = "test-secret";
  process.env.ATLASDB_URL = mem.getUri() + "wanderlust_test";
  process.env.CLOUD_NAME = "x";
  process.env.CLOUD_API_KEY = "x";
  process.env.CLOUD_API_SECRET = "x";
  process.env.OPENAI_API_KEY = "x";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.NODE_ENV = "development";

  const mongoose = require("mongoose");
  await mongoose.connect(process.env.ATLASDB_URL);

  const app = require("./app.js");
  const server = app.listen(0);
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  // tiny cookie jar
  let cookie = "";
  async function call(method, path, body, isForm) {
    const headers = {};
    if (cookie) headers.Cookie = cookie;
    let payload;
    if (isForm) {
      payload = body; // FormData
    } else if (body) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    const res = await fetch(base + path, { method, headers, body: payload });
    const sc = res.headers.get("set-cookie");
    if (sc) cookie = sc.split(";")[0];
    let data;
    try { data = await res.json(); } catch { data = null; }
    return { status: res.status, data };
  }

  const results = [];
  const check = (name, cond, extra = "") => {
    results.push((cond ? "PASS" : "FAIL") + "  " + name + (extra ? "  -> " + extra : ""));
    return cond;
  };

  // 1. health
  let r = await call("GET", "/api/health");
  check("GET /api/health", r.status === 200 && r.data.status === "ok");

  // 2. /me when logged out -> 401
  r = await call("GET", "/api/auth/me");
  check("GET /api/auth/me (logged out) -> 401", r.status === 401);

  // 3. signup with short password -> 400 (bug #10)
  r = await call("POST", "/api/auth/signup", { username: "alice", email: "a@b.com", password: "short" });
  check("signup short password -> 400", r.status === 400, r.data && r.data.message);

  // 4. signup valid
  r = await call("POST", "/api/auth/signup", { username: "alice", email: "a@b.com", password: "longenough8" });
  check("signup valid -> 201", r.status === 201 && r.data.user && r.data.user.username === "alice");

  // 5. /me now authenticated
  r = await call("GET", "/api/auth/me");
  const userId = r.data && r.data.user && r.data.user._id;
  check("GET /api/auth/me (logged in) -> 200", r.status === 200 && !!userId);

  // 6. create listing WITHOUT image -> 400 (bug #1)
  const fd1 = new FormData();
  fd1.append("title", "Test"); fd1.append("description", "d"); fd1.append("price", "100");
  fd1.append("location", "L"); fd1.append("country", "C"); fd1.append("category", "beach");
  r = await call("POST", "/api/listings", fd1, true);
  check("create listing no image -> 400", r.status === 400, r.data && r.data.message);

  // 7. invalid ObjectId -> 400 (bug #8)
  r = await call("GET", "/api/listings/not-an-id");
  check("GET listing invalid id -> 400", r.status === 400);

  // 8. seed a listing directly (bypass cloudinary upload) then test read/review/booking
  const Listing = require("./models/listing.model.js");
  const seeded = await Listing.create({
    title: "Cozy Cabin", description: "nice", price: 200, location: "Aspen",
    country: "USA", category: "mountain", image: { url: "http://img/x.jpg", filename: "x" },
    owner: userId,
  });

  // 9. get listing
  r = await call("GET", "/api/listings/" + seeded._id);
  check("GET listing by id -> 200", r.status === 200 && r.data.title === "Cozy Cabin");

  // 10. list with category filter
  r = await call("GET", "/api/listings?category=mountain");
  check("GET listings ?category=mountain", r.status === 200 && r.data.length === 1);
  r = await call("GET", "/api/listings?category=beach");
  check("GET listings ?category=beach (none)", r.status === 200 && r.data.length === 0);
  r = await call("GET", "/api/listings?query=cozy");
  check("GET listings ?query=cozy", r.status === 200 && r.data.length === 1);

  // 11. add review
  r = await call("POST", `/api/listings/${seeded._id}/reviews`, { rating: 5, comment: "great" });
  check("create review -> 201", r.status === 201 && r.data.review.rating === 5);

  // 12. review on missing listing -> 404 (bug #2)
  const fakeId = "5f9d88b9c9d1f83b3c7b1234";
  r = await call("POST", `/api/listings/${fakeId}/reviews`, { rating: 4, comment: "x" });
  check("review on missing listing -> 404", r.status === 404);

  // 13. booking flow: create -> confirm
  r = await call("POST", "/api/bookings", {
    listingId: String(seeded._id),
    checkInDate: "2026-07-01",
    checkOutDate: "2026-07-04",
    numberOfGuests: 2,
  });
  const bookingId = r.data && r.data.booking && r.data.booking._id;
  const total = r.data && r.data.booking && r.data.booking.totalPrice;
  check("create booking -> 201 (price 200*3=600)", r.status === 201 && total === 600, "total=" + total);

  r = await call("PATCH", `/api/bookings/${bookingId}/confirm`);
  check("confirm booking -> confirmed", r.status === 200 && r.data.booking.status === "confirmed");

  r = await call("GET", "/api/bookings/my");
  check("GET my bookings", r.status === 200 && r.data.length === 1);

  // 14. booking with checkout <= checkin -> 400
  r = await call("POST", "/api/bookings", {
    listingId: String(seeded._id), checkInDate: "2026-07-04", checkOutDate: "2026-07-01", numberOfGuests: 1,
  });
  check("booking checkout<=checkin -> 400", r.status === 400);

  // 15. logout (POST)
  r = await call("POST", "/api/auth/logout");
  check("POST logout -> 200", r.status === 200);
  r = await call("GET", "/api/auth/me");
  check("after logout /me -> 401", r.status === 401);

  console.log("\n===== SMOKE TEST RESULTS =====");
  results.forEach((l) => console.log(l));
  const failed = results.filter((l) => l.startsWith("FAIL")).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);

  await mongoose.disconnect();
  server.close();
  await mem.stop();
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("SMOKE TEST CRASHED:", e); process.exit(1); });
