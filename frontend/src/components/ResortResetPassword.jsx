import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResortResetPassword = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/resort/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Password reset successful! You can now log in.");
      setTimeout(() => {
        navigate("/resort/login");
      }, 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F1F8E9] p-6">
      <div className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">Set New Password</h2>
        {message && <p className="text-center mb-4 text-sm font-medium text-teal-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition duration-200"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResortResetPassword; 