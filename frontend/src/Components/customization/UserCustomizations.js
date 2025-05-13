import { useEffect, useState } from "react";
import UserNav from '../UserNav/UserNav';
import "./UserCustomizations.css"; // Import the new CSS file

export default function UserCustomizations() {
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Safely parse user from localStorage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setLoading(false); // No user, no loading needed for user-specific data
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!user?._id) {
        setCustomizations([]); // Ensure customizations is empty if no user ID
        setLoading(false);
        return;
      }
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await fetch(
          `http://localhost:5000/api/customizations?userId=${user._id}`
        );
        if (!res.ok) {
          // Handle HTTP errors like 404 or 500
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCustomizations(data);
      } catch (err) {
        console.error("Failed to fetch customizations:", err);
        setCustomizations([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    }

    if (user) { // Only fetch if user object is available
        fetchData();
    }
  }, [user]); // Rerun when user object changes

  if (loading) {
    return <div><UserNav /><div className="loading-message-user">Loading your masterpieces...</div></div>;
  }

  return (
    <div>
      <UserNav />
      <div className="user-customizations-page">
        <div className="content-container-user">
          <h2 className="page-title-user">My Customization Journey</h2>
          {customizations.length === 0 ? (
            <div className="empty-message-user">
              You haven't created any customizations yet.
              <br />
              Start designing your unique piece today!
            </div>
          ) : (
            <div className="table-scroll-wrapper-user">
              <table className="customizations-table-user">
                <thead>
                  <tr className="table-header-row-user">
                    <th className="table-header-cell-user">Product</th>
                    <th className="table-header-cell-user">Material</th>
                    <th className="table-header-cell-user">Size</th>
                    <th className="table-header-cell-user">Theme/Style</th>
                    <th className="table-header-cell-user">Quoted Price</th>
                    <th className="table-header-cell-user">Status</th>
                    <th className="table-header-cell-user date-col-user">Date Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {customizations.map((c) => (
                    <tr key={c._id} className="table-body-row-user">
                      <td className="table-data-cell-user product-name-cell-user">{c.productName || c.baseDesign || 'N/A'}</td>
                      <td className="table-data-cell-user">{c.customizationOptions?.metalType || c.material || 'N/A'}</td>
                      <td className="table-data-cell-user">{c.customizationOptions?.size || c.size || 'N/A'}</td>
                      <td className="table-data-cell-user">{c.customizationOptions?.theme || c.theme || 'Default'}</td>
                      <td className="table-data-cell-user price-cell-user">
                        {c.priceQuote || c.price ? `₨${(c.priceQuote || c.price).toLocaleString()}` : 'Pending'}
                      </td>
                      <td className="table-data-cell-user status-cell-user">
                        <span
                          className={`status-badge-user status-${
                            c.status?.toLowerCase().replace(" ", "-") || "unknown"
                          }-user`}
                        >
                          {c.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="table-data-cell-user date-cell-user">
                        {new Date(c.createdAt || c.updatedAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                        <br />
                        <span className="time-detail">
                          {new Date(c.createdAt || c.updatedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit', hour12: true
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}