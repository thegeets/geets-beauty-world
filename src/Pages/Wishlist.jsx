import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`Added "${product.name}" to cart! 🛍️`, "success");
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((p) => addToCart(p));
    addToast(`Added all ${wishlist.length} wishlist items to cart! ✨`, "success");
  };

  return (
    <main className="page" style={{ maxWidth: "1200px", margin: "0 auto 60px", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "30px 0 24px" }}>
        <div>
          <Link
            to="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#bd6975",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              marginBottom: "8px",
            }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#1e293b", fontFamily: "'Playfair Display', Georgia, serif" }}>
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={handleAddAllToCart}
              style={{
                background: "linear-gradient(135deg, #bd6975 0%, #9e4754 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "10px 18px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShoppingBag size={16} /> Add All to Cart
            </button>
            <button
              type="button"
              onClick={clearWishlist}
              style={{
                background: "#f1f5f9",
                color: "#64748b",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#fdf2f4",
              color: "#bd6975",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Heart size={32} />
          </div>
          <h3 style={{ margin: "0 0 8px", color: "#1e293b", fontSize: "20px" }}>Your Wishlist is Empty</h3>
          <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px" }}>
            Save items you like to easily find and purchase them later.
          </p>
          <Link
            to="/shop"
            style={{
              background: "#bd6975",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            Explore Beauty Shop
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {wishlist.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => removeFromWishlist(item.id)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#dc2626",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 2,
                }}
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>

              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image || "/Hydrating Glow Serum.png"}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    background: "#fdf2f4",
                  }}
                  onError={(e) => {
                    e.target.src = "/Hydrating Glow Serum.png";
                  }}
                />
              </Link>

              <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    color: "#bd6975",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  {item.category}
                </span>

                <Link
                  to={`/product/${item.id}`}
                  style={{
                    color: "#1e293b",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "15px",
                    marginBottom: "12px",
                    flex: 1,
                  }}
                >
                  {item.name}
                </Link>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
                  <strong style={{ fontSize: "18px", color: "#1e293b" }}>
                    Rs. {Number(item.price).toLocaleString()}
                  </strong>
                  {item.oldPrice && (
                    <span style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" }}>
                      Rs. {Number(item.oldPrice).toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(135deg, #bd6975 0%, #9e4754 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
