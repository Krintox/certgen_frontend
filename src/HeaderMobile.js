import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logoImage from "./images/Logo.png";
import certificateLogo from "./images/certificate-logo.png";
import newProject from "./images/newProject.png";
import commentsLogo from "./images/comments-logo.png";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { PiClockCounterClockwise } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { TbCertificate } from "react-icons/tb";
import { BiChat } from "react-icons/bi";

export default function HeaderMobile() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for controlling mobile menu visibility

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
    <header style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="header-title">
        <Link to="/" className="logo-link">
          <img src={logoImage} alt="Logo" className="logo-image" style={{ width: '100px' }} />
        </Link>
      </div>
      <div>
        {!isMenuOpen ? (
          <FiMenu size={30} onClick={() => setIsMenuOpen(true)} className="text-white" />
        ) : (
          <FiX size={30} onClick={() => setIsMenuOpen(false)} className="text-white" />
        )}
      </div>
      {isMenuOpen && (
        <div className="menu-popup">
          <div className="popup-content">
            <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {!username && (
                <>
                  <a href="#how-to-use" className="nav-icon text-center">
                    <TbCertificate size={35}/> <span>HOW TO USE</span>
                  </a>
                  <Link to="/reviews" className="nav-icon">
                    <BiChat size={35}/> <span>REVIEWS</span>
                  </Link>
                </>
              )}
              {username && (
                <>
                  <Link to="/newproject" className="nav-icon">
                    <img src={newProject} alt="Project" className="nav-icon-image" />
                    NEW PROJECT
                  </Link>
                  <Link to="/newproject" className="nav-icon">
                    <PiClockCounterClockwise size={35}/> <span>MY PROJECTS</span>
                  </Link>
                  <Link to="/newproject" className="nav-icon">
                    <CiUser size={35}/> <span>PROFILE</span>
                  </Link>
                  <a href="#how-to-use" className="nav-icon">
                    <TbCertificate size={35}/> <span>HOW TO USE</span>
                  </a>
                </>
              )}
            </nav>
            <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {username && (
                <a onClick={logout} className="nav-icon-mob logout-button">
                  <FiLogOut size={20}/> <span className="pl-1">LOGOUT</span>
                </a>
              )}
              {!username && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%'}}>
                  <Link to="/register" className="signup-button">
                    Sign Up
                  </Link>
                  <Link to="/login" className="signin-button">
                    Sign In
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
