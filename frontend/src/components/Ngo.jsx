import React, { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ResortCard from "./ResortCard";
import axios from "axios";
import { useRef } from "react";

const NGO = () => {
  const navigate = useNavigate();
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [resorts, setResorts] = useState([]); // Pending donations
  const [acceptedDonations, setAcceptedDonations] = useState([]); // Accepted donations
  const [loading, setLoading] = useState(true);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const ngoName = localStorage.getItem("ngoName");
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("ngoToken");
 
    const fetchPendingDonations = async () => {
      try {
        const pendingRes = await axios.get("http://localhost:5000/api/ngo/donations/pending");
        const previouslyFetchedIds = resorts.map(d => d._id); // from existing state
    const newOnes = pendingRes.data.filter(d => !previouslyFetchedIds.includes(d._id));
    setNewRequestsCount(newOnes.length);
        setResorts(pendingRes.data);
      } catch (error) {
        console.error("Error fetching pending donations:", error.response?.data || error.message);
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
        console.error("Error fetching accepted donations:", error.response?.data || error.message);
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

      // Step 1: Confirm pickup by NGO
      await axios.put(
        `http://localhost:5000/api/pickup/confirm-by-ngo/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 2: Re-fetch updated accepted donations
      const updatedAccepted = await axios.get("http://localhost:5000/api/ngo/donations/accepted", {
        headers: { Authorization: `Bearer ${token}` },
      });
// ✅ After all async operations
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
          pickupDate: new Date(), // Optional: simulate immediate timestamp
        }
      : donation
  )
);
      // Step 3: Check if resort also confirmed, then mark as picked
      const donation = updatedAccepted.data.find((d) => d._id === donationId);
      if (donation?.pickupConfirmedByResort && donation?.pickupConfirmedByNGO) {
        await axios.put(
          `http://localhost:5000/api/pickup/mark-picked/${donationId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Pickup confirmation failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FAF4] p-4">
      {/* Navbar Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">
          Welcome <span className="text-purple-800">{ngoName}!</span>
          <p className="text-gray-700">Nourishing lives, reducing waste</p>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/guideline")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Guideline
          </button>
<div className="relative" ref={notificationRef}>
  <FaBell
    className="text-xl text-black cursor-pointer"
    onClick={() => setShowNotificationBox(prev => !prev)}
  />
  {newRequestsCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
      {newRequestsCount}
    </span>
  )}
  {showNotificationBox && (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
      <p className="text-sm font-semibold px-4 py-2 border-b">🆕 New Donations</p>
      {resorts.slice(0, newRequestsCount).map((donation) => (
        <div key={donation._id} className="px-4 py-2 text-sm border-b hover:bg-gray-50">
          <p className="font-medium">{donation.foodName}</p>
          <p className="text-gray-600 text-xs">{donation.resortId?.name || "Unknown Resort"}</p>
        </div>
      ))}
    </div>
  )}
</div>
          <div className="flex items-center border border-gray-400 rounded-full px-3 py-1 bg-white">
            <input type="text" placeholder="Search" className="outline-none bg-transparent" />
            <FaSearch className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Available Food Donations Section */}
      <h2 className="mt-6 text-2xl font-bold text-center">Available Food Donations</h2>
      {loading ? (
        <p className="text-center mt-6 text-gray-600">Loading donations...</p>
      ) : resorts.length === 0 ? (
        <p className="text-center mt-6 text-gray-600">No pending donations found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {resorts.map((donation) => (
            <ResortCard
              key={donation._id}
              name={donation.resortId?.name || "Unknown Resort"}
              email={donation.email}
              location={donation.pickupAddress}
              food={donation.foodName}
              quantity={donation.quantity}
              foodType={donation.type}
              expiry={new Date(donation.foodMadeDate).toLocaleString()}
              donationId={donation._id}
            />
          ))}
        </div>
      )}

      {/* Donation History Section */}
      <h2 className="mt-8 text-2xl font-bold text-center text-green-700 border-b-4 border-green-500 pb-2">
        Donation History
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-black text-center">
          <thead className="bg-gray-300">
            <tr>
              <th className="border border-black px-4 py-2">S.No.</th>
              <th className="border border-black px-4 py-2">Accepted Date</th>
              <th className="border border-black px-4 py-2">Quantity (in Kgs)</th>
              <th className="border border-black px-4 py-2">Donor</th>
              <th className="border border-black px-4 py-2">Pickup Status</th>
              <th className="border border-black px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {acceptedDonations.length === 0 ? (
              <tr>
                <td colSpan="6" className="border border-black px-4 py-4 text-gray-600">
                  No accepted donations yet.
                </td>
              </tr>
            ) : (
              acceptedDonations.map((donation, index) => (
                <tr key={donation._id} className="bg-white">
                  <td className="border border-black px-4 py-2">{index + 1}</td>
                  <td className="border border-black px-4 py-2">
                    {donation.acceptedDate
                      ? new Date(donation.acceptedDate).toLocaleDateString()
                      : "Not Accepted Yet"}
                  </td>
                  <td className="border border-black px-4 py-2">{donation.quantity}</td>
                  <td className="border border-black px-4 py-2">
                    {donation.resortId?.name || "Unknown"}
                  </td>
                  <td className="border border-black px-4 py-2">
                    {donation.pickupStatus === "Picked" ? (
                      <span className="text-green-700 font-semibold">
                        Picked on {new Date(donation.pickupDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Waiting for {donation.pickupConfirmedByNGO ? "" : "NGO "}
                        {donation.pickupConfirmedByNGO && !donation.pickupConfirmedByResort ? "Resort" : ""}
                      </span>
                    )}
                  </td>
                  <td className="border border-black px-4 py-2">
                    {!donation.pickupConfirmedByNGO && (
                      <button
                        onClick={() => handleConfirmPickup(donation._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
  );
};

export default NGO;
