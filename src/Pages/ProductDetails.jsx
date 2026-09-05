import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Heart, ShoppingBag, Check, MessageCircle, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductReviews from "../components/ProductReviews";
import ProductGrid from "../components/ProductGrid";

export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Auto-scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find((item) => String(item.id) === String(id));
  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Recommended related products (excluding current)
  const relatedProducts = products
    .filter((item) => String(item.id) !== String(id) && (item.category === product?.category || true))
    .slice(0, 4);

  const formatImg = (img) => {
    if (!img) return "/logo of geets beauty product.png";
    let clean = String(img).trim();
    if (clean.startsWith("public/")) return "/" + clean.replace(/^public\//, "");
    if (!clean.startsWith("/") && !clean.startsWith("http")) return "/" + clean;
    return clean;
  };

  const handleAddToCart = (event) => {
    if (!product) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    addToast(`Added ${quantity}x "${product.name}" to cart! 🛍️`, "success");
    setIsAdded(true);

    const imageContainer = document.querySelector(".product-details-image");
    const imgEl = imageContainer?.querySelector("img");

    const flyToViewCart = (cartTarget) => {
      if (!imgEl || !cartTarget) return;

      const imgRect = imgEl.getBoundingClientRect();
      const thumbEl = cartTarget.querySelector(".floating-cart-product");
      const cartRect = (thumbEl || cartTarget).getBoundingClientRect();

      const flyingImg = document.createElement("img");
      flyingImg.src = formatImg(product.image);
      flyingImg.className = "flying-product-thumbnail";
      flyingImg.style.position = "fixed";
      flyingImg.style.left = `${imgRect.left}px`;
      flyingImg.style.top = `${imgRect.top}px`;
      flyingImg.style.width = `${imgRect.width}px`;
      flyingImg.style.height = `${imgRect.height}px`;
      flyingImg.style.zIndex = "999999";
      flyingImg.style.pointerEvents = "none";
      flyingImg.style.objectFit = "contain";
      flyingImg.style.borderRadius = "20px";

      document.body.appendChild(flyingImg);

      const anim = flyingImg.animate(
        [
          { left: `${imgRect.left}px`, top: `${imgRect.top}px`, transform: "scale(1)", opacity: 1 },
          {
            left: `${cartRect.left + cartRect.width / 2 - 15}px`,
            top: `${cartRect.top + cartRect.height / 2 - 15}px`,
            width: "25px",
            height: "25px",
            transform: "scale(0.1) rotate(360deg)",
            opacity: 0.1,
          },
        ],
        { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );

      anim.onfinish = () => {
        flyingImg.remove();
        cartTarget.classList.add("cart-target-pulse");
        setTimeout(() => cartTarget.classList.remove("cart-target-pulse"), 500);
      };
    };

    let attempts = 0;
    const waitForViewCart = () => {
      const cartTarget =
        document.querySelector(".floating-cart.cart-target") ||
        document.querySelector(".cart-target");

      if (cartTarget) {
        flyToViewCart(cartTarget);
        return;
      }

      if (attempts >= 24) return;
      attempts += 1;
      requestAnimationFrame(waitForViewCart);
    };

    requestAnimationFrame(waitForViewCart);

    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!product) {
    return (
      <main className="page-container not-found" style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Product Not Found</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
          We could not find the product you're looking for.
        </p>
        <Link to="/shop" className="primary-button">
          <span>Explore All Products</span>
        </Link>
      </main>
    );
  }

  const isOutOfStock = product.inStock === false || (Number(product.stock) || 0) === 0;

  return (
    <main
      className="product-details-page"
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "30px 24px 80px",
        color: "var(--text-main)",
      }}
    >
      {/* BREADCRUMB NAVIGATION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "var(--text-muted)",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Shop
        </Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          {product.category}
        </Link>
        <span>/</span>
        <strong style={{ color: "var(--primary)", fontWeight: "700" }}>{product.name}</strong>
      </div>

      {/* PRODUCT SHOWCASE GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "50px",
          alignItems: "start",
          marginBottom: "60px",
        }}
      >
        {/* LEFT: PRODUCT IMAGE */}
        <div
          className="product-details-image"
          style={{
            background: "var(--bg-card)",
            borderRadius: "32px",
            border: "1.5px solid var(--border-color)",
            padding: "36px",
            position: "relative",
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {product.badge && (
            <span
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "var(--primary-gradient)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "800",
                padding: "6px 14px",
                borderRadius: "999px",
                boxShadow: "0 4px 14px var(--primary-glow)",
                zIndex: 5,
              }}
            >
              {product.badge}
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label="Add to Wishlist"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: isWishlisted ? "var(--primary)" : "var(--bg-surface)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "50%",
              width: "46px",
              height: "46px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              zIndex: 5,
              transition: "all 0.25s ease",
            }}
          >
            <Heart
              size={22}
              color={isWishlisted ? "#ffffff" : "var(--primary)"}
              fill={isWishlisted ? "#ffffff" : "transparent"}
            />
          </button>

          <img
            src={formatImg(product.image)}
            alt={product.name}
            style={{
              maxHeight: "360px",
              maxWidth: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.12))",
            }}
            onError={(e) => {
              if (!e.currentTarget.src.includes("logo")) {
                e.currentTarget.src = "/logo of geets beauty product.png";
              }
            }}
          />
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "var(--primary)",
              fontSize: "12px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            {product.category}
          </span>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontFamily: "'Playfair Display', Georgia, serif",
              margin: "0 0 14px",
              color: "var(--text-main)",
              lineHeight: "1.2",
            }}
          >
            {product.name}
          </h1>

          {/* RATING & STOCK */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--accent-gold)", fontSize: "16px" }}>★★★★★</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>
                {product.rating || "4.8"} (120+ reviews)
              </span>
            </div>

            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                padding: "4px 12px",
                borderRadius: "999px",
                background: isOutOfStock
                  ? "#fef2f2"
                  : Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
                  ? "#fff7ed"
                  : "#f0fdf4",
                color: isOutOfStock
                  ? "#dc2626"
                  : Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
                  ? "#c2410c"
                  : "#16a34a",
                border: isOutOfStock
                  ? "1px solid #fca5a5"
                  : Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
                  ? "1px solid #fed7aa"
                  : "1px solid #bbf7d0",
              }}
            >
              {isOutOfStock
                ? "Out of Stock"
                : Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
                ? `Only ${product.stock} left in stock!`
                : product.stock !== undefined
                ? `In Stock (${product.stock} units available)`
                : "In Stock & Ready to Ship"}
            </span>
          </div>

          {/* PRICE */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "24px" }}>
            <span style={{ fontSize: "32px", fontWeight: "900", color: "var(--primary)" }}>
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: "18px", color: "var(--text-subtle)", textDecoration: "line-through" }}>
                Rs. {Number(product.oldPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "var(--text-muted)",
              marginBottom: "32px",
              paddingBottom: "24px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            {product.description ||
              "Formulated with gentle, premium botanical extracts designed to hydrate, nourish, and reveal your natural skin glow."}
          </p>

          {/* QUANTITY & ACTIONS */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginBottom: "28px" }}>
            {/* Quantity Selector */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "var(--bg-card)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "999px",
                padding: "4px",
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock || quantity <= 1}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: isOutOfStock || quantity <= 1 ? "not-allowed" : "pointer",
                  color: "var(--text-main)",
                  opacity: isOutOfStock || quantity <= 1 ? 0.4 : 1,
                }}
              >
                -
              </button>
              <span style={{ minWidth: "32px", textAlign: "center", fontWeight: "800", fontSize: "15px" }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  const maxStock = product.stock !== undefined ? Number(product.stock) : 999;
                  setQuantity((prev) => Math.min(maxStock, prev + 1));
                }}
                disabled={isOutOfStock || (product.stock !== undefined && quantity >= Number(product.stock))}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: isOutOfStock || (product.stock !== undefined && quantity >= Number(product.stock)) ? "not-allowed" : "pointer",
                  color: "var(--text-main)",
                  opacity: isOutOfStock || (product.stock !== undefined && quantity >= Number(product.stock)) ? 0.4 : 1,
                }}
              >
                +
              </button>
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              type="button"
              className="primary-button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                padding: "15px 36px",
                fontSize: "15px",
                fontWeight: "800",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
              <span>{isAdded ? "Added to Cart ✓" : "Add to Cart"}</span>
            </button>

            {/* WHATSAPP ORDER */}
            <a
              href={`https://wa.me/9779827104869?text=Hello%20Geets%20Beauty,%20I%20would%20like%20to%20order%20${encodeURIComponent(
                product.name
              )}%20(Rs.%20${product.price}).`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                borderRadius: "999px",
                background: "#25d366",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
              }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Order</span>
            </a>
          </div>

          {/* PERKS LIST */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              padding: "20px",
              background: "var(--bg-surface)",
              borderRadius: "20px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
              <Truck size={18} color="var(--primary)" />
              <span>Free Delivery in Pokhara</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>100% Genuine Care</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <ProductReviews productId={product.id} productName={product.name} />

      {/* YOU MAY ALSO LIKE (OTHER PRODUCTS) */}
      <div style={{ marginTop: "70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" }}>
          <div>
            <p style={{ color: "var(--primary)", fontSize: "12px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 6px" }}>
              Recommendations
            </p>
            <h2 style={{ fontSize: "28px", margin: 0 }}>You May Also Like</h2>
          </div>
          <Link to="/shop" style={{ color: "var(--primary)", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
            Explore All Products →
          </Link>
        </div>

        <ProductGrid products={relatedProducts} />
      </div>
    </main>
  );
}