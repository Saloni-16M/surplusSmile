import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const NgoLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("http://localhost:5000/api/ngo/login", {
        email,
        password,
      });

      setMessage("Login successful!");
      
      // Redirect to NGO Home Page
      setTimeout(() => {
        navigate("/ngohome");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", margin: "auto" }}>
        <h3 className="text-center mb-3">NGO Login</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default NgoLogin;
