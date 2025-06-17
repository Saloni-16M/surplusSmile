import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  fetchNgos, 
  fetchResorts, 
  approveNgo, 
  approveResort, 
  updateNgo, 
  updateResort 
} from "../services/apiService";
import { FiCheck, FiX, FiEdit, FiSave, FiMapPin, FiMail, FiPhone, FiUser } from "react-icons/fi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("ngos");
  const [searchTerm, setSearchTerm] = useState("");
  const [ngoAddresses, setNgoAddresses] = useState({});
  const [resortAddresses, setResortAddresses] = useState({});
  const [stats, setStats] = useState({
    totalNgos: 0,
    approvedNgos: 0,
    totalResorts: 0,
    approvedResorts: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [ngosData, resortsData] = await Promise.all([
          fetchNgos(),
          fetchResorts()
        ]);

        setNgos(ngosData);
        setResorts(resortsData);

        // Calculate statistics
        setStats({
          totalNgos: ngosData.length,
          approvedNgos: ngosData.filter(n => n.adminApprovalStatus === "Approved").length,
          totalResorts: resortsData.length,
          approvedResorts: resortsData.filter(r => r.adminApprovalStatus === "Approved").length
        });

        // Initialize comments
        const initialComments = {};
        ngosData.forEach(ngo => initialComments[ngo._id] = ngo.adminComments || "");
        resortsData.forEach(resort => initialComments[resort._id] = resort.adminComments || "");
        setComments(initialComments);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const newNgoAddresses = {};
      const newResortAddresses = {};

      for (const ngo of ngos) {
        try {
          const address = await getAddressFromCoordinates(
            ngo.location.coordinates[1], 
            ngo.location.coordinates[0]
          );
          newNgoAddresses[ngo._id] = address;
        } catch (error) {
          newNgoAddresses[ngo._id] = "Location not available";
        }
      }

      for (const resort of resorts) {
        try {
          const address = await getAddressFromCoordinates(
            resort.location.coordinates[1], 
            resort.location.coordinates[0]
          );
          newResortAddresses[resort._id] = address;
        } catch (error) {
          newResortAddresses[resort._id] = "Location not available";
        }
      }

      setNgoAddresses(newNgoAddresses);
      setResortAddresses(newResortAddresses);
    };

    if (ngos.length > 0 || resorts.length > 0) {
      fetchAddresses();
    }
  }, [ngos, resorts]);

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      return data.display_name || "Location not specified";
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return "Location not available";
    }
  };

  const handleApproval = async (id, type) => {
    try {
      const isConfirmed = window.confirm(
        `Are you sure you want to approve this ${type}?`
      );
      if (!isConfirmed) return;

      if (type === "ngo") {
        const updatedNgo = await approveNgo(id, { isApproved: true });
        setNgos(prev => prev.map(ngo =>
          ngo._id === id ? { ...ngo, adminApprovalStatus: "Approved", loginId: updatedNgo.loginId } : ngo
        ));
        setStats(prev => ({ ...prev, approvedNgos: prev.approvedNgos + 1 }));
      } else {
        const updatedResort = await approveResort(id, { isApproved: true });
        setResorts(prev => prev.map(resort =>
          resort._id === id ? { ...resort, adminApprovalStatus: "Approved", loginId: updatedResort.loginId } : resort
        ));
        setStats(prev => ({ ...prev, approvedResorts: prev.approvedResorts + 1 }));
      }
    } catch (error) {
      alert(`Error approving ${type}: ${error.message}`);
    }
  };

  const handleReject = async (id, type) => {
    try {
      const reason = prompt(`Enter reason for rejecting this ${type}:`);
      if (!reason) return;

      if (type === "ngo") {
        await updateNgo(id, { adminApprovalStatus: "Rejected", adminComments: reason });
        setNgos(prev => prev.map(ngo =>
          ngo._id === id ? { ...ngo, adminApprovalStatus: "Rejected", adminComments: reason } : ngo
        ));
      } else {
        await updateResort(id, { adminApprovalStatus: "Rejected", adminComments: reason });
        setResorts(prev => prev.map(resort =>
          resort._id === id ? { ...resort, adminApprovalStatus: "Rejected", adminComments: reason } : resort
        ));
      }
    } catch (error) {
      alert(`Error rejecting ${type}: ${error.message}`);
    }
  };

  const startEditing = (id) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSaveComment = async (id, type) => {
    try {
      if (type === "ngo") {
        await updateNgo(id, { adminComments: comments[id] });
        setNgos(prev => prev.map(ngo =>
          ngo._id === id ? { ...ngo, adminComments: comments[id] } : ngo
        ));
      } else {
        await updateResort(id, { adminComments: comments[id] });
        setResorts(prev => prev.map(resort =>
          resort._id === id ? { ...resort, adminComments: comments[id] } : resort
        ));
      }
      setEditingId(null);
    } catch (error) {
      alert(`Error saving comment: ${error.message}`);
    }
  };

  const filteredNgos = ngos.filter(ngo =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ngo.adminComments && ngo.adminComments.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredResorts = resorts.filter(resort =>
    resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resort.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resort.adminComments && resort.adminComments.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="badge approved"><FiCheck /> Approved</span>;
      case "Rejected":
        return <span className="badge rejected"><FiX /> Rejected</span>;
      default:
        return <span className="badge pending">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total NGOs</h3>
          <p>{stats.totalNgos}</p>
          <div className="stat-detail">
            <span className="approved">{stats.approvedNgos} approved</span>
            <span>{stats.totalNgos - stats.approvedNgos} pending</span>
          </div>
        </div>
        <div className="stat-card">
          <h3>Total Resorts</h3>
          <p>{stats.totalResorts}</p>
          <div className="stat-detail">
            <span className="approved">{stats.approvedResorts} approved</span>
            <span>{stats.totalResorts - stats.approvedResorts} pending</span>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={activeTab === "ngos" ? "active" : ""}
            onClick={() => setActiveTab("ngos")}
          >
            NGOs ({ngos.length})
          </button>
          <button
            className={activeTab === "resorts" ? "active" : ""}
            onClick={() => setActiveTab("resorts")}
          >
            Resorts ({resorts.length})
          </button>
        </div>
      </div>

      <div className="table-container">
        {activeTab === "ngos" ? (
          filteredNgos.length > 0 ? (
            <table className="organizations-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNgos.map(ngo => (
                  <tr key={ngo._id}>
                    <td>
                      <div className="org-info">
                        <div className="org-name">{ngo.name}</div>
                        <div className="org-id">ID: {ngo._id}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div><FiMail /> {ngo.email}</div>
                        {ngo.phone && <div><FiPhone /> {ngo.phone}</div>}
                        {ngo.contactPerson && <div><FiUser /> {ngo.contactPerson}</div>}
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <FiMapPin /> {ngoAddresses[ngo._id] || "Loading location..."}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(ngo.adminApprovalStatus)}
                    </td>
                    <td>
                      {editingId === ngo._id ? (
                        <textarea
                          value={comments[ngo._id]}
                          onChange={(e) =>
                            setComments(prev => ({ ...prev, [ngo._id]: e.target.value }))
                          }
                          placeholder="Enter comments..."
                        />
                      ) : (
                        <div className="comments">
                          {ngo.adminComments || "No comments"}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {ngo.adminApprovalStatus !== "Approved" && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleApproval(ngo._id, "ngo")}
                            >
                              <FiCheck /> Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleReject(ngo._id, "ngo")}
                            >
                              <FiX /> Reject
                            </button>
                          </>
                        )}
                        {editingId === ngo._id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleSaveComment(ngo._id, "ngo")}
                            >
                              <FiSave /> Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="edit-btn"
                            onClick={() => startEditing(ngo._id)}
                          >
                            <FiEdit /> Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <p>No NGOs found matching your search.</p>
            </div>
          )
        ) : (
          filteredResorts.length > 0 ? (
            <table className="organizations-table">
              <thead>
                <tr>
                  <th>Resort</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResorts.map(resort => (
                  <tr key={resort._id}>
                    <td>
                      <div className="org-info">
                        <div className="org-name">{resort.name}</div>
                        <div className="org-id">ID: {resort._id}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div><FiMail /> {resort.email}</div>
                        {resort.phone && <div><FiPhone /> {resort.phone}</div>}
                        {resort.contactPerson && <div><FiUser /> {resort.contactPerson}</div>}
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <FiMapPin /> {resortAddresses[resort._id] || "Loading location..."}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(resort.adminApprovalStatus)}
                    </td>
                    <td>
                      {editingId === resort._id ? (
                        <textarea
                          value={comments[resort._id]}
                          onChange={(e) =>
                            setComments(prev => ({ ...prev, [resort._id]: e.target.value }))
                          }
                          placeholder="Enter comments..."
                        />
                      ) : (
                        <div className="comments">
                          {resort.adminComments || "No comments"}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {resort.adminApprovalStatus !== "Approved" && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleApproval(resort._id, "resort")}
                            >
                              <FiCheck /> Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleReject(resort._id, "resort")}
                            >
                              <FiX /> Reject
                            </button>
                          </>
                        )}
                        {editingId === resort._id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={() => handleSaveComment(resort._id, "resort")}
                            >
                              <FiSave /> Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="edit-btn"
                            onClick={() => startEditing(resort._id)}
                          >
                            <FiEdit /> Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <p>No resorts found matching your search.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;