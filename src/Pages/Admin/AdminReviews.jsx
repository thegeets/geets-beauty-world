import { useState, useEffect } from "react";
import { Star, Trash2, CheckCircle2, Search, MessageSquare, AlertCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import apiRequest from "../../api/apiClient";
import "./AdminDashboard.css";

const INITIAL_REVIEWS = [
  {
    id: 1,
    customer: "Pooja Gurung",
    product: "Vitamin C Brightening Serum",
    rating: 5,
    comment:
      "The Vitamin C Serum completely changed my skincare game. My dark spots faded within 3 weeks and my skin feels deeply nourished!",
    status: "Approved",
    date: "2025-02-18",
  },
  {
    id: 2,
    customer: "Anjali Shrestha",
    product: "Hydrating Glow Serum",
    rating: 5,
    comment:
      "I love the lightweight dewy texture. It absorbs instantly without any greasiness. 10/10 recommendation!",
    status: "Approved",
    date: "2025-02-20",
  },
  {
    id: 3,
    customer: "Sunita Adhikari",
    product: "Rosemary Hair Oil",
    rating: 5,
    comment:
      "Hands down the best herbal hair oil in Nepal. Reduced my hair shedding noticeably and gave my curls a healthy shine.",
    status: "Approved",
    date: "2025-02-22",
  },
  {
    id: 4,
    customer: "Kopila Thapa",
    product: "Niacinamide Face Serum",
    rating: 4,
    comment:
      "Great pore refining serum. Very gentle on sensitive Nepali skin. Fast delivery in Pokhara.",
    status: "Pending",
    date: "2025-02-24",
  },
  {
    id: 5,
    customer: "Roshani KC",
    product: "Matte Velvet Lipstick #04",
    rating: 5,
    comment:
      "Very pigmented and long lasting. Doesn't dry out my lips at all during whole day wear.",
    status: "Approved",
    date: "2025-02-25",
  },
];

export default function AdminReviews() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem("geets-admin-reviews-list");
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_REVIEWS;
  });

  // Fetch reviews from backend on load
  useEffect(() => {
    apiRequest("/reviews")
      .then((res) => {
        if (res.success && Array.isArray(res.reviews) && res.reviews.length > 0) {
          setReviews(res.reviews);
          try {
            localStorage.setItem("geets-admin-reviews-list", JSON.stringify(res.reviews));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");

  const saveReviews = (newList) => {
    setReviews(newList);
    try {
      localStorage.setItem("geets-admin-reviews-list", JSON.stringify(newList));
    } catch {}
  };

  const handleApprove = async (id) => {
    const updated = reviews.map((r) =>
      r.id === id || r._id === id ? { ...r, status: "Approved" } : r
    );
    saveReviews(updated);
    addToast("Review marked as Approved!", "success");

    try {
      await apiRequest(`/reviews/${id}`, {
        method: "PUT",
        useAdminToken: true,
        body: JSON.stringify({ status: "Approved" }),
      });
    } catch (e) {
      console.warn("Could not sync approved review to backend:", e);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      const updated = reviews.filter((r) => r.id !== id && r._id !== id);
      saveReviews(updated);
      addToast("Review removed.", "info");

      try {
        await apiRequest(`/reviews/${id}`, {
          method: "DELETE",
          useAdminToken: true,
        });
      } catch (e) {
        console.warn("Could not sync deleted review to backend:", e);
      }
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesRating =
      ratingFilter === "All" || String(r.rating) === ratingFilter;
    const matchesSearch =
      !search ||
      r.customer?.toLowerCase().includes(search.toLowerCase()) ||
      r.product?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    return matchesRating && matchesSearch;
  });

  return (
    <div className="admin-dashboard-container">
      {/* TOOLBAR */}
      <div
        className="admin-card-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          padding: "18px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#f1f5f9",
              borderRadius: "10px",
              padding: "8px 14px",
              width: "260px",
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search by customer, product, comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                color: "#1e293b",
              }}
            />
          </div>

          {/* Rating filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "5", "4", "3"].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingFilter(star)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: ratingFilter === star ? "#b85b70" : "#e2e8f0",
                  background: ratingFilter === star ? "#fdeef1" : "#ffffff",
                  color: ratingFilter === star ? "#b85b70" : "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                {star === "All" ? "All Ratings" : `★ ${star} Stars`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
          Total Reviews: <strong style={{ color: "#0f172a" }}>{filtered.length}</strong>
        </div>
      </div>

      {/* REVIEWS TABLE */}
      <div className="admin-card-panel">
        <div className="admin-panel-header">
          <h3>Customer Reviews & Ratings Moderation</h3>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No reviews found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{rev.customer}</div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: "#b85b70" }}>{rev.product}</span>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#f59e0b" }}>
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" />
                        ))}
                      </div>
                    </td>

                    <td>
                      <p style={{ margin: 0, fontSize: "12px", color: "#334155", maxWidth: "340px", lineHeight: 1.5 }}>
                        "{rev.comment}"
                      </p>
                    </td>

                    <td>
                      <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {rev.date}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-status-pill ${
                          rev.status === "Approved" ? "approved" : "pending"
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {rev.status !== "Approved" && (
                          <button
                            type="button"
                            className="admin-action-btn primary"
                            onClick={() => handleApprove(rev.id)}
                            title="Approve Review"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="admin-action-btn danger"
                          onClick={() => handleDelete(rev.id)}
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
