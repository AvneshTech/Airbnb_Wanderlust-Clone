export default function Loader({ label = "Loading..." }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-danger" role="status" aria-hidden="true"></div>
      <span className="ms-3">{label}</span>
    </div>
  );
}
