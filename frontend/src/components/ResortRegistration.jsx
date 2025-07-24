import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResortRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    latitude: "",
    longitude: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
          }));

          getAddressFromCoordinates(lat, lon);
        },
        (error) => {
          setMessage("Failed to fetch location: " + error.message);
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser");
    }
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/location/reverse-geocode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });

      const data = await res.json();
      const address = data.address || {};

      setFormData((prev) => ({
        ...prev,
        addressLine1: data.display_name || "",
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        pincode: address.postcode || "",
      }));

      setMessage("Location and address fetched successfully.");
    } catch (error) {
      setMessage("Failed to fetch address: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const lat = Number(formData.latitude);
    const lon = Number(formData.longitude);

    // if (isNaN(lat) || isNaN(lon)) {
    //   setMessage("Latitude or Longitude is invalid or missing.");
    //   setLoading(false);
    //   return;
    // }

const fullAddress = `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone_no: formData.phone_no,
      address: fullAddress,
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
    };

    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API}/resort/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Resort registered successfully wait till admin will approve your Registration!");
      setFormData({
        name: "",
        email: "",
        phone_no: "",
        latitude: "",
        longitude: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      let msg = error.message;
      if (msg.includes('CORS policy')) {
        msg = 'Access denied: Your browser is not allowed to connect to the server. Please contact support.';
      } else if (msg.includes('E11000 duplicate key error') && msg.includes('phone_no')) {
        msg = 'This phone number is already registered. Please use a different phone number or log in.';
      }
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F1F8E9] p-6">
      <div className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6 tracking-tight">
          Resort Registration
        </h2>

        {message && (
<p className={`text-center text-sm mb-4 font-medium ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="name" placeholder="Resort Name" value={formData.name} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="tel" name="phone_no" placeholder="Phone Number" value={formData.phone_no} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />

          <button type="button" onClick={fetchLocation} className="bg-yellow-500 text-white px-3 py-1 rounded-md w-full">
            📍 Detect My Location
          </button>

          {formData.latitude && formData.longitude && (
            <p className="text-center text-sm text-gray-700">
              📍 Latitude: {formData.latitude} | Longitude: {formData.longitude}
            </p>
          )}

          <button type="submit" disabled={loading} className="bg-teal-600 text-white px-6 py-3 rounded-md w-full">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResortRegistration;