import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// NGO API Calls
export const registerNgo = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ngo/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};


// Resort API Calls
export const registerResort = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resort/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};



export const fetchNgos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/ngos`);
        return response.data.ngos || []; // Ensure data is always an array
    } catch (error) {
        console.error("Error fetching NGOs:", error);
        return [];
    }
};

export const fetchResorts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/resorts`);
        return response.data.resorts || []; // Ensure data is always an array
    } catch (error) {
        console.error("Error fetching Resorts:", error);
        return [];
    }
};
// Update NGO (for admin verification & comments)
export const updateNgo = async (id, data) => {
  try {
      console.log("🔹 Sending update request:", id, data);

      const response = await fetch(`http://localhost:5000/api/admin/ngos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // ✅ Ensuring no missing fields
      });

      const responseData = await response.json();

      if (!response.ok) {
          console.error("❌ Server responded with an error:", responseData);
          throw new Error(responseData.message || "Failed to update NGO");
      }

      return responseData;
  } catch (err) {
      console.error("❌ Error in updateNgo:", err);
      throw err;
  }
};



// Update Resort (for admin verification & comments)
export const updateResort = async (id, updateData) => {
  try {
      const response = await axios.put(`${API_BASE_URL}/admin/resorts/${id}`, updateData);
      return response.data;
  } catch (error) {
      throw error.response?.data || { message: "Failed to update Resort" };
  }
};
