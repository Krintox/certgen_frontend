import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import logoImage from "./images/Logo.png";
import certificateLogo from "./images/certificate-logo.png";
import newProject from "./images/newProject.png";
import commentsLogo from "./images/comments-logo.png";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch('https://certgen-backend.vercel.app/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('https://certgen-backend.vercel.app/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
      window.location.href = "/"; // Redirect to homepage
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <div className="header-title">
      <Link to="/" className="logo-link">
        <img src={logoImage} alt="Logo" className="logo-image" />
      </Link>
      <nav>
        {username && (
          <Link to="/newproject" className="nav-icon">
          <img src={newProject} alt="Project" className="nav-icon-image" />
          NEW PROJECT
        </Link>
        )}
        {!username && (
          <>
            <a href="#how-to-use" className="nav-icon">
              <img src={certificateLogo} alt="Certificate" className="nav-icon-image" />
              HOW TO USE
            </a>
            <Link to="/reviews" className="nav-icon">
              <img src={commentsLogo} alt="Comments" className="nav-icon-image" />
              REVIEWS
            </Link>
          </>
        )}
      </nav>
      </div>
      <div className="header-title-2">
      <nav>
        {username && (
          <>
            <a onClick={logout} className="nav-icon">
              Logout ({username})
            </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/register" className="signup-button">
              Sign Up
            </Link>
            <Link to="/login" className="signin-button">
              Sign In
            </Link>
          </>
        )}
      </nav>
      </div>
    </header>
  );
}