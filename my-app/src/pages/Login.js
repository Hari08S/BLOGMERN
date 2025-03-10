import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the external CSS file

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
    <div className="page">
      <img src="blurred_image.png" alt="stories" className="background-image" />
      <div className="form-container">
        <h2>{isRegister ? "Register" : "Sign In"}</h2>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className="button">
          {isRegister ? "REGISTER" : "SIGN IN"}
        </button>
        {!isRegister && (
          <p className="link" onClick={() => setIsRegister(true)}>
            Create an account
          </p>
        )}
        {isRegister && (
          <p className="link" onClick={() => setIsRegister(false)}>
            I already have an account
          </p>
        )}
      </div>
    </div>
  );
}
