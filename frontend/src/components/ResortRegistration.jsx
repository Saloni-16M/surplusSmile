import React, { useState, useEffect } from "react";

const ResortRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    latitude: "",
    longitude: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const res = await fetch("http://localhost:5000/api/location/reverse-geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });

      const data = await res.json();
      const address = data.address || {};

      console.log("Reverse geocode response:", data);

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

  const getCoordinatesFromAddress = async () => {
    const { addressLine1, city, state, pincode } = formData;
    const fullAddress = `${addressLine1}, ${city}, ${state} - ${pincode}`;

    try {
      const res = await fetch("http://localhost:5000/api/geocode/get-coordinates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: fullAddress }),
      });

      if (!res.ok) throw new Error(`API responded with ${res.status}`);

      const data = await res.json();

      if (data.lat && data.lon) {
        setFormData((prev) => ({
          ...prev,
          latitude: data.lat,
          longitude: data.lon,
        }));
        setMessage("Coordinates fetched from address.");
      }
    } catch (error) {
      setMessage("Failed to get coordinates: " + error.message);
    }
  };

  // 👇 Avoid fetching coordinates if already set via "Detect My Location"
  useEffect(() => {
    const { addressLine1, city, state, pincode, latitude, longitude } = formData;

    if (latitude && longitude) return;

    if (addressLine1 && city && state && pincode.length === 6) {
      const timer = setTimeout(() => {
        getCoordinatesFromAddress();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.addressLine1, formData.city, formData.state, formData.pincode, formData.latitude, formData.longitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = Number(formData.latitude);
    const lon = Number(formData.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setMessage("Latitude or Longitude is invalid or missing.");
      return;
    }

    const fullAddress = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

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
      const response = await fetch("http://localhost:5000/api/resort/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Resort registered successfully!");
      setFormData({
        name: "",
        email: "",
        phone_no: "",
        latitude: "",
        longitude: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FAF4] to-[#E8F5E9] p-6">
  <div className="bg-white shadow-2xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-green-700 mb-6 tracking-tight">
      Resort Registration
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
      <input
        type="text"
        name="name"
        placeholder="Resort Name"
        value={formData.name}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500 transition"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="tel"
        name="phone_no"
        placeholder="Phone Number"
        value={formData.phone_no}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
        required
      />
      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
        required
      />
      <label className="flex items-center space-x-3 text-sm">
        <input
          type="checkbox"
          name="isCertified"
          checked={formData.isCertified}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <span className="text-gray-700 font-semibold">Certified Resort</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition w-full font-semibold text-lg"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>

    <p className="text-center mt-6 text-sm text-gray-600">
      Already have an account?{" "}
      <a
        href="/resort/login"
        className="text-green-600 hover:text-green-800 font-semibold underline"
      >
        Login here
      </a>
    </p>
  </div>

  {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm text-center border border-gray-300">
        <h4 className="text-green-600 font-semibold text-lg">Registration Successful!</h4>
        <p className="text-gray-600 mt-2">Awaiting admin approval. Mail will be sent to you!</p>
        <button
          onClick={handleClose}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          OK
        </button>
      </div>
    </div>
  )}
</div>  );
};

export default ResortRegistration;
