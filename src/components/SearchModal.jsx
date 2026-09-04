import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function SearchModal({ isOpen, onClose }) {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ["All", "Skincare", "Makeup", "Haircare", "Bodycare"];

  const results = products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchQuery =
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQuery;
  });

  const handleProductSelect = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 99999,
        padding: "60px 20px 20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "650px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          animation: "modalFadeUp 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <Search size={22} color="#bd6975" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search beauty products, serums, glow primers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: "500",
              color: "#1e293b",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              <X size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Pill Filters */}
        <div
          style={{
            padding: "12px 24px",
            background: "#f8fafc",
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid #e2e8f0",
            overflowX: "auto",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: selectedCategory === cat ? "1px solid #bd6975" : "1px solid #cbd5e1",
                background: selectedCategory === cat ? "#bd6975" : "#ffffff",
                color: selectedCategory === cat ? "#ffffff" : "#475569",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "12px 16px" }}>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
              <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                No matching products found
              </p>
              <p style={{ margin: 0, fontSize: "13px" }}>
                Try searching for 'Serum', 'Glow', 'Vitamin C', or 'Skincare'.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {results.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleProductSelect(p.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fdf2f4";
                    e.currentTarget.style.borderColor = "#fecdd3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <img
                    src={p.image || "/Hydrating Glow Serum.png"}
                    alt={p.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      background: "#f8fafc",
                    }}
                    onError={(e) => {
                      e.target.src = "/Hydrating Glow Serum.png";
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "#bd6975",
                          textTransform: "uppercase",
                        }}
                      >
                        {p.category}
                      </span>
                      {p.badge && (
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "1px 6px",
                            borderRadius: "6px",
                            background: "#fffbeb",
                            color: "#b45309",
                            fontWeight: "600",
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                      {p.name}
                    </span>
                  </div>
                  <strong style={{ fontSize: "14px", color: "#bd6975" }}>
                    Rs. {Number(p.price).toLocaleString()}
                  </strong>
                  <ArrowRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 24px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <span>Showing {results.length} products</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/shop?category=${selectedCategory}`);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#bd6975",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View all in Shop →
          </button>
        </div>
      </div>
    </div>
  );
}
