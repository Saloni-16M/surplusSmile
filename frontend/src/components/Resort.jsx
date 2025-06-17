import React, { useState, useEffect } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import axios from "axios";
import ResortForm from "./ResortForm";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";



const Resort = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [donationData, setDonationData] = useState([]);
  const resortName = localStorage.getItem("resortName") || "[Resort Name]";
  const resortId = localStorage.getItem("resortId");
  const token = localStorage.getItem("resortToken");
const [newPickupRequests, setNewPickupRequests] = useState([]);
const [showNotificationBox, setShowNotificationBox] = useState(false);
const notificationRef = useRef(null);
const navigate = useNavigate();
const notifyViaWhatsApp = (phone, message) => {
  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank");
};

  useEffect(() => {
      fetchDonations();
     const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotificationBox(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  
  }, []);

const fetchDonations = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/resort/donations/${resortId}/track`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const donations = response.data || [];

    // Identify ones where NGO has accepted but Resort hasn't confirmed
    const pendingPickup = donations.filter(
      d => d.pickupConfirmedByNGO && !d.pickupConfirmedByResort
      
    );
console.log("Updated donations:", donations);
console.log("Pending pickups:", pendingPickup);
    setDonationData(donations);
    setNewPickupRequests(pendingPickup);
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
};  const handleConfirmByResort = async (donationId) => {
    try {
      // Step 1: Confirm pickup by Resort
 console.log("Confirming pickup for:", donationId);
    await axios.put(`http://localhost:5000/api/pickup/confirm-by-resort/${donationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
      // Step 2: Optionally mark as picked if NGO already confirmed
      const updated = await axios.get(
        `http://localhost:5000/api/resort/donations/${resortId}/track`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonationData(updated.data || []);
    } catch (error) {
      console.error("Pickup confirmation error:", error.response?.data || error.message);
    }
  };

  const filteredDonations = donationData.filter((donation) =>
    donation.foodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0FAF4] p-6">
      {/* Navbar */}
      <div className="flex items-center justify-between bg-[#F0FAF4] p-4">
        <div>
          <h1 className="text-xl font-bold">
            Welcome <span className="text-purple-600">{resortName}!</span>
          </h1>
          <p className="italic text-gray-600">
            "No food should go to waste when someone is hungry."
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/guidelineResort")}
 className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
            Guidelines
          </button>
<div className="relative" ref={notificationRef}>
  <FaBell
    className="text-black text-xl cursor-pointer"
    onClick={() => setShowNotificationBox(prev => !prev)}
  />
  {newPickupRequests.length > 0 && (
    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
      {newPickupRequests.length}
    </span>
  )}

  {showNotificationBox && (
    <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
      <p className="text-sm font-semibold px-4 py-2 border-b">🛎️ Pickup Requests</p>
      {newPickupRequests.map((donation) => (
        <div key={donation._id} className="px-4 py-2 text-sm border-b hover:bg-gray-50">
          <p className="font-medium text-green-700">
            {donation.foodName} ({donation.quantity}kg)
          </p>
          <p className="text-xs text-gray-600">
            From: {donation.assignedNGO?.name || "NGO"}
          </p>
          {/* <button
            className="mt-1 text-blue-600 hover:underline text-xs"
            onClick={() =>
              notifyViaWhatsApp(
                "91XXXXXXXXXX", // Replace with actual number if available
                `🚚 New pickup requested for ${donation.foodName} (${donation.quantity}kg). Please confirm on your dashboard.`
              )
            }
          >
            Send WhatsApp Message
          </button> */}
        </div>
      ))}
    </div>
  )}
</div>
  <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 px-4 py-2 pl-10 rounded-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">Your Food Donations</h2>

        {filteredDonations.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Food Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Made Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Pickup Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Assigned NGO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Pickup Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.foodName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(donation.foodMadeDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.pickupAddress}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.assignedNGO?.name || "Not Assigned"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-700">
                      {donation.pickupStatus === "Picked"
                        ? "Picked ✅"
                        : donation.pickupConfirmedByResort
                        ? "Waiting for NGO"
                        : donation.pickupConfirmedByNGO
                        ? "Waiting for Resort"
                        : "Pending"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {donation.pickupStatus !== "Picked" &&
                        !donation.pickupConfirmedByResort && (
                          <button
                            onClick={() => handleConfirmByResort(donation._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Confirm Pickup
                          </button>
                        )}
                      {donation.pickupStatus === "Picked" && (
                        <span className="text-sm text-gray-600">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 italic">No donations found.</p>
        )}
      </div>

      {/* Food Donation Form */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold">Donate Food</h3>
        <ResortForm />
      </div>
    </div>
  );
};

export default Resort;