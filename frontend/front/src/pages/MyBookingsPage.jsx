import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyBookings, cancelBooking } from "../api/bookingApi.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import Loader from "../components/common/Loader.jsx";

const STATUS_COLORS = { pending: "warning", confirmed: "success", cancelled: "secondary" };

function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "Price unavailable";
  return `\u20b9${Number(n).toLocaleString("en-IN")}`;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addFlash } = useFlashMessage();

  const load = () => {
    setLoading(true);
    fetchMyBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => addFlash(err.response?.data?.message || "Could not load bookings", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async (bid) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(bid);
      addFlash("Booking cancelled", "success");
      load();
    } catch (err) {
      addFlash(err.response?.data?.message || "Cancel failed", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-muted">You have no bookings yet. <Link to="/">Explore stays</Link>.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {bookings.map((b) => (
            <div className="col" key={b._id}>
              <div className="card h-100">
                {b.listing?.image?.url && (
                  <img src={b.listing.image.url} className="card-img-top" alt={b.listing?.title}
                    style={{ height: "12rem", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }} />
                )}
                <div className="card-body" style={{ padding: "1rem" }}>
                  <h6>{b.listing?.title || "Listing removed"}</h6>
                  <span className={`badge bg-${STATUS_COLORS[b.status] || "secondary"} text-capitalize`}>
                    {b.status}
                  </span>
                  <p className="mt-2 mb-1 small">
                    {new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="mb-1 small">Guests: {b.numberOfGuests}</p>
                  <p className="fw-bold mb-2">{money(b.totalPrice)}</p>
                  {b.status !== "cancelled" && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(b._id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
