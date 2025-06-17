import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchNgos,
  fetchResorts,
  approveNgo,
  approveResort,
  updateNgo,
  updateResort,
} from "../services/apiService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const ngosData = await fetchNgos();
        const resortsData = await fetchResorts();

        setNgos(ngosData);
        setResorts(resortsData);

        const initialComments = {};
        ngosData.forEach((ngo) => (initialComments[ngo._id] = ngo.adminComments || ""));
        resortsData.forEach((resort) => (initialComments[resort._id] = resort.adminComments || ""));
        setComments(initialComments);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleApprovalChange = async (id, type) => {
    try {
      if (type === "ngo") {
        const updatedNgo = await approveNgo(id, { isApproved: true });
        setNgos((prev) =>
          prev.map((ngo) =>
            ngo._id === id
              ? { ...ngo, adminApprovalStatus: "Approved", loginId: updatedNgo.loginId }
              : ngo
          )
        );
      } else {
        const updatedResort = await approveResort(id, { isApproved: true });
        setResorts((prev) =>
          prev.map((resort) =>
            resort._id === id
              ? { ...resort, adminApprovalStatus: "Approved", loginId: updatedResort.loginId }
              : resort
          )
        );
      }

      alert(`${type === "ngo" ? "NGO" : "Resort"} approved successfully!`);
    } catch (error) {
      alert(`Error approving ${type}`);
    }
  };

  const handleSave = async (id, type) => {
    try {
      if (type === "ngo") {
        await updateNgo(id, { adminComments: comments[id] });
      } else {
        await updateResort(id, { adminComments: comments[id] });
      }

      const updatedNgos = await fetchNgos();
      const updatedResorts = await fetchResorts();
      setNgos(updatedNgos);
      setResorts(updatedResorts);

      alert(`${type === "ngo" ? "NGO" : "Resort"} comment saved!`);
    } catch (error) {
      alert(`Error saving ${type} comment.`);
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="error">{error}</p>;

  const renderTable = (data, type) => (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Admin Comments</th>
          <th>Approval</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const address = item.address
            || [item.addressLine1, item.city, item.state].filter(Boolean).join(", ")
            || "No address provided";

          return (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{address}</td>
              <td>
                {item.adminComments ? item.adminComments : (
                  <input
                    type="text"
                    value={comments[item._id]}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [item._id]: e.target.value }))
                    }
                  />
                )}
              </td>
              <td>{item.adminApprovalStatus}</td>
              <td>
                {item.adminApprovalStatus !== "Approved" && (
                  <button onClick={() => handleApprovalChange(item._id, type)}>
                    Approve
                  </button>
                )}
                {!item.adminComments && (
                  <button onClick={() => handleSave(item._id, type)}>Save</button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="admin-dashboard">
      <h2>Registered NGOs</h2>
      {ngos.length > 0 ? renderTable(ngos, "ngo") : <p>No NGOs registered.</p>}

      <h2>Registered Resorts</h2>
      {resorts.length > 0 ? renderTable(resorts, "resort") : <p>No Resorts registered.</p>}
    </div>
  );
};

export default AdminDashboard;
