import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import "./FloatingCart.css";

export default function FloatingCart() {
  const {
    cart,
    cartCount,
    lastAddedProduct,
    hideCartBar,
  } = useCart();

  useEffect(() => {
    if (!lastAddedProduct) return;

    const timer = setTimeout(() => {
      hideCartBar();
    }, 3500);

    return () => clearTimeout(timer);
  }, [lastAddedProduct, hideCartBar]);

  if (!lastAddedProduct || cartCount <= 0) {
    return null;
  }

  return (
    <div className="floating-cart-wrapper">

      <Link
        to="/cart"
        className="floating-cart cart-target"
        onClick={hideCartBar}
      >

        <div className="floating-cart-product">

          <img
            src={lastAddedProduct.image}
            alt={lastAddedProduct.name}
          />

        </div>


        <div className="floating-cart-text">

          <strong>
            View Cart
          </strong>

          <span>
            {cartCount}{" "}
            {cartCount === 1 ? "item" : "items"}
          </span>

        </div>


        <div className="floating-cart-arrow">
          <ArrowRight size={18} />
        </div>

      </Link>

    </div>
  );
}