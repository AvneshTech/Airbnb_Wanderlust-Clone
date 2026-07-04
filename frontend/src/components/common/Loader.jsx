export default function Loader({ label = "Loading..." }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      role="status"
      aria-label={label}
    >
      <div className="spinner-border text-danger" aria-hidden="true"></div>
      <span className="ms-3" aria-hidden="true">{label}</span>
    </div>
  );
}
