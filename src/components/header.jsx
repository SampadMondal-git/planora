import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css";
import Logo from "../assets/logo.web.png";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isInPlanner = location.pathname.endsWith("planner");
  const isInAuth = location.pathname.includes("signin") || location.pathname.includes("signup");

  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img src={Logo} width={100} alt="logo" />
        </Link>
      </div>
      {!isInPlanner && !isInAuth && (
        <div className="login-container">
          <button className="signin-button" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}
    </div>
  );
}
