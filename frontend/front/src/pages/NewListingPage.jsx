import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../api/listingApi.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import ListingForm from "../components/listings/ListingForm.jsx";

export default function NewListingPage() {
  const navigate = useNavigate();
  const { addFlash } = useFlashMessage();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await createListing(formData);
      addFlash("New listing created", "success");
      navigate(`/listings/${res.data.listing._id}`);
    } catch (err) {
      addFlash(err.response?.data?.message || "Could not create listing", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h3 className="text-center my-4">Create a new listing</h3>
      <ListingForm mode="create" onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
