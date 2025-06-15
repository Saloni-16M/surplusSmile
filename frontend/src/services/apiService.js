// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Helper to get auth headers
const getAuthConfig = () => {
  const token = localStorage.getItem("adminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};
const getResortAuthConfig = () => {
  const token = localStorage.getItem("resortToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const getNgoAuthConfig = () => {
  const token = localStorage.getItem("ngoToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// NGO API Calls
export const registerNgo = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ngo/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const fetchNgos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/ngos`, getAuthConfig());
    return response.data.ngos || [];
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    return [];
  }
};

export const approveNgo = async (ngoId, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/ngos/${ngoId}/approve`,
      data,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error approving NGO:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to approve NGO" };
  }
};

export const updateNgo = async (ngoId, adminComments) => {
  return await axios.put(
    `${API_BASE_URL}/admin/ngos/update/${ngoId}`,
    { adminComments: adminComments.adminComments },
    getAuthConfig()
  );
};
export const confirmPickupByNgo = async (donationId) => {
  return await axios.put(
    `${API_BASE_URL}/pickup/confirm-by-ngo/${donationId}`,
    {},
    getNgoAuthConfig()
  );
};

export const confirmPickupByResort = async (donationId) => {
  return await axios.put(
    `${API_BASE_URL}/pickup/confirm-by-resort/${donationId}`,
    {},
    getResortAuthConfig()
  );
};

export const markDonationAsPicked = async (donationId) => {
  return await axios.put(
    `${API_BASE_URL}/pickup/mark-picked/${donationId}`,
    {},
    getNgoAuthConfig() // or getResortAuthConfig() depending on who's calling it
  );
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

export const fetchResorts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/resorts`, getAuthConfig());
    return response.data.resorts || [];
  } catch (error) {
    console.error("Error fetching Resorts:", error);
    return [];
  }
};

export const approveResort = async (resortId, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/resorts/${resortId}/approve`,
      data,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error approving Resort:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to approve Resort" };
  }
};

export const updateResort = async (resortId, adminComments) => {
  return await axios.put(
    `${API_BASE_URL}/admin/resorts/update/${resortId}`,
    { adminComments: adminComments.adminComments },
    getAuthConfig()
  );
};