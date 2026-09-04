import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/bottom-nav.css";

export default function BottomNav({ onOpenSearch, onOpenLogin }) {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  return (
    <nav className="bottom-nav-bar" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `bottom-nav-btn ${isActive ? "active" : ""}`
        }
        end
      >
        <div className="bottom-icon-container">
          <Home size={20} />
        </div>
        <span className="bottom-label">Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) =>
          `bottom-nav-btn ${isActive ? "active" : ""}`
        }
      >
        <div className="bottom-icon-container">
          <LayoutGrid size={20} />
        </div>
        <span className="bottom-label">Shop</span>
      </NavLink>

      <button
        type="button"
        className="bottom-nav-btn bottom-search-btn"
        onClick={onOpenSearch}
        aria-label="Search products"
      >
        <div className="bottom-icon-container search-highlight">
          <Search size={20} />
        </div>
        <span className="bottom-label">Search</span>
      </button>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `bottom-nav-btn ${isActive ? "active" : ""}`
        }
      >
        <div className="bottom-icon-container">
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="bottom-nav-badge wishlist-bubble">
              {wishlistCount}
            </span>
          )}
        </div>
        <span className="bottom-label">Wishlist</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `bottom-nav-btn ${isActive ? "active" : ""}`
        }
      >
        <div className="bottom-icon-container">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="bottom-nav-badge cart-bubble">
              {cartCount}
            </span>
          )}
        </div>
        <span className="bottom-label">Cart</span>
      </NavLink>
    </nav>
  );
}
