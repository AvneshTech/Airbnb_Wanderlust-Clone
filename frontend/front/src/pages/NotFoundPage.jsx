import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-4">404</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn add-btn text-white mt-2">Back to home</Link>
    </div>
  );
}
