import React, { useState } from "react";

const NgoLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/ngo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("ngoToken", data.token);
      localStorage.setItem("ngoId", data.ngo._id); // ✅ Correct
      localStorage.setItem("ngoName", data.ngo.name);

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/ngo"; // Redirect to NGO dashboard
      }, 1500);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F1F8E9] p-6">
  <div className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-teal-700 mb-6 tracking-tight">
      NGO Login
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
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition duration-200"
      >
        Login
      </button>
    </form>

    <p className="text-center mt-6 text-sm text-gray-600">
      Not registered?{" "}
      <a href="/ngo/register" className="text-blue-600 hover:text-blue-800 font-semibold underline">
        Register here
      </a>
    </p>
  </div>
</div>
  );
};

export default NgoLogin;
