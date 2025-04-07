import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResortCard = ({ donationId, name, food, quantity, expiry, location, foodType }) => {
  const navigate = useNavigate();

  const handleRequestPickup = async () => {
    try {
      const token = localStorage.getItem("ngoToken"); // ✅ Correct key from login
 // NGO's token
      const ngoId = localStorage.getItem("ngoId"); // if you're storing it

      const response = await axios.patch(
        `http://localhost:5000/api/ngo/donation/${donationId}/status`,
        {
          status: "Accepted",
          assignedNGO: ngoId,
          ngoComments: "We will pick it up within 2 hours.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pickup requested! Resort has been notified.");

      // Navigate after successful update
      navigate("/active-requests", {
        state: { name, food, quantity, expiry, location, foodType },
      });
    } catch (error) {
      console.error("Error requesting pickup:", error);
      alert("Something went wrong while requesting pickup.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center w-64">
      <h3 className="text-lg font-bold border-2 border-purple-500 p-1 rounded-md">
        {name}
      </h3>
      <p className="font-semibold mt-2">Food</p>
      <p>{food}</p>
      <p className="font-semibold mt-2">Quantity</p>
      <p>{quantity}</p>
      <p className="font-semibold mt-2">Expiry Time</p>
      <p>{expiry}</p>
      <p className="font-semibold mt-2">Location</p>
      <p>{location}</p>
      <p className="mt-2 text-sm font-semibold">Food Type - {foodType}</p>

      <button
        onClick={handleRequestPickup}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Request Pickup
      </button>
    </div>
  );
};

export default ResortCard;
