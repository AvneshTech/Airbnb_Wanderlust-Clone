import StarRating from "./StarRating.jsx";

export default function ReviewCard({ review, canDelete, onDelete }) {
  return (
    <div className="card review-card mb-3 col-md-5 ms-2">
      <div className="card-body">
        <h6 className="card-title">@{review.author?.username || "user"}</h6>
        <StarRating value={review.rating} />
        <p className="card-text mt-2">{review.comment}</p>
        {canDelete && (
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(review._id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
