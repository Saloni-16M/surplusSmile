import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import ResortForm from "./ResortForm";
import { useNavigate } from "react-router-dom";
import { logoutAll } from '../utils/auth';
import { handleAuthError } from '../services/apiService';

const Resort = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const resortName = localStorage.getItem("resortName") || "[Resort Name]";
  const resortId = localStorage.getItem("resortId");
  const token = localStorage.getItem("resortToken");
  const [newPickupRequests, setNewPickupRequests] = useState([]);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

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
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/resort/donations/${resortId}/track`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const donations = response.data || [];
      setDonationData(donations);
      const pendingPickup = donations.filter(
        d => d.pickupConfirmedByNGO && !d.pickupConfirmedByResort
      );
      setNewPickupRequests(pendingPickup);
    } catch (error) {
      handleAuthError(error, 'resort');
      setDonationData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmByResort = async (donationId) => {
    try {
      setActionMessage("");
      await axios.put(
        `http://localhost:5000/api/pickup/resort/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage("Pickup confirmed successfully!");
      fetchDonations();
      setTimeout(() => setActionMessage(""), 2000);
    } catch (error) {
      setActionMessage("Failed to confirm pickup. Please try again.");
      setTimeout(() => setActionMessage(""), 2000);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("resortToken");
    try {
      await axios.post(
        "http://localhost:5000/api/resort/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      // Optionally handle error
      // console.error("Logout error:", err);
    }
    localStorage.removeItem("resortToken");
    localStorage.removeItem("resortName");
    localStorage.removeItem("resortId");
    window.location.href = "/resort/login";
  };

  const filteredDonations = donationData.filter((donation) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true; // Show all if search is empty
    const madeDate = donation.foodMadeDate ? new Date(donation.foodMadeDate).toLocaleDateString().toLowerCase() : "";
    return (
      (donation.foodName && donation.foodName.toLowerCase().includes(q)) ||
      (donation.quantity && donation.quantity.toString().toLowerCase().includes(q)) ||
      (donation.type && donation.type.toLowerCase().includes(q)) ||
      (donation.pickupAddress && donation.pickupAddress.toLowerCase().includes(q)) ||
      (donation.assignedNGO && donation.assignedNGO.name && donation.assignedNGO.name.toLowerCase().includes(q)) ||
      (madeDate && madeDate.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-4 transition-all duration-300 fixed top-0 left-0 right-0 z-50 bg-teal-700/90 backdrop-blur-md shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold text-white">SurplusSmile</h1>
          <p className="italic text-teal-100 text-xs sm:text-base">"No food should go to waste when someone is hungry."</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/guidelineResort")}
            className="bg-white text-teal-700 px-4 py-2 rounded-lg font-bold shadow hover:bg-teal-50 border border-teal-200 transition"
          >
            Guidelines
          </button>
          <div className="relative" ref={notificationRef}>
            <FaBell
              className="text-white text-2xl cursor-pointer hover:text-yellow-300 transition"
              onClick={() => setShowNotificationBox((prev) => !prev)}
            />
            {newPickupRequests.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {newPickupRequests.length}
              </span>
            )}
            {showNotificationBox && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-teal-100 rounded shadow-lg z-10 max-h-60 overflow-y-auto animate-fadeIn">
                <p className="text-sm font-semibold px-4 py-2 border-b">🛎️ Pickup Requests</p>
                {newPickupRequests.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">No new pickup requests.</p>
                ) : (
                  newPickupRequests.map((donation) => (
                    <div key={donation._id} className="px-4 py-2 text-sm border-b hover:bg-teal-50">
                      <p className="font-medium text-teal-700">
                        {donation.foodName} ({donation.quantity}kg)
                      </p>
                      <p className="text-xs text-gray-600">
                        From: {donation.assignedNGO?.name || "NGO"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search donations..."
              className="border border-teal-300 px-4 py-2 pl-14 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-48 sm:w-64 bg-white shadow-sm placeholder-teal-400 text-teal-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ boxShadow: '0 2px 8px 0 rgba(0,128,128,0.06)' }}
            />
            <span className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none h-full">
              <FaSearch className="text-teal-400 text-base" />
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="w-full max-w-5xl mt-24 mb-4 px-4">
        <h2 className="text-3xl font-bold text-teal-800 mb-2">Welcome, <span className="text-teal-600">{resortName}</span>!</h2>
        <p className="text-gray-700 text-lg">Manage your food donations and track pickups here.</p>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div className="w-full max-w-2xl mx-auto bg-teal-100 border border-teal-400 text-teal-700 px-4 py-2 rounded mb-4 text-center animate-fadeIn">
          {actionMessage}
        </div>
      )}

      {/* Donation History Table */}
      <div className="w-full max-w-5xl mt-2 px-4">
        <h3 className="text-xl font-bold mb-4 text-teal-700">Your Food Donations</h3>
        {loading ? (
          <p className="text-gray-600 italic">Loading donations...</p>
        ) : filteredDonations.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-teal-100">
              <thead className="bg-teal-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Food Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Made Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Pickup Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Assigned NGO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Pickup Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-teal-50">
                {filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-teal-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.foodName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(donation.foodMadeDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.pickupAddress}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{donation.assignedNGO?.name || "Not Assigned"}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-teal-700">
                      {donation.pickupStatus === "Picked"
                        ? "Picked ✅"
                        : donation.pickupConfirmedByResort
                        ? "Waiting for NGO"
                        : donation.pickupConfirmedByNGO
                        ? "Waiting for Resort"
                        : "Pending"}
                    </td>
                    <td className="px-6 py-4">
                      {donation.pickupStatus !== "Picked" &&
                        !donation.pickupConfirmedByResort && (
                          <button
                            onClick={() => handleConfirmByResort(donation._id)}
                            className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
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
      <div className="w-full max-w-2xl mt-8 mb-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-teal-100">
          <h3 className="text-lg font-semibold text-teal-700 mb-2">Donate Food</h3>
          <ResortForm />
        </div>
      </div>
    </div>
  );
};

export default Resort;