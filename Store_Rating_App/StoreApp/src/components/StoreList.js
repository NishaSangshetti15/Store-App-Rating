import { useEffect, useState } from "react";
import API from "../api/axios.js";
import { validateRating } from "../utils/validation.js";
import "../styles/Dashboard.css";

function StoreList({ showHeader = true, adminView = false }) {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    loadStores();
    if (!adminView) {
      loadMyRatings();
    }
  }, [adminView]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const res = await API.get("/stores");
      setStores(res.data);
    } catch (error) {
      showMessage("Failed to load stores", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMyRatings = async () => {
    try {
      const res = await API.get("/ratings/my-ratings");
      const ratingsMap = {};
      res.data.forEach(rating => {
        ratingsMap[rating.store_name] = rating.id;
      });
      setMyRatings(ratingsMap);
    } catch (error) {
      console.error("Failed to load ratings:", error);
    }
  };

  const handleRating = async (storeId, storeName, rating) => {
    const validationError = validateRating(rating);
    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    try {
      if (myRatings[storeName]) {
        // Update existing rating
        await API.put(`/ratings/${myRatings[storeName]}`, { rating });
        showMessage("Rating updated successfully", "success");
      } else {
        // Submit new rating
        await API.post("/ratings", {
          storeId,
          rating: parseInt(rating)
        });
        showMessage("Rating submitted successfully", "success");
      }
      loadStores();
      if (!adminView) {
        loadMyRatings();
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit rating";
      showMessage(message, "error");
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const filteredAndSortedStores = stores
    .filter(store => {
      const searchLower = searchTerm.toLowerCase();
      return (
        store.name.toLowerCase().includes(searchLower) ||
        (store.address && store.address.toLowerCase().includes(searchLower)) ||
        (store.email && store.email.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "rating":
          aVal = parseFloat(a.avg_rating) || 0;
          bVal = parseFloat(b.avg_rating) || 0;
          break;
        case "address":
          aVal = (a.address || "").toLowerCase();
          bVal = (b.address || "").toLowerCase();
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return <div className="empty-state">Loading stores...</div>;
  }

  return (
    <div>
      {showHeader && (
        <div className="table-section">
          <div className="table-header">
            <h3 className="table-title">Stores</h3>
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="stores-grid">
        {filteredAndSortedStores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📍</div>
            <p>No stores found</p>
          </div>
        ) : (
          filteredAndSortedStores.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-name">{store.name}</div>

              {store.email && (
                <div className="store-info">
                  <span>✉️</span>
                  <a href={`mailto:${store.email}`} className="store-email">
                    {store.email}
                  </a>
                </div>
              )}

              {store.address && (
                <div className="store-info">
                  <span>📍</span>
                  <span>{store.address}</span>
                </div>
              )}

              <div className="rating-display">
                ⭐ Average Rating: {store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : "N/A"} / 5
              </div>

              {!adminView && (
                <>
                  {myRatings[store.name] && (
                    <div className="user-rating">
                      Your rating: {myRatings[store.name]} / 5
                    </div>
                  )}

                  <div className="card-actions">
                    <select
                      className="rating-input"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleRating(store.id, store.name, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">
                        {myRatings[store.name] ? "Update Rating" : "Submit Rating"}
                      </option>
                      <option value="1">⭐ 1 - Poor</option>
                      <option value="2">⭐⭐ 2 - Fair</option>
                      <option value="3">⭐⭐⭐ 3 - Good</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StoreList;