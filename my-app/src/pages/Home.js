import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleFooterClick = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">Fusion Diaries</div>
        <div className="navLinks">
          <Link to="/login" className="link">
            Our Story
          </Link>
          <Link to="/login" className="link">
            Write
          </Link>
          <Link to="/login" className="link">
            Sign In
          </Link>
          <Link to="/login">
            <button className="lbutton">Get Started</button>
          </Link>
        </div>
      </header>

      <div className="hero-section">
        <h1 className="title">Human stories & ideas</h1>
        <p className="subtitle">
          A place to read, write, and deepen your understanding
        </p>
        <img src="background.webp" alt="stories" className="image" />
        <Link to="/login">
          <button className="ctaButton">Start Reading</button>
        </Link>
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
        <div className="popupOverlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button className="closeButton" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;