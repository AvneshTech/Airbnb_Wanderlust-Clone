import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchListing } from "../api/listingApi.js";
import { createBooking, confirmBooking } from "../api/bookingApi.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import Loader from "../components/common/Loader.jsx";
import BookingProgressBar from "../components/booking/BookingProgressBar.jsx";
import BookingStepDates from "../components/booking/BookingStepDates.jsx";
import BookingStepReview from "../components/booking/BookingStepReview.jsx";
import BookingStepConfirm from "../components/booking/BookingStepConfirm.jsx";

// Hosts the 3-step booking flow.
export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFlash } = useFlashMessage();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ checkInDate: "", checkOutDate: "", numberOfGuests: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchListing(id)
      .then((res) => setListing(res.data))
      .catch((err) => {
        addFlash(err.response?.data?.message || "Listing not found", "error");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDates = (d) => {
    setDetails(d);
    setStep(2);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      // Step 3: create then confirm.
      const res = await createBooking({ listingId: id, ...details });
      await confirmBooking(res.data.booking._id);
      setDone(true);
      addFlash("Booking confirmed", "success");
    } catch (err) {
      addFlash(err.response?.data?.message || "Booking failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!listing) return null;

  return (
    <div className="container col-md-8 offset-md-2 mt-4">
      <h3 className="mb-4">Book: {listing.title}</h3>
      <BookingProgressBar step={step} />
      {step === 1 && <BookingStepDates initial={details} onNext={handleDates} />}
      {step === 2 && (
        <BookingStepReview
          listing={listing}
          details={details}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <BookingStepConfirm
          onBack={() => setStep(2)}
          onConfirm={handleConfirm}
          submitting={submitting}
          done={done}
        />
      )}
    </div>
  );
}
