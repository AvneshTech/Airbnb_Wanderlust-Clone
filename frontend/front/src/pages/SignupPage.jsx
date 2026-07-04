import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";

export default function SignupPage() {
  const { signup } = useAuth();
  const { addFlash } = useFlashMessage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Surface the 8-char password rule client-side (matches the Joi rule).
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      addFlash("Welcome to WanderLust", "success");
      navigate("/");
    } catch (err) {
      addFlash(err.response?.data?.message || "Signup failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container col-md-6 offset-md-3 mt-4">
      <h3>Sign up</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <div className="form-text">At least 8 characters.</div>
          {error && <div className="text-danger small">{error}</div>}
        </div>
        <button className="btn add-btn text-white" disabled={submitting}>
          {submitting ? "Creating..." : "Sign up"}
        </button>
      </form>
      <p className="mt-3">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
