import { Link } from "react-router-dom";

const GST_RATE = 0.18;

// Defensive price formatting (bug #7): never call methods on a missing price.
function formatPrice(price, showTax) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return "Price unavailable";
  }
  const value = showTax ? Math.round(price * (1 + GST_RATE)) : price;
  return `\u20b9${value.toLocaleString("en-IN")}${showTax ? " (incl. GST)" : " / night"}`;
}

export default function ListingCard({ listing, showTax }) {
  return (
    <Link to={`/listings/${listing._id}`} className="listing-link">
      <div className="card col">
        <img
          src={listing.image?.url || "https://via.placeholder.com/400x300?text=No+image"}
          className="card-img-top"
          alt={listing.title}
          style={{ height: "20rem" }}
        />
        <div className="card-img-overlay"></div>
        <div className="card-body">
          <p className="card-text">
            <b>{listing.title}</b>
            <br />
            {formatPrice(listing.price, showTax)}
          </p>
        </div>
      </div>
    </Link>
  );
}
