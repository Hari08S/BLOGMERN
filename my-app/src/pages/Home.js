import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div style={styles.container}>
      <header style={styles.navbar}>
        <div style={styles.logo}>Fusion Diaries</div>
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.link}>
            Our Story
          </Link>
          <Link to="/login" style={styles.link}>
            Write
          </Link>
          <Link to="/login" style={styles.link}>
            Sign In
          </Link>
          <Link to="/login">
            <button style={styles.button}>Get Started</button>
          </Link>
        </div>
      </header>

      <div style={{ position: "relative", textAlign: "center" }}>
        <h1 style={styles.title}>Human stories & ideas</h1>
        <p style={styles.subtitle}>
          A place to read, write, and deepen your understanding
        </p>
        <img src="background.webp" alt="stories" style={styles.image} />
        <Link to="/login">
          <button style={styles.ctaButton}>Start Reading</button>
        </Link>
      </div>

      <footer style={styles.footer}>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("For queries, contact us at harisuresh@fusiondiaries.com")}>
          Help
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("Fusion Diaries is a blog platform where users can share their stories and experiences.")}>
          About
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("Joining Fusion Diaries can enhance your writing skills and open new career opportunities in content creation.")}>
          Careers
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("We value your privacy. Your personal data will not be shared without your consent.")}>
          Privacy
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("By using this platform, you agree to follow our community guidelines and content policies.")}>
          Terms
        </a>
      </footer>
      {showPopup && (
        <div style={styles.popupOverlay} onClick={closePopup}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button style={styles.closeButton} onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    width: "96.7%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff9c4",
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
    WebkitTextStroke: "0.5px red",
    fontFamily: "Irish Grover",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    fontWeight: 700,
    border: "none",
    borderRadius: "20px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  image: {
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    display: "block",
    margin: "0 auto",
    borderRadius: "0px",
  },
  title: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
  },
  subtitle: {
    position: "absolute",
    top: "15%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontFamily: "IM FELL DW Pica SC",
    fontSize: "35px",
  },
  ctaButton: {
    backgroundImage: "linear-gradient(to right, red, black)",
    border: "none",
    borderRadius: "20px",
    padding: "1rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    position: "absolute",
    top: "50%",
    left: "45%",
    color: "white",
  },
  footer: {
    width: "101.2%",
    borderTop: "1px solid #ddd",
    padding: "1rem 0",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    backgroundColor: "black",
    color: "white",
  },
  footerLink: {
    textDecoration: "none",
    color: "#fafafa",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    textAlign: "center",
  },
  closeButton: {
    marginTop: "10px",
    padding: "8px 16px",
    border: "none",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Home;
