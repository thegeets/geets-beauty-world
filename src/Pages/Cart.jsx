import React from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext.jsx";
import "./Cart.css";

export default function Cart() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  // =========================================
  // INCREASE QUANTITY
  // =========================================
  const increaseQuantity = (id, currentQuantity) => {
    updateQuantity(
      id,
      Number(currentQuantity || 1) + 1
    );
  };

  // =========================================
  // DECREASE QUANTITY
  // =========================================
  const decreaseQuantity = (id, currentQuantity) => {
    const newQuantity = Math.max(
      Number(currentQuantity || 1) - 1,
      1
    );

    updateQuantity(id, newQuantity);
  };

  // =========================================
  // EMPTY CART
  // =========================================
  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-heading">
          <p className="cart-eyebrow">
            YOUR SELECTION
          </p>

          <h1>Shopping Cart</h1>

          <p className="cart-subtitle">
            Review your products before checkout.
          </p>
        </section>

        <div className="empty-cart">
          <ShoppingBag size={55} />

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/shop"
            className="continue-btn"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // =========================================
  // CART PAGE
  // =========================================
  return (
    <main className="cart-page">

      {/* PAGE HEADING */}
      <section className="cart-heading">
        <p className="cart-eyebrow">
          YOUR SELECTION
        </p>

        <h1>Shopping Cart</h1>

        <p className="cart-subtitle">
          Review your products before checkout.
        </p>
      </section>

      {/* CART CONTENT */}
      <section className="cart-layout">

        {/* PRODUCTS */}
        <div className="cart-products">

          {cart.map((item) => {
            const quantity =
              Number(item.quantity) || 1;

            return (
              <div
                className="cart-item"
                key={item.id}
              >

                {/* IMAGE */}
                <div className="cart-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/400x400/f8eeee/8d4858?text=Beauty+Product";
                    }}
                  />
                </div>

                {/* DETAILS */}
                <div className="cart-details">

                  <p className="cart-category">
                    {item.category || "Beauty"}
                  </p>

                  <h2>
                    {item.name}
                  </h2>

                  {item.skinType && (
                    <p className="cart-skin">
                      {item.skinType}
                    </p>
                  )}

                  <p className="cart-price">
                    Rs.{" "}
                    {Number(
                      item.price || 0
                    ).toLocaleString()}
                  </p>

                </div>

                {/* QUANTITY */}
                <div className="quantity-box">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(
                        item.id,
                        quantity
                      )
                    }
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={16} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(
                        item.id,
                        quantity
                      )
                    }
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={16} />
                  </button>

                </div>

                {/* DELETE */}
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={19} />
                </button>

              </div>
            );
          })}

          {/* CART ACTIONS */}
          <div className="cart-actions">

            <Link
              to="/shop"
              className="continue-shopping"
            >
              <ArrowLeft size={19} />
              Continue Shopping
            </Link>

            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </div>

        {/* ORDER SUMMARY */}
        <aside className="order-summary">

          <h2>
            Order Summary
          </h2>

          {/* SUBTOTAL */}
          <div className="summary-row">
            <span>
              Subtotal
            </span>

            <strong>
              Rs.{" "}
              {Number(cartTotal).toLocaleString()}
            </strong>
          </div>

          {/* DELIVERY */}
          <div className="summary-row delivery-row">
            <span>
              Delivery
            </span>

            <span>
              Calculated at checkout
            </span>
          </div>

          <div className="summary-line" />

          {/* TOTAL */}
          <div className="summary-total">
            <span>
              Total
            </span>

            <strong>
              Rs.{" "}
              {Number(cartTotal).toLocaleString()}
            </strong>
          </div>

          {/* DELIVERY INFO */}
          <div className="delivery-info">

            <Truck size={25} />

            <span>
              Delivery will be calculated
              <br />
              at checkout
            </span>

          </div>

          {/* CHECKOUT */}
          <Link
            to="/checkout"
            className="checkout-btn"
          >
            <ShoppingBag size={21} />
            Proceed to Checkout
          </Link>

        </aside>

      </section>

    </main>
  );
}