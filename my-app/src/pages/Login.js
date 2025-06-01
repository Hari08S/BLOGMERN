import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password || (isRegister && !username)) {
      alert("Please fill all the fields to continue.");
      return false;
    }
    if (isRegister && /[^a-zA-Z0-9]/.test(username)) {
      alert("Usernames should only contain letters and numbers.");
      return false;
    }
    if (!email.includes("@")) {
      alert("Email addresses must contain '@'. Example: user@example.com");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      try {
        const url = isRegister ? "http://localhost:3001/register" : "http://localhost:3001/login";
        const data = isRegister ? { username, email, password } : { email, password };
        const result = await axios.post(url, data);

        if (result.data.success) {
          alert(result.data.message);
          if (isRegister) {
            setIsRegister(false);
          } else {
            onLogin(result.data.user);
            navigate("/choose-role");
          }
        } else {
          alert(result.data.message);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="page100">
      <img src="blurred_image.png" alt="stories" className="background-image" />
      <div className="form-container100">
        <div className="h2">{isRegister ? "Register" : "Sign In"}</div>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              className="input100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="input100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="button100">
            {isRegister ? "REGISTER" : "SIGN IN"}
          </button>
        </form>
        {!isRegister && (
          <p className="link100" onClick={() => setIsRegister(true)}>
            Create an account
          </p>
        )}
        {isRegister && (
          <p className="link100" onClick={() => setIsRegister(false)}>
            I already have an account
          </p>
        )}
      </div>
    </div>
  );
}