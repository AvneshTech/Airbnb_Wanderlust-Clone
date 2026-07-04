import { Link } from "react-router-dom";

export default function BookingStepConfirm({ onBack, onConfirm, submitting, done }) {
  if (done) {
    return (
      <div className="text-center py-4">
        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: "3rem" }}></i>
        <h5 className="mt-3">Booking confirmed!</h5>
        <p className="text-muted">Your stay is booked. View it under "My bookings".</p>
        <Link to="/bookings/my" className="btn add-btn text-white mt-2">Go to my bookings</Link>
      </div>
    );
  }

  return (
    <div>
      <h5 className="mb-3">Confirm &amp; book</h5>
      <p className="text-muted">
        Clicking confirm will create your booking and mark it confirmed.
      </p>
      <button className="btn btn-outline-dark me-2" onClick={onBack} disabled={submitting}>Back</button>
      <button className="btn add-btn text-white" onClick={onConfirm} disabled={submitting}>
        {submitting ? "Confirming..." : "Confirm booking"}
      </button>
    </div>
  );
}
