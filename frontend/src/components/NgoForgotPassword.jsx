import React, { useState } from "react";

const NgoForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/ngo/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Reset link sent! Check your email.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F1F8E9] p-6">
      <div className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">NGO Password Reset</h2>
        {message && <p className="text-center mb-4 text-sm font-medium text-blue-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition duration-200"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NgoForgotPassword; 