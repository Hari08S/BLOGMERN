import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function ChooseRole() {
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
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.title}>Fusion Diaries</div>
        <div style={styles.nav} onClick={toggleDropdown}>
          <AccountCircleIcon style={{ cursor: "pointer", fontSize: "2rem" }} />
          {dropdownOpen && (
            <div style={styles.dropdownMenu}>
              <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>
                My Profile
              </div>
              <div style={styles.dropdownItem} onClick={() => navigate("/")}>
                Log Out
              </div>
            </div>
          )}
        </div>
      </header>

      <div style={styles.content}>
        <img src="blogLogo.png" alt="Fusion Diaries Logo" style={styles.logo} />
        <h1 style={styles.head}>Welcome to our Blogging Platform</h1>
        <h1 style={styles.head}>Choose Your Role</h1>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => navigate("/reader")}>Reader</button>
          <button style={styles.button} onClick={() => navigate("/blogger")}>Blogger</button>
        </div>
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
    width: "100%",
    height: "100vh",
    flexDirection: "column",
    backgroundColor: "#3a6289",
    alignItems: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff9c4",
    width: "96%",
    position: "relative",
  },
  nav: {
    position: "relative",
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: "0px",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "150px",
    zIndex: 10,
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    color: "black",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    fontSize: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
    padding: "5px 10px",
    WebkitTextStroke: "0.5px red",
    fontFamily: "Irish Grover",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: "200px",
    height: "auto",
    marginBottom: "20px",
  },
  head: {
    color: "white",
    textAlign: "center",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#007bff",
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

export default ChooseRole;
