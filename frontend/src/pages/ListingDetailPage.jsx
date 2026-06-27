import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchListing, deleteListing } from "../api/listingApi.js";
import { createReview, deleteReview } from "../api/reviewApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import Loader from "../components/common/Loader.jsx";
import ReviewForm from "../components/reviews/ReviewForm.jsx";
import ReviewCard from "../components/reviews/ReviewCard.jsx";

function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "Price unavailable";
  return `\u20b9${Number(n).toLocaleString("en-IN")} / night`;
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addFlash } = useFlashMessage();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchListing(id)
      .then((res) => setListing(res.data))
      .catch((err) => {
        addFlash(err.response?.data?.message || "Listing not found", "error");
        navigate("/");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isOwner =
    currentUser && listing?.owner && currentUser._id === (listing.owner._id || listing.owner);

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteListing(id);
      addFlash("Listing deleted", "success");
      navigate("/");
    } catch (err) {
      addFlash(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleAddReview = async (data) => {
    setSubmitting(true);
    try {
      await createReview(id, data);
      addFlash("Review added", "success");
      load();
    } catch (err) {
      addFlash(err.response?.data?.message || "Could not add review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId);
      addFlash("Review deleted", "success");
      load();
    } catch (err) {
      addFlash(err.response?.data?.message || "Could not delete review", "error");
    }
  };

  if (loading) return <Loader />;
  if (!listing) return null;

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-md-8 offset-md-2 show-card">
          <h3 className="list-title">{listing.title}</h3>
          <img className="show-img w-100 rounded my-3" src={listing.image?.url} alt={listing.title} />
          <div className="card-body px-0">
            <p>Owned by <b>{listing.owner?.username || "unknown"}</b></p>
            <p>{listing.description}</p>
            <p>{money(listing.price)}</p>
            <p>{listing.location}, {listing.country}</p>
            <span className="badge bg-secondary text-capitalize">{listing.category}</span>
          </div>

          <div className="btns my-3 d-flex gap-2">
            <Link to={`/listings/${id}/book`} className="btn add-btn text-white">Book this stay</Link>
            {isOwner && (
              <>
                <Link to={`/listings/${id}/edit`} className="btn btn-dark edit-btn">Edit</Link>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>

          <hr />
          <h4>Reviews</h4>
          {currentUser ? (
            <ReviewForm onSubmit={handleAddReview} submitting={submitting} />
          ) : (
            <p className="text-muted">
              <Link to="/login">Log in</Link> to leave a review.
            </p>
          )}

          <div className="row">
            {listing.reviews?.length ? (
              listing.reviews.map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  canDelete={currentUser && r.author && currentUser._id === (r.author._id || r.author)}
                  onDelete={handleDeleteReview}
                />
              ))
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
