import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NgoRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    isCertified: false,
    latitude: null,
    longitude: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const API = import.meta.env.VITE_API_URL;

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
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

  // const getCoordinatesFromAddress = async () => {
  //   const { addressLine1, city, state, pincode } = formData;
  //   const fullAddress = `${addressLine1}, ${city}, ${state} - ${pincode}`;

  //   try {
  //     const res = await fetch("http://localhost:5000/api/geocode/get-coordinates", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ address: fullAddress }),
  //     });

  //     if (!res.ok) throw new Error(`API responded with ${res.status}`);
  //     const data = await res.json();

  //     if (data.lat && data.lon) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         latitude: data.lat,
  //         longitude: data.lon,
  //       }));
  //       setMessage("Coordinates fetched from address.");
  //     }
  //   } catch (error) {
  //     setMessage("Failed to get coordinates: " + error.message);
  //   }
  // };

  // useEffect(() => {
  //   const { addressLine1, city, state, pincode, latitude, longitude } = formData;
  //   if (!latitude && !longitude && addressLine1 && city && state && pincode.length === 6) {
  //     const timer = setTimeout(() => {
  //       getCoordinatesFromAddress();
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [formData.addressLine1, formData.city, formData.state, formData.pincode, formData.latitude, formData.longitude]);

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      setMessage("Please enter your email first.");
      return;
    }

    try {
      const response = await fetch(`${API}/ngo/send-otp`, {
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

  const verifyEmailOtp = async () => {
    try {
      const response = await fetch(`${API}/ngo/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setIsOtpVerified(true);
      setMessage("Email OTP verified successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setMessage("Please verify your Email OTP before submitting.");
      return;
    }

    if (!formData.addressLine1 || !formData.city || !formData.state || formData.pincode.length !== 6) {
      setMessage("Please fill in complete address details.");
      return;
    }

    const fullAddress = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

    const lon = parseFloat(formData.longitude);
    const lat = parseFloat(formData.latitude);

    const submissionData = {
      ...formData,
      address: fullAddress,
    };

    // Only add location if coordinates are valid
    if (!isNaN(lon) && !isNaN(lat)) {
      submissionData.location = {
        type: "Point",
        coordinates: [lon, lat],
      };
    }

    // Remove the original address fields
    delete submissionData.addressLine1;
    delete submissionData.addressLine2;
    delete submissionData.city;
    delete submissionData.state;
    delete submissionData.pincode;

    try {
      const response = await fetch(`${API}/ngo/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage("NGO registered successfully!");
      setFormData({
        name: "",
        email: "",
        phone_no: "",
        isCertified: false,
        latitude: null,
        longitude: null,
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
      });
      setOtp("");
      setIsOtpSent(false);
      setIsOtpVerified(false);
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
    }
  };

  return (
    /* Updated styles inside JSX */
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F1F8E9] p-6">

      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg  border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">NGO Registration</h2>

        {message && <p className="text-sm text-center text-red-600 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="NGO Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            required
          />

          <div className="flex space-x-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={handleSendEmailOtp}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </div>

          {isOtpSent && !isOtpVerified && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={verifyEmailOtp}
                className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition w-full"
              >
                Verify OTP
              </button>
            </div>
          )}

          {isOtpVerified && (
            <p className="text-green-600 text-sm text-center font-semibold">✅ Email Verified</p>
          )}

          <input
            type="tel"
            name="phone_no"
            placeholder="Phone Number"
            value={formData.phone_no}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
            required
          />

          <input type="text" name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />
          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-500" required />




          <div className="flex items-center space-x-3">
            <input type="checkbox" name="isCertified" checked={formData.isCertified} onChange={handleChange} />
            <label htmlFor="isCertified" className="text-gray-700 font-semibold">Certified NGO</label>
          </div>
          <button type="button" onClick={fetchLocation} className="bg-yellow-500 text-white px-3 py-1 rounded-md w-full">
            📍 Detect My Location
          </button>

          {formData.latitude && formData.longitude && (
            <p className="text-center text-sm text-gray-700">
              📍 Latitude: {formData.latitude} | Longitude: {formData.longitude}
            </p>
          )}

          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition w-full font-semibold text-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>);
};

export default NgoRegistration;
