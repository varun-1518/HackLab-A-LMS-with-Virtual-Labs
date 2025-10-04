import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChalkboardUser, faBars, faTimes, faGraduationCap, faShield, faLock, faCode } from "@fortawesome/free-solid-svg-icons";
import LabAccess from './LabAccess';

function Navbar(props) {
  const value = props.page;
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("profileImage");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const activeStyle = {
    backgroundColor: "#0055a4",
    borderRadius: "4px",
    padding: "8px 12px",
    color: "white"
  };

  const normalStyle = {
    padding: "8px 12px"
  };

  return (
    <div>
      <nav>
        <div className="logo1">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faShield} style={{ fontSize: '28px', color: '#0055a4', marginRight: '10px' }} />
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#0055a4', 
              letterSpacing: '0.5px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              HackLab
            </span>
          </Link>
        </div>
        <div className="navigation">
          <div id="menu-btn" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} className="menu-dash" />
          </div>
          <FontAwesomeIcon
            id="menu-close"
            icon={faTimes}
            onClick={closeMobileMenu}
          />
          <ul className={isMobileMenuOpen ? "active" : ""}>
            {isMobileMenuOpen && (
              <li className="close-button">
                <button onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </li>
            )}
            
            <li>
              <Link to={"/"} style={value === "home" ? activeStyle : normalStyle}>
                Home
              </Link>
            </li>
            
            <li>
              <Link to={"/courses"} style={value === "courses" ? activeStyle : normalStyle}>
                Security Courses <FontAwesomeIcon icon={faLock} style={{ marginLeft: '5px' }} />
              </Link>
            </li>
            
            {authToken && (
              <li>
                <Link to={"/profile"} style={value === "profile" ? activeStyle : normalStyle}>
                  Profile <FontAwesomeIcon icon={faUser} />
                </Link>
              </li>
            )}
            
            {authToken && (
              <li>
                <Link to={"/learnings"} style={value === "learnings" ? activeStyle : normalStyle}>
                  My Training <FontAwesomeIcon icon={faChalkboardUser} />
                </Link>
              </li>
            )}
            
            {authToken && (
              <li>
                <LabAccess />
              </li>
            )}
            
            {authToken ? (
              <li>
                <button onClick={handleLogOut} className="sign-out-button">
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <button onClick={() => navigate("/login")}>Login/SignUp</button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
