import { useState } from "react";
import StarRating from "./StarRating.jsx";

export default function ReviewCard({ review, canEdit, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = () => {
    setRating(review.rating);
    setComment(review.comment);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await onEdit(review._id, { rating, comment });
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (editing) {
    return (
      <div className="card review-card mb-3 col-md-5 ms-2">
        <div className="card-body">
          <h6 className="card-title">@{review.author?.username || "user"}</h6>
          <div className="mb-2">
            <StarRating value={rating} editable onChange={setRating} />
          </div>
          <textarea
            className="form-control mb-2"
            rows="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-dark"
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setEditing(false)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card review-card mb-3 col-md-5 ms-2">
      <div className="card-body">
        <h6 className="card-title">@{review.author?.username || "user"}</h6>
        <StarRating value={review.rating} />
        <p className="card-text mt-2">{review.comment}</p>
        {canEdit && (
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-dark" onClick={startEdit}>
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(review._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
