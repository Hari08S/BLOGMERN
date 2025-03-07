import React from "react";

const FooterPopup = ({ title, content, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>{title}</h2>
        <p>{content}</p>
        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default FooterPopup;
