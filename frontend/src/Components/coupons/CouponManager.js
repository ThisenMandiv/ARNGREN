import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "./AdminCouponManager.css";

const AdminCouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    percentage: 0,
    validUntil: "",
  });
  const [message, setMessage] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [assignSelectedDiscount, setAssignSelectedDiscount] = useState("");
  const [assignSelectedUsers, setAssignSelectedUsers] = useState([]);

  useEffect(() => {
    const initFetch = async () => {
      try {
        await Promise.all([fetchCoupons(), fetchUsers(), fetchDiscounts()]);
      } catch (error) {
        console.error("Initialization fetch error:", error);
        toast.error("Failed to load initial data. Please try again.");
      }
    };
    initFetch();
  }, []);

  async function fetchCoupons() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
    } catch (err) {
      toast.error("Failed to fetch coupons.");
      console.error("Fetch coupons error:", err);
    }
  }

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/coupons/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users.");
      console.error("Fetch users error:", err);
    }
  }

  async function fetchDiscounts() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/discounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(res.data);
    } catch (err) {
      toast.error("Failed to fetch discount templates.");
      console.error("Fetch discounts error:", err);
    }
  }

  async function handleCreateCoupon(e) {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/discounts",
        { ...newCoupon },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCoupon({ code: "", percentage: 0, validUntil: "" });
      fetchDiscounts();
      toast.success("Discount template created!");
    } catch (err) {
      setMessage("Error creating discount template.");
      toast.error(err.response?.data?.message || "Error creating discount template.");
      console.error("Create coupon/discount error:", err);
    }
  }

  async function handleAssignUsers(e) {
    e.preventDefault();
    setMessage("");
    if (!assignSelectedDiscount) {
      toast.error("Please select a discount template.");
      return;
    }
    if (assignSelectedUsers.length === 0) {
      toast.error("Please select at least one user to assign the discount.");
      return;
    }

    // Debug log: print payload
    console.log("Assigning users payload:", {
      discountId: assignSelectedDiscount,
      userIds: assignSelectedUsers
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/coupons/assign-users-to-discount",
        { discountId: assignSelectedDiscount, userIds: assignSelectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Discount assigned and coupons created for selected user(s)!`);
      setAssignSelectedUsers([]);
      fetchCoupons();
    } catch (err) {
      setMessage("Error assigning discount to users.");
      toast.error(err.response?.data?.message || "Error assigning discount.");
      console.error("Assign users error:", err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const renderCreateDiscountForm = () => (
    <div className="content-section">
        <h3 className="section-title">Create New Discount Template</h3>
        <form onSubmit={handleCreateCoupon} className="form-styled">
            <div className="form-field-styled">
                <label htmlFor="newCouponCode" className="form-label-styled">Discount Code</label>
                <input
                    type="text"
                    id="newCouponCode"
                    className="form-input-styled"
                    placeholder="e.g., SUMMER25"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    required
                />
            </div>
            <div className="form-field-styled">
                <label htmlFor="newCouponPercentage" className="form-label-styled">Percentage Off (%)</label>
                <input
                    type="number"
                    id="newCouponPercentage"
                    className="form-input-styled"
                    placeholder="e.g., 25"
                    value={newCoupon.percentage}
                    min="1"
                    max="100"
                    onChange={(e) => setNewCoupon({ ...newCoupon, percentage: parseInt(e.target.value) || 0 })}
                    required
                />
            </div>
            <div className="form-field-styled">
                <label htmlFor="newCouponValidUntil" className="form-label-styled">Valid Until</label>
                <input
                    type="date"
                    id="newCouponValidUntil"
                    className="form-input-styled"
                    value={newCoupon.validUntil}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                    required
                />
            </div>
            <button type="submit" className="button-submit-form">Create Discount Template</button>
        </form>
    </div>
  );

  return (
    <div className="admin-coupon-manager-page">
      <Toaster position="top-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#A076F9',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF6B6B',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="coupon-manager-container">
        <div className="header-section-manager">
            <h2 className="page-header-title">Admin Coupon & Discount Manager</h2>
            <button onClick={handleLogout} className="button-logout">
                Logout
            </button>
        </div>

        {message && <div className="message-display">{message}</div>}

        {renderCreateDiscountForm()}

        <div className="content-section">
          <div className="user-table-header-flex">
            <h3 className="section-title" style={{borderBottom: 'none', marginBottom: 0}}>Select Users for Discount Assignment</h3>
            <input
              type="text"
              className="user-search-input"
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <div className="table-wrapper-styled">
            <table className="data-table-styled">
              <thead className="table-head-styled">
                <tr>
                  <th className="th-styled">Name</th>
                  <th className="th-styled">Email</th>
                  <th className="th-styled user-select-col">Select</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="no-data-cell">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelected = assignSelectedUsers.includes(u._id);
                    return (
                      <tr
                        key={u._id}
                        className={`tr-styled ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          if (isSelected) {
                            setAssignSelectedUsers((prev) =>
                              prev.filter((id) => id !== u._id)
                            );
                          } else {
                            setAssignSelectedUsers((prev) => [...prev, u._id]);
                          }
                        }}
                      >
                        <td className="td-styled"><span>{u.name}</span></td>
                        <td className="td-styled">{u.email}</td>
                        <td className="td-styled user-select-col">
                          <button
                            type="button"
                            className={`button-select-user ${
                              isSelected ? "selected" : "deselected"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelected) {
                                setAssignSelectedUsers((prev) =>
                                  prev.filter((id) => id !== u._id)
                                );
                              } else {
                                setAssignSelectedUsers((prev) => [...prev, u._id]);
                              }
                            }}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-section">
            <h3 className="section-title">Assign Selected Users to a Discount</h3>
            <form onSubmit={handleAssignUsers} className="assign-form">
                <div className="form-field-styled">
                    <label htmlFor="assignDiscountSelect" className="form-label-styled">Select Discount Template</label>
                    <select
                        id="assignDiscountSelect"
                        className="form-select-styled"
                        value={assignSelectedDiscount}
                        onChange={(e) => setAssignSelectedDiscount(e.target.value)}
                        required
                    >
                        <option value="">-- Select Discount Template --</option>
                        {discounts.map((d) => (
                        <option key={d._id} value={d._id}>
                            {d.code} ({d.percentage}% off, valid until {new Date(d.validUntil).toLocaleDateString()})
                        </option>
                        ))}
                    </select>
                </div>
                <div className="selected-users-summary">
                    Selected Users: {assignSelectedUsers.length}
                    {assignSelectedUsers.length > 0 && (
                        <ul className="selected-users-list">
                            {assignSelectedUsers.map(userId => {
                                const user = users.find(u => u._id === userId);
                                return <li key={userId}>{user ? user.name : userId}</li>;
                            })}
                        </ul>
                    )}
                </div>
                <button
                    className="button-submit-form"
                    type="submit"
                    disabled={!assignSelectedDiscount || assignSelectedUsers.length === 0}
                >
                    Assign Discount & Create Coupons for Users
                </button>
            </form>
        </div>

        <div className="content-section">
          <h3 className="section-title">All Generated Coupons</h3>
          <div className="table-wrapper-styled">
            <table className="data-table-styled">
              <thead className="table-head-styled">
                <tr>
                  <th className="th-styled">Coupon Code</th>
                  <th className="th-styled">Percentage</th>
                  <th className="th-styled">Valid Until</th>
                  <th className="th-styled">Assigned To User</th>
                  <th className="th-styled">Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                    <tr><td colSpan={5} className="no-data-cell">No coupons generated yet.</td></tr>
                ) : coupons.map((c) => (
                  <tr key={c._id} className="tr-styled">
                    <td className="td-styled">{c.code}</td>
                    <td className="td-styled">{c.percentage}%</td>
                    <td className="td-styled">
                      {new Date(c.validUntil).toLocaleDateString()}
                    </td>
                    <td className="td-styled">
                      {c.assignedTo ? (
                        `${c.assignedTo.name} (${c.assignedTo.email})`
                      ) : (
                        <span className="no-assignment-text">Not individually assigned (General Discount)</span>
                      )}
                    </td>
                    <td className="td-styled">
                        <span className={`coupon-status-badge status-${c.isUsed ? 'used' : new Date(c.validUntil) < new Date() ? 'expired' : 'active'}`}>
                            {c.isUsed ? 'Used' : new Date(c.validUntil) < new Date() ? 'Expired' : 'Active'}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponManager; 