import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import "./ChooseRole.css";

function ChooseRole({ user, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFooterClick = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container1">
      <header className="header1">
        <div className="title1">Fusion Diaries</div>
        <div className="nav1" onClick={toggleDropdown}>
          <AccountCircleIcon className="icon" />
          {dropdownOpen && (
            <div className="dropdownMenu1">
              <div className="dropdownItem1" onClick={() => navigate("/profile")}>
                My Profile
              </div>
              <div className="dropdownItem1" onClick={onLogout}>
                Log Out
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="content1">
        <img src="blogLogo.png" alt="Fusion Diaries Logo" className="logo1" />
        <h1 className="head1">Welcome to our Blogging Platform</h1>
        <h1 className="head1">Choose Your Role</h1>
        <div className="buttonContainer1">
          <button className="button1" onClick={() => navigate("/reader")}>
            Reader
          </button>
          <button className="button1" onClick={() => navigate("/blogger")}>
            Blogger
          </button>
        </div>
      </div>

      <footer className="footer">
        <a href="#" className="footerLink" onClick={() => handleFooterClick("For queries, contact us at harisuresh@fusiondiaries.com")}>
          Help
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("Fusion Diaries is a blog platform where users can share their stories and experiences.")}>
          About
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("Joining Fusion Diaries can enhance your writing skills and open new career opportunities in content creation.")}>
          Careers
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("We value your privacy. Your personal data will not be shared without your consent.")}>
          Privacy
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("By using this platform, you agree to follow our community guidelines and content policies.")}>
          Terms
        </a>
      </footer>

      {showPopup && (
        <div className="popupOverlay1" onClick={closePopup}>
          <div className="popup1" onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button className="closeButton1" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseRole;