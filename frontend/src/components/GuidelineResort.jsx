import React from "react";

const GuidelineResort = () => {
  return (
    <div className="min-h-screen bg-[#F0FAF4] p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
           Food Donation Guidelines for Resorts
        </h1>

        <ul className="space-y-4 text-gray-800 leading-relaxed">
          <li>
             <strong>Donate Only Safe, Edible Food:</strong> Food should be freshly cooked and unspoiled. Avoid donating anything expired or reheated.
          </li>
          <li>
             <strong>Maintain Proper Temperature:</strong> Hot food should be kept hot and cold food cold until pickup to ensure safety.
          </li>
          <li>
             <strong>Packaging:</strong> Pack food securely in clean containers. Label clearly if it contains allergens or is vegetarian/non-vegetarian.
          </li>
          <li>
             <strong>Timely Entry:</strong> Add donations as soon as food is ready to avoid wastage and enable quicker NGO response.
          </li>
          <li>
             <strong>Accurate Pickup Address:</strong> Ensure the pickup address is correct and accessible. Add any special instructions if needed.
          </li>
          <li>
             <strong>Confirm Pickup:</strong> Once an NGO confirms, you’ll be notified. Don’t forget to confirm pickup from your side to complete the cycle.
          </li>
          <li>
             <strong>Contact Support:</strong> For issues or urgent changes, reach out through our support portal or your WhatsApp notification.
          </li>
        </ul>

        <p className="mt-6 text-center text-sm italic text-gray-500">
          "Every plate you donate brings a smile to someone’s face."
        </p>
      </div>
    </div>
  );
};

export default GuidelineResort;