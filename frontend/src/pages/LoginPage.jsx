import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";

export default function LoginPage() {
  const { login } = useAuth();
  const { addFlash } = useFlashMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  // Redirect back to the originally-requested page after login.
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      addFlash("Welcome back to WanderLust", "success");
      navigate(from, { replace: true });
    } catch (err) {
      addFlash(err.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container col-md-6 offset-md-3 mt-4">
      <h3>Log in</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button className="btn add-btn text-white" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-3">No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
