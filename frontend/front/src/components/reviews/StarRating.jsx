// Simple accessible star rating. `editable` makes it an input.
export default function StarRating({ value = 0, editable = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="star-rating" aria-label={`${value} out of 5 stars`}>
      {stars.map((s) => (
        <i
          key={s}
          className={`fa-${s <= value ? "solid" : "regular"} fa-star`}
          style={{ color: "#fe424d", cursor: editable ? "pointer" : "default", marginRight: 2 }}
          onClick={editable ? () => onChange(s) : undefined}
          role={editable ? "button" : undefined}
        ></i>
      ))}
    </span>
  );
}
