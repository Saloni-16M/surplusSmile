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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Resort Registration</h2>

      {message && <p className="text-sm text-center text-red-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Resort Name" value={formData.name} onChange={handleChange} className="border p-2 rounded-md w-full" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded-md w-full" required />
        <input type="tel" name="phone_no" placeholder="Phone Number" value={formData.phone_no} onChange={handleChange} className="border p-2 rounded-md w-full" required />

        <input type="text" name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} className="border p-2 rounded-md w-full" required />
        <input type="text" name="addressLine2" placeholder="Address Line 2 (Optional)" value={formData.addressLine2} onChange={handleChange} className="border p-2 rounded-md w-full" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-2 rounded-md w-full" required />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border p-2 rounded-md w-full" required />
        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="border p-2 rounded-md w-full" required maxLength="6" />

        <button type="button" onClick={fetchLocation} className="bg-yellow-500 text-white px-3 py-1 rounded-md w-full">
          📍 Detect My Location
        </button>

        {formData.latitude && (
          <p className="text-center text-sm text-gray-700">
            📍 Latitude: {formData.latitude} | Longitude: {formData.longitude}
          </p>
        )}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default ResortRegistration;
