import { useState } from "react";

export default function BookingStepDates({ initial, onNext }) {
  const [checkInDate, setCheckIn] = useState(initial.checkInDate || "");
  const [checkOutDate, setCheckOut] = useState(initial.checkOutDate || "");
  const [numberOfGuests, setGuests] = useState(initial.numberOfGuests || 1);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!checkInDate || !checkOutDate) {
      setError("Please pick both dates");
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out must be after check-in");
      return;
    }
    if (numberOfGuests < 1) {
      setError("At least one guest is required");
      return;
    }
    setError("");
    onNext({ checkInDate, checkOutDate, numberOfGuests: Number(numberOfGuests) });
  };

  return (
    <div>
      <h5 className="mb-3">Choose your dates</h5>
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Check-in</label>
          <input type="date" className="form-control" value={checkInDate} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Check-out</label>
          <input type="date" className="form-control" value={checkOutDate} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Guests</label>
        <input type="number" min="1" className="form-control" value={numberOfGuests} onChange={(e) => setGuests(e.target.value)} />
      </div>
      {error && <div className="text-danger small mb-2">{error}</div>}
      <button className="btn add-btn text-white" onClick={handleNext}>Continue</button>
    </div>
  );
}
