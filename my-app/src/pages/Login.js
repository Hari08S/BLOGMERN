import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const validateInputs = () => {
    if (!email || !password || (isRegister && !username)) {
      alert("  Information is not completely filled \n\nPlease fill all the fields to continue.");
      return false;
    }

    if (isRegister && /[^a-zA-Z0-9]/.test(username)) {
      alert(" Invalid Username \n\nUsernames should only contain letters and numbers.\nTry new valid username.");
      return false;
    }

    if (!email.includes("@")) {
      alert(" Invalid Email \n\nEmail addresses must contain '@'.\nExample: user@example.com");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);
      navigate("/choose-role");
    }
  };
  return (
    <div style={pageStyle}>
      <img src="blurred_image.png" alt="stories" style={pageStyle} />
      <div style={formStyle}>
        <h2>{isRegister ? "Register" : "Sign In"}</h2>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            style={inputStyle}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          style={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit} style={buttonStyle}>
          {isRegister ? "REGISTER" : "SIGN IN"}
        </button>
        {!isRegister && (
          <p style={linkStyle} onClick={() => setIsRegister(true)}>
            Create an account
          </p>
        )}
        {isRegister && (
          <p style={linkStyle} onClick={() => setIsRegister(false)}>
            I already have an account
          </p>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  position: "relative",
};

const formStyle = {
  backgroundColor: "#d1c096",
  padding: "30px",
  borderRadius: "15px",
  width: "350px",
  textAlign: "center",
  position: "absolute",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0px",
  borderRadius: "5px",
  border: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 5px",
  backgroundColor: "#4a69bd",
  color: "white",
  borderRadius: "10px",
  cursor: "pointer",
};

const linkStyle = {
  color: "black",
  cursor: "pointer",
  marginTop: "10px",
};
