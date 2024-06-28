import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import logoImage from "./images/Logo.png";
import certificateLogo from "./images/certificate-logo.png";
import newProject from "./images/newProject.png";
import commentsLogo from "./images/comments-logo.png";
import { FiLogOut } from "react-icons/fi";
import { PiClockCounterClockwise } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { TbCertificate } from "react-icons/tb";
import { BiChat } from "react-icons/bi";


export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch('https://certgen-backend.vercel.app/auth/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('https://certgen-backend.vercel.app/auth/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
      window.location.href = "/"; // Redirect to homepage
    });
  }

  const username = userInfo?.username;

  return (
    <header className="text-black">
      <div className="header-title text-black">
      <Link to="/" className="logo-link text-black">
        <img src={logoImage} alt="Logo" className="logo-image" />
      </Link>
      <nav>
        {!username && (
          <>
            <a href="#how-to-use" className="nav-icon text-black">
              <TbCertificate size={35}/> <span>HOW TO USE</span>
            </a>
            <Link to="/reviews" className="nav-icon text-black">
              <BiChat size={35}/> <span>REVIEWS</span>
            </Link>
          </>
        )}
      </nav>
      </div>
      <div className="header-title-3">
      <nav>
        {username && (
          <>
          <Link to="/newproject" className="nav-icon text-black">
            <img src={newProject} alt="Project" className="nav-icon-image text-black" />
            NEW PROJECT
            </Link>
          <Link to="/yourprojects" className="nav-icon text-black">
            <PiClockCounterClockwise size={35}/> <span>MY PROJECTS</span>
        </Link>
            {/* <Link to="/createaccount" className="nav-icon text-black">
            <CiUser size={35}/> <span>PROFILE</span>
        </Link> */}
            {/* <a href="#how-to-use" className="nav-icon">
              <TbCertificate size={35}/> <span>HOW TO USE</span>
            </a> */}
          </>
          
        )}
      </nav>
      </div>
      <div className="header-title-2">
      <nav>
        {username && (
          <>
            <span className="nav-icon username text-black">
              {username}
            </span>
            <a onClick={logout} className="nav-icon logout-button text-black">
            <FiLogOut size={20}/> <span className="pl-1">LOGOUT</span>
            </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/register" className="signup-button text-black">
              Sign Up
            </Link>
            <Link to="/login" className="signin-button text-black">
              Sign In
            </Link>
          </>
        )}
      </nav>
      </div>
    </header>
  );
}