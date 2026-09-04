import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import "./AdminDashboard.css";

const CATEGORIES = ["All", "Skincare", "Makeup", "Haircare", "Bodycare"];

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useProducts();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Skincare",
    subcategory: "Serum",
    price: "",
    oldPrice: "",
    stock: "15",
    badge: "New",
    image: "/Hydrating Glow Serum.png",
    description: "",
  });

  const filteredProducts = (products || []).filter((p) => {
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Skincare",
      subcategory: "Serum",
      price: "",
      oldPrice: "",
      stock: "15",
      badge: "New",
      image: "/Hydrating Glow Serum.png",
      description: "Luxury formulation for radiant beauty glow.",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "Skincare",
      subcategory: product.subcategory || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      stock: product.stock !== undefined ? String(product.stock) : "15",
      badge: product.badge || "",
      image: product.image || "/Hydrating Glow Serum.png",
      description: product.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      addToast("Please fill in product name and price.", "error");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        stock: Number(formData.stock),
        badge: formData.badge,
        image: formData.image,
        description: formData.description,
      });
      addToast(`Product "${formData.name}" updated!`, "success");
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        stock: Number(formData.stock),
        badge: formData.badge,
        image: formData.image,
        description: formData.description,
      });
      addToast(`New product "${formData.name}" added!`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      addToast(`Product "${name}" deleted.`, "info");
    }
  };

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
              width: "240px",
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search products..."
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

          {/* Category Filter Tabs */}
          <div style={{ display: "flex", gap: "6px" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: categoryFilter === cat ? "#b85b70" : "#e2e8f0",
                  background: categoryFilter === cat ? "#fdeef1" : "#ffffff",
                  color: categoryFilter === cat ? "#b85b70" : "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="admin-action-btn primary"
          style={{ padding: "10px 18px", fontSize: "13px" }}
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="admin-card-panel">
        <div className="admin-panel-header">
          <h3>
            Catalog Products ({filteredProducts.length})
          </h3>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No products matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isInStock = product.inStock !== false && Number(product.stock || 0) > 0;
                  return (
                    <tr key={product.id}>
                      <td style={{ width: "60px" }}>
                        <img
                          src={product.image || "/Hydrating Glow Serum.png"}
                          alt={product.name}
                          style={{
                            width: "44px",
                            height: "44px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            background: "#f8fafc",
                            padding: "4px",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{product.name}</div>
                        {product.badge && (
                          <span style={{ fontSize: "10px", color: "#b85b70", fontWeight: 800 }}>
                            {product.badge}
                          </span>
                        )}
                      </td>

                      <td>
                        <span style={{ fontWeight: 600 }}>{product.category}</span>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{product.subcategory}</div>
                      </td>

                      <td>
                        <strong style={{ color: "#b85b70" }}>
                          Rs. {Number(product.price || 0).toLocaleString()}
                        </strong>
                        {product.oldPrice && (
                          <div style={{ fontSize: "11px", color: "#94a3b8", textDecoration: "line-through" }}>
                            Rs. {Number(product.oldPrice).toLocaleString()}
                          </div>
                        )}
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: isInStock ? "#065f46" : "#b91c1c" }}>
                          {product.stock ?? 15} units
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => toggleStock(product.id)}
                          className={`admin-status-pill ${isInStock ? "in-stock" : "out-of-stock"}`}
                          style={{ border: "none", cursor: "pointer" }}
                        >
                          {isInStock ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            className="admin-action-btn"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn danger"
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vitamin C Glow Serum"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 10px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Bodycare">Bodycare</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Serum, Cleanser"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1299"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Old Price
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="1599"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="15"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/Hydrating Glow Serum.png"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description and formulation highlights..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-action-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-action-btn primary"
                  style={{ padding: "10px 20px" }}
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
