import React, { useState } from "react";

import { Link } from "react-router-dom";

import { Heart, ShoppingBag, Check } from "lucide-react";

import { useCart } from "../context/CartContext.jsx";

import { useWishlist } from "../context/WishlistContext.jsx";

import { useToast } from "../context/ToastContext.jsx";

import "./ProductCard.css";

export default function ProductCard({
  product,
  enableHover = true,
}) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = isInWishlist(product?.id);

  if (!product) return null;

  /* ========================================
     IMAGE FORMAT & HOVER STATE
  ======================================== */

  const formatImg = (img) => {
    if (!img) {
      return "/logo of geets beauty product.png";
    }

    let clean = String(img).trim();
    if (clean.startsWith("public/")) {
      clean = "/" + clean.replace(/^public\//, "");
    } else if (!clean.startsWith("/") && !clean.startsWith("http")) {
      clean = "/" + clean;
    }

    return clean;
  };

  const hasHoverImage = Boolean(
    enableHover && product?.hoverImage && String(product.hoverImage).trim() !== ""
  );

  /* ========================================
     WISHLIST
  ======================================== */

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product);
  };

  /* ========================================
     ADD TO CART + FLY ANIMATION
  ======================================== */

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);

    addToast(
      `Added "${product.name}" to cart! 🛍️`,
      "success"
    );

    setIsAdded(true);

    const cardEl =
      event.currentTarget.closest(".product-card");

    const imgEl =
      cardEl?.querySelector(".product-image");

    const flyToViewCart = (cartTarget) => {
      if (!imgEl || !cartTarget) return;

      const imgRect =
        imgEl.getBoundingClientRect();

      const thumbEl =
        cartTarget.querySelector(
          ".floating-cart-product"
        );

      const targetRect = (
        thumbEl || cartTarget
      ).getBoundingClientRect();

      const flyingImg =
        imgEl.cloneNode(true);

      flyingImg.className =
        "flying-product-thumbnail";

      const startX = imgRect.left;
      const startY = imgRect.top;

      const endX =
        targetRect.left +
        targetRect.width / 2 -
        20;

      const endY =
        targetRect.top +
        targetRect.height / 2 -
        20;

      const midX =
        startX +
        (endX - startX) * 0.5;

      const midY =
        startY +
        (endY - startY) * 0.5;

      Object.assign(
        flyingImg.style,
        {
          position: "fixed",
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${imgRect.width}px`,
          height: `${imgRect.height}px`,
          zIndex: "9999999",
          pointerEvents: "none",
          objectFit: "contain",
          objectPosition: "center",
          margin: "0",
          padding: "6px",
          boxSizing: "border-box",
          borderRadius: "18px",
          background: "#ffffff",
          border:
            "2px solid rgba(225, 29, 72, 0.25)",
          boxShadow:
            "0 12px 30px rgba(225, 29, 72, 0.35)",
          opacity: "1",
        }
      );

      document.body.appendChild(
        flyingImg
      );

      const animation =
        flyingImg.animate(
          [
            {
              left: `${startX}px`,
              top: `${startY}px`,
              width: `${imgRect.width}px`,
              height: `${imgRect.height}px`,
              transform:
                "translate(0, 0) scale(1) rotate(0deg)",
              opacity: 1,
            },
            {
              left: `${midX}px`,
              top: `${midY}px`,
              width: `${imgRect.width * 0.72}px`,
              height: `${imgRect.height * 0.72}px`,
              transform:
                "translate(-50%, -50%) scale(0.85) rotate(8deg)",
              opacity: 1,
              offset: 0.45,
            },
            {
              left: `${endX}px`,
              top: `${endY}px`,
              width: "40px",
              height: "40px",
              transform:
                "translate(0, 0) scale(1) rotate(0deg)",
              opacity: 0.95,
            },
          ],
          {
            duration: 950,
            easing:
              "cubic-bezier(0.25, 0.8, 0.25, 1)",
            fill: "forwards",
          }
        );

      animation.onfinish = () => {
        cartTarget.classList.add(
          "cart-target-pulse"
        );

        setTimeout(() => {
          flyingImg.remove();

          cartTarget.classList.remove(
            "cart-target-pulse"
          );
        }, 300);
      };
    };

    let attempts = 0;

    const waitForViewCart = () => {
      const cartTarget =
        document.querySelector(
          ".floating-cart.cart-target"
        ) ||
        document.querySelector(
          ".cart-target"
        );

      if (cartTarget) {
        flyToViewCart(cartTarget);
        return;
      }

      if (attempts >= 24) return;

      attempts += 1;

      requestAnimationFrame(
        waitForViewCart
      );
    };

    requestAnimationFrame(
      waitForViewCart
    );

    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  /* ========================================
     STOCK
  ======================================== */

  const isLowStock =
    (Number(product.stock) || 0) > 0 &&
    (Number(product.stock) || 0) <= 5;

  const isOutOfStock =
    product.inStock === false ||
    (Number(product.stock) || 0) === 0;

  /* ========================================
     UI
  ======================================== */

  return (
    <div
      className={`product-card ${
        hasHoverImage ? "hover-enabled has-hover-image" : ""
      }`}
      tabIndex="0"
    >
      {/* WISHLIST BUTTON */}

      <button
        type="button"
        className={`product-wishlist-btn ${
          isWishlisted ? "is-active" : ""
        }`}
        onClick={handleWishlistClick}
        aria-label="Add to Wishlist"
      >
        <Heart
          size={24}
          color={
            isWishlisted
              ? "#ffffff"
              : "#e11d48"
          }
          fill={
            isWishlisted
              ? "#ffffff"
              : "#fee2e2"
          }
        />
      </button>

      {/* PRODUCT IMAGE */}

      <div className="product-image-link">
        <Link
          to={`/product/${product.id}`}
        >
          <div className="product-image-container">

            {/* BADGE */}

            {isOutOfStock ? (
              <span className="product-badge sold-out-badge">
                Sold Out
              </span>
            ) : (
              product.oldPrice &&
              Number(product.oldPrice) >
                Number(product.price) ? (
                <span className="product-badge discount-tag">
                  -
                  {Math.round(
                    (
                      (
                        Number(
                          product.oldPrice
                        ) -
                        Number(
                          product.price
                        )
                      ) /
                      Number(
                        product.oldPrice
                      )
                    ) * 100
                  )}
                  %
                </span>
              ) : product.badge ? (
                <span className="product-badge">
                  {product.badge}
                </span>
              ) : null
            )}

            <div className="product-image-stage">
              <img
                src={formatImg(
                  product.image
                )}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  if (!e.currentTarget.src.includes("logo")) {
                    e.currentTarget.src =
                      "/logo of geets beauty product.png";
                  }
                }}
              />

              {hasHoverImage && (
                <img
                  src={formatImg(
                    product.hoverImage
                  )}
                  alt={`${product.name} alternate view`}
                  className="product-hover-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>

            {/* ADD TO CART ACTION BAR */}

            <div className="product-image-action-bar">
              <button
                type="button"
                className={`image-add-to-cart-btn ${
                  isAdded ? "is-added" : ""
                }`}
                onClick={
                  handleAddToCart
                }
                disabled={
                  isOutOfStock
                }
              >
                {isOutOfStock ? (
                  <span className="cart-btn-content">
                    <span>
                      Sold Out
                    </span>
                  </span>
                ) : isAdded ? (
                  <span className="cart-btn-content">
                    <Check size={20} />

                    <span>
                      Added to Cart ✓
                    </span>
                  </span>
                ) : (
                  <span className="cart-btn-content">
                    <ShoppingBag
                      size={20}
                    />

                    <span>
                      Add to Cart
                    </span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* PRODUCT INFORMATION */}

      <div className="product-info">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <span className="product-category">
            {product.category}
          </span>

          {isLowStock && (
            <span
              style={{
                fontSize: "11px",
                color: "#dc2626",
                fontWeight: "700",
              }}
            >
              Only{" "}
              {product.stock} left!
            </span>
          )}

          {isOutOfStock && (
            <span
              style={{
                fontSize: "11px",
                color: "#dc2626",
                fontWeight: "700",
              }}
            >
              Out of Stock
            </span>
          )}
        </div>

        <Link
          to={`/product/${product.id}`}
          className="product-name-link"
        >
          <h3 className="product-name">
            {product.name}
          </h3>
        </Link>

        <div className="product-rating">
          <span className="stars">
            ★★★★★
          </span>

          <span className="rating-number">
            {product.rating ||
              "4.8"}
          </span>
        </div>

        <div className="product-price">
          <span className="current-price">
            Rs.{" "}
            {Number(
              product.price
            ).toLocaleString()}
          </span>

          {product.oldPrice && (
            <span className="old-price">
              Rs.{" "}
              {Number(
                product.oldPrice
              ).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}