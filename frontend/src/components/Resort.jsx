import React, { useState, useEffect } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import axios from "axios";
import ResortForm from "./ResortForm";

const Resort = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [donationData, setDonationData] = useState([]);
  const resortName = localStorage.getItem("resortName") || "[Resort Name]";

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("resortToken"); // Adjust if different
        const resortId = localStorage.getItem("resortId");


        const response = await axios.get(
          `http://localhost:5000/api/resort/donations/${resortId}/track`
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        );
        setDonationData(response.data || []);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

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
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
            Guidelines
          </button>
          <div className="relative">
            <FaBell className="text-black text-xl cursor-pointer" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              0
            </span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Pickup Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.foodName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.foodMadeDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.pickupAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation?.assignedNGO?.name || "Not Assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-700">
                      {donation.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700">
                      {donation.pickupStatus || "Pending"}
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
