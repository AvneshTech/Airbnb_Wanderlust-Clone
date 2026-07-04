import { useState } from "react";
import StarRating from "./StarRating.jsx";

export default function ReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment is required");
      return;
    }
    setError("");
    const ok = await onSubmit({ rating, comment });
    if (ok) {
      setComment("");
      setRating(3);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>Leave a review</h5>
      <div className="mb-2">
        <StarRating value={rating} editable onChange={setRating} />
      </div>
      <div className="mb-2">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Share your experience"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <div className="text-danger small">{error}</div>}
      </div>
      <button className="btn btn-outline-dark" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
