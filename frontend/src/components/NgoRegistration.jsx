import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NgoRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    location: "",
    isCertified: false,
  });

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage("Please enter your email first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/ngo/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setIsOtpSent(true);
      setMessage("OTP sent to your email.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ngo/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setIsOtpVerified(true);
      setMessage("OTP verified successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setMessage("Please verify your OTP before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/ngo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Registration successful! Awaiting admin approval.");
      setShowModal(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FAF4] p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">NGO Registration</h2>

        {message && (
          <p
            className={`text-center text-sm mb-2 ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="NGO Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
            required
          />

          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Send OTP
            </button>
          </div>

          {isOtpSent && !isOtpVerified && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded-md w-full"
                required
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-blue-600 text-white px-4 py-1 rounded-md w-full"
              >
                Verify OTP
              </button>
            </div>
          )}

          {isOtpVerified && (
            <p className="text-green-600 text-sm text-center">✅ OTP Verified</p>
          )}

          <input
            type="tel"
            name="phone_no"
            placeholder="Phone Number"
            value={formData.phone_no}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
            required
          />
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="isCertified"
              checked={formData.isCertified}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Certified NGO</span>
          </label>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md w-full font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/ngo/login" className="text-blue-600 font-semibold">
            Login here
          </a>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h4 className="text-green-600 font-semibold text-lg">
              Registration Successful!
            </h4>
            <p className="text-gray-600 mt-2">
              Awaiting admin approval. Check your email for credentials!
            </p>
            <button
              onClick={handleClose}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoRegistration;
