import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ResortCard from "./ResortCard";
import axios from "axios";
import { logoutAll } from '../utils/auth';
import { handleAuthError } from '../services/apiService';

const NGO = () => {
  const navigate = useNavigate();
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [resorts, setResorts] = useState([]); // Pending donations
  const [acceptedDonations, setAcceptedDonations] = useState([]); // Accepted donations
  const [loading, setLoading] = useState(true);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ngoName = localStorage.getItem("ngoName");
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("ngoToken");

    const fetchPendingDonations = async () => {
      try {
        const pendingRes = await axios.get("http://localhost:5000/api/ngo/donations/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const previouslyFetchedIds = resorts.map(d => d._id);
        const newOnes = pendingRes.data.filter(d => !previouslyFetchedIds.includes(d._id));
        setNewRequestsCount(newOnes.length);
        setResorts(pendingRes.data);
      } catch (error) {
        handleAuthError(error, 'ngo');
        setResorts([]);
      }
    };

    const fetchAcceptedDonations = async () => {
      try {
        const acceptedRes = await axios.get("http://localhost:5000/api/ngo/donations/accepted", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAcceptedDonations(acceptedRes.data || []);
      } catch (error) {
        handleAuthError(error, 'ngo');
        setAcceptedDonations([]);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingDonations(), fetchAcceptedDonations()]);
      setLoading(false);
    };

    fetchData();
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  const handleConfirmPickup = async (donationId) => {
    try {
      const token = localStorage.getItem("ngoToken");
      await axios.put(
        `http://localhost:5000/api/pickup/ngo/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedAccepted = await axios.get("http://localhost:5000/api/ngo/donations/accepted", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedDonations(prev =>
        prev.map(donation =>
          donation._id === donationId
            ? {
                ...donation,
                pickupConfirmedByNGO: true,
                pickupStatus:
                  donation.pickupConfirmedByResort && donation.pickupConfirmedByNGO
                    ? "Picked"
                    : donation.pickupStatus,
                pickupDate: new Date(),
              }
            : donation
        )
      );
      const donation = updatedAccepted.data.find((d) => d._id === donationId);
      if (donation?.pickupConfirmedByResort && donation?.pickupConfirmedByNGO) {
        await axios.put(
          `http://localhost:5000/api/pickup/mark-picked/${donationId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      // Optionally show error feedback
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("ngoToken");
    try {
      await axios.post(
        "http://localhost:5000/api/ngo/logout",
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
    localStorage.removeItem("ngoToken");
    localStorage.removeItem("ngoName");
    localStorage.removeItem("ngoId");
    window.location.href = "/ngo/login";
  };

  // Search functionality for available donations
  const filteredResorts = resorts.filter((donation) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const madeDate = donation.foodMadeDate ? new Date(donation.foodMadeDate).toLocaleDateString().toLowerCase() : "";
    return (
      (donation.foodName && donation.foodName.toLowerCase().includes(q)) ||
      (donation.quantity && donation.quantity.toString().toLowerCase().includes(q)) ||
      (donation.type && donation.type.toLowerCase().includes(q)) ||
      (donation.pickupAddress && donation.pickupAddress.toLowerCase().includes(q)) ||
      (donation.resortId && donation.resortId.name && donation.resortId.name.toLowerCase().includes(q)) ||
      (madeDate && madeDate.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-4 transition-all duration-300 fixed top-0 left-0 right-0 z-50 bg-teal-700/90 backdrop-blur-md shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold text-white">SurplusSmile</h1>
          <p className="italic text-teal-100 text-xs sm:text-base">Nourishing lives, reducing waste</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/guideline")}
            className="bg-white text-teal-700 px-4 py-2 rounded-lg font-bold shadow hover:bg-teal-50 border border-teal-200 transition"
          >
            Guidelines
          </button>
          <div className="relative" ref={notificationRef}>
            <FaBell
              className="text-teal-100 text-3xl cursor-pointer hover:text-yellow-300 transition drop-shadow-md"
              onClick={() => setShowNotificationBox((prev) => !prev)}
            />
            {newRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full border-2 border-white shadow">
                {newRequestsCount}
              </span>
            )}
            {showNotificationBox && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-teal-100 rounded shadow-lg z-10 max-h-60 overflow-y-auto animate-fadeIn">
                <p className="text-sm font-semibold px-4 py-2 border-b">🆕 New Donations</p>
                {filteredResorts.slice(0, newRequestsCount).map((donation) => (
                  <div key={donation._id} className="px-4 py-2 text-sm border-b hover:bg-teal-50">
                    <p className="font-medium text-teal-700">{donation.foodName}</p>
                    <p className="text-xs text-gray-600">{donation.resortId?.name || "Unknown Resort"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search donations..."
              className="border border-teal-300 px-4 py-2 pl-14 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-56 sm:w-72 bg-white shadow-md placeholder-teal-400 text-teal-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ boxShadow: '0 2px 8px 0 rgba(0,128,128,0.08)' }}
            />
            <span className="absolute left-4 inset-y-0 flex items-center pointer-events-none h-full">
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
        <h2 className="text-3xl font-bold text-teal-800 mb-2">Welcome, <span className="text-teal-600">{ngoName}</span>!</h2>
        <p className="text-gray-700 text-lg">Here are the latest food donations available for your NGO.</p>
      </div>

      {/* Available Food Donations Section */}
      <div className="w-full max-w-5xl mt-2 px-4">
        <h3 className="text-xl font-bold mb-4 text-teal-700">Available Food Donations</h3>
        {loading ? (
          <p className="text-gray-600 italic">Loading donations...</p>
        ) : filteredResorts.length === 0 ? (
          <p className="text-gray-600 italic">No pending donations found.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {filteredResorts.map((donation) => (
              <ResortCard
                key={donation._id}
                name={donation.resortId?.name || "Unknown Resort"}
                email={donation.email}
                location={donation.pickupAddress}
                food={donation.foodName}
                quantity={donation.quantity}
                foodType={donation.type}
                foodMadeDate={donation.foodMadeDate ? new Date(donation.foodMadeDate).toLocaleString() : "-"}
                donationId={donation._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Donation History Section */}
      <div className="w-full max-w-5xl mt-8 mb-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-teal-100">
          <h3 className="text-lg font-semibold text-teal-700 mb-2">Donation History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-teal-100">
              <thead className="bg-teal-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">S.No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Food Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Food Made Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Accepted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Pickup Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-teal-50">
                {acceptedDonations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-4 text-gray-600 text-center">
                      No accepted donations yet.
                    </td>
                  </tr>
                ) : (
                  acceptedDonations.map((donation, index) => (
                    <tr key={donation._id} className="hover:bg-teal-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{donation.foodName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{donation.foodMadeDate ? new Date(donation.foodMadeDate).toLocaleDateString() : "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {donation.acceptedDate
                          ? new Date(donation.acceptedDate).toLocaleDateString()
                          : "Not Accepted Yet"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{donation.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{donation.resortId?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-teal-700">
                        {donation.pickupStatus === "Picked" ? (
                          <span className="text-green-700 font-semibold">
                            Picked on {donation.pickupDate ? new Date(donation.pickupDate).toLocaleDateString() : "-"}
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">
                            Waiting for {donation.pickupConfirmedByNGO ? "Resort" : "NGO"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!donation.pickupConfirmedByNGO && (
                          <button
                            onClick={() => handleConfirmPickup(donation._id)}
                            className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                          >
                            Confirm Pickup
                          </button>
                        )}
                        {donation.pickupStatus === "Picked" && (
                          <span className="text-sm text-gray-500">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGO;
