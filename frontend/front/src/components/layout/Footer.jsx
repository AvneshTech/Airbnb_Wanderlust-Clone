import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="foot-info">
      <div className="f-info-social">
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-linkedin"></i>
      </div>
      <div className="f-info-brand">&copy; WanderLust Private Limited</div>
      <div className="f-info-links">
        <Link to="/privacy">Privacy</Link> &nbsp;&middot;&nbsp;
        <Link to="/terms">Terms</Link>
      </div>
    </footer>
  );
}
