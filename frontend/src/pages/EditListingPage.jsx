import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchListing, updateListing } from "../api/listingApi.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import ListingForm from "../components/listings/ListingForm.jsx";
import Loader from "../components/common/Loader.jsx";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFlash } = useFlashMessage();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListing(id)
      .then((res) => setListing(res.data))
      .catch((err) => {
        addFlash(err.response?.data?.message || "Listing not found", "error");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await updateListing(id, formData);
      addFlash("Listing updated", "success");
      navigate(`/listings/${id}`);
    } catch (err) {
      addFlash(err.response?.data?.message || "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!listing) return null;

  return (
    <div className="container">
      <h3 className="text-center my-4">Edit listing</h3>
      <ListingForm mode="edit" initial={listing} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
