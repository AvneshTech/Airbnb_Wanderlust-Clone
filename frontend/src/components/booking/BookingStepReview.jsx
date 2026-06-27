const MS_PER_DAY = 1000 * 60 * 60 * 24;

function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "Price unavailable";
  return `\u20b9${Number(n).toLocaleString("en-IN")}`;
}

export default function BookingStepReview({ listing, details, onBack, onNext }) {
  const nights = Math.max(
    0,
    Math.round((new Date(details.checkOutDate) - new Date(details.checkInDate)) / MS_PER_DAY)
  );
  const total = listing?.price ? listing.price * nights : null;

  return (
    <div>
      <h5 className="mb-3">Review your booking</h5>
      <div className="card mb-3">
        <div className="card-body">
          <h6>{listing?.title}</h6>
          <p className="text-muted mb-1">{listing?.location}, {listing?.country}</p>
          <p className="mb-1">Check-in: {details.checkInDate}</p>
          <p className="mb-1">Check-out: {details.checkOutDate}</p>
          <p className="mb-1">Guests: {details.numberOfGuests}</p>
          <p className="mb-1">{money(listing?.price)} &times; {nights} night(s)</p>
          <hr />
          <p className="fw-bold mb-0">Total: {money(total)}</p>
        </div>
      </div>
      <button className="btn btn-outline-dark me-2" onClick={onBack}>Back</button>
      <button className="btn add-btn text-white" onClick={onNext}>Continue</button>
    </div>
  );
}
