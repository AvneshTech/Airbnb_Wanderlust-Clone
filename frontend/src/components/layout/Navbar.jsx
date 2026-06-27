import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useFlashMessage } from "../../hooks/useFlashMessage.js";
import SearchBar from "../listings/SearchBar.jsx";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { addFlash } = useFlashMessage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      addFlash("You are logged out", "success");
      navigate("/");
    } catch (err) {
      addFlash(err.response?.data?.message || "Logout failed", "error");
    }
  };

  return (
    <nav className="navbar navbar-expand-md border-bottom sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fa-regular fa-compass"></i>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/">Explore</NavLink>
            {currentUser && <NavLink className="nav-link" to="/listings/new">Add listing</NavLink>}
            {currentUser && <NavLink className="nav-link" to="/bookings/my">My bookings</NavLink>}
            <NavLink className="nav-link" to="/chat">Chat</NavLink>
          </div>

          <div className="mx-auto" style={{ flex: 1, maxWidth: 420 }}>
            <SearchBar />
          </div>

          <div className="navbar-nav ms-auto align-items-md-center">
            {currentUser ? (
              <>
                <span className="nav-link">Hi, {currentUser.username}</span>
                <button className="btn btn-link nav-link" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/signup">Sign up</NavLink>
                <NavLink className="nav-link" to="/login">Log in</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
