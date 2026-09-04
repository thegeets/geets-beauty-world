import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CardDrawer({ isOpen, onClose }) {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-drawer">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="primary-button" onClick={onClose}>
              Shop Products
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map((item) => (
                <div className="drawer-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="drawer-item-info">
                    <h3>{item.name}</h3>
                    <strong>Rs. {item.price.toLocaleString()}</strong>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="drawer-total">
                <span>Total</span>
                <strong>Rs. {cartTotal.toLocaleString()}</strong>
              </div>

              <Link
                to="/cart"
                className="primary-button full-width"
                onClick={onClose}
              >
                View Cart
              </Link>

              <a
                href="https://wa.me/9779827104869"
                target="_blank"
                rel="noreferrer"
                className="secondary-button full-width"
              >
                Order on WhatsApp
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}