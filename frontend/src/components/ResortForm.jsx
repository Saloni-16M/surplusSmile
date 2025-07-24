import React, { useState, useEffect } from "react";

const ResortForm = () => {
  const [formData, setFormData] = useState({
    resortId: "", // to be set via localStorage or props
    foodName: "",
    quantity: "",
    foodMadeDate: "",
    type: "Vegetarian",
    pickupAddress: "",
    additionalInfo: "",
    imageUrl: "" // optional
  });
  const token = localStorage.getItem("resortToken");
  const API = import.meta.env.VITE_API_URL;

  // Set resortId from localStorage on mount
  useEffect(() => {
    const storedResortId = localStorage.getItem("resortId");
    if (storedResortId) {
      setFormData((prev) => ({ ...prev, resortId: storedResortId }));
    }
  }, []);

  const sanitize = (str) => (typeof str === 'string' ? str.trim() : str);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sanitizedData = {
        ...formData,
        foodName: sanitize(formData.foodName),
        quantity: sanitize(formData.quantity),
        foodMadeDate: sanitize(formData.foodMadeDate),
        type: sanitize(formData.type),
        pickupAddress: sanitize(formData.pickupAddress),
        additionalInfo: sanitize(formData.additionalInfo),
        imageUrl: sanitize(formData.imageUrl),
      };
      const res = await fetch(`${API}/resort/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You can add Authorization header if token-based auth is used
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify(sanitizedData)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Food donation request submitted successfully!");
        console.log("Submitted:", data);
        setFormData({
          resortId: formData.resortId,
          foodName: "",
          quantity: "",
          foodMadeDate: "",
          type: "Vegetarian",
          pickupAddress: "",
          additionalInfo: "",
          imageUrl: ""
        });
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-[#F0FAF4] to-[#E8F5E9] p-6 flex flex-col items-center justify-start">
  <h2 className="text-3xl font-bold text-green-700 mb-6 tracking-tight">Food Donation Form</h2>
  <form
    onSubmit={handleSubmit}
    className="bg-white px-8 py-10 rounded-xl shadow-2xl w-full max-w-md space-y-5 border border-gray-200"
  >
    <label className="block">
      <span className="text-gray-700 font-semibold">Food Name</span>
      <input
        type="text"
        name="foodName"
        value={formData.foodName}
        onChange={handleChange}
        required
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none transition"
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-semibold">Quantity (plates/kg)</span>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-semibold">Food Made Date/Time</span>
      <input
        type="datetime-local"
        name="foodMadeDate"
        value={formData.foodMadeDate}
        onChange={handleChange}
        required
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-semibold">Food Type</span>
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
      >
        <option>Vegetarian</option>
        <option>Non-Vegetarian</option>
        <option>Vegan</option>
      </select>
    </label>

    <label className="block">
      <span className="text-gray-700 font-semibold">Pickup Address</span>
      <input
        type="text"
        name="pickupAddress"
        value={formData.pickupAddress}
        onChange={handleChange}
        required
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-semibold">Special Notes (Optional)</span>
      <textarea
        name="additionalInfo"
        value={formData.additionalInfo}
        onChange={handleChange}
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
      />
    </label>

    <label className="block">
      <span className="text-gray-700 font-semibold">Image URL (Optional)</span>
      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
      />
    </label>

    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-200"
    >
      Submit Donation
    </button>
  </form>
</div>  );
};

export default ResortForm;
