import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAll } from '../utils/auth';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    logoutAll(); // Clear any previous tokens
    const sanitizedEmail = formData.email.trim().toLowerCase();
    const sanitizedPassword = formData.password.trim();
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitizedEmail, password: sanitizedPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin"); // Redirect to dashboard
    } catch (error) {
      logoutAll();
      setMessage(error.message);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F1F8E9] p-6">
  <div className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-teal-700 mb-6 tracking-tight">
      Admin Login
    </h2>

    {message && (
      <p
        className={`text-center text-sm mb-4 font-medium ${
          message.includes("successful") ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-teal-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition duration-200"
      >
        Login
      </button>
    </form>

  
  </div>

</div>
  );
};

export default AdminLogin;