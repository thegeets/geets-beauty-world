
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  Heart,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  PhoneCall,
  Home as HomeIcon,
  Info,
  Phone,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import SearchModal from "./SearchModal.jsx";

import "../styles/header.css";

/* =====================================================
   ANNOUNCEMENT MESSAGES
===================================================== */

const ANNOUNCEMENT_MESSAGES = [
  "✨ Free delivery inside Pokhara Valley on orders over Rs. 1,500",
  "🔥 Limited Time Deals • Save up to 25% on selected luxury items",
  "🌸 100% Genuine, Cruelty-Free & Dermatologist-Approved Formulations",
  "🚚 Express Same-Day Pokhara Valley Dispatch Available",
];

export default function Header({ onOpenLogin }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);

  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);

  /* =====================================================
     STICKY HEADER SCROLL DETECTION
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =====================================================
     CLOSE USER DROPDOWN ON OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`site-header ${
          isScrolled ? "is-scrolled" : ""
        }`}
      >
        {/* =====================================================
            1. TOP TICKER ANNOUNCEMENT BAR
        ===================================================== */}

        <div className="top-announcement">
          <div className="top-announcement-content">
            <span className="ticker-badge">
              Notice
            </span>

            <div className="announcement-text-slider">
              <div className="announcement-track">
                {/* FIRST SET */}

                {ANNOUNCEMENT_MESSAGES.map(
                  (message, index) => (
                    <span
                      key={`announcement-${index}`}
                      className="announcement-message"
                    >
                      {message}
                    </span>
                  )
                )}

                {/* DUPLICATE SET
                    Needed for seamless infinite scrolling
                */}

                {ANNOUNCEMENT_MESSAGES.map(
                  (message, index) => (
                    <span
                      key={`announcement-copy-${index}`}
                      className="announcement-message"
                    >
                      {message}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              POKHARA HOTLINE
          ===================================================== */}

          <div className="top-announcement-right">
            <span className="store-hotline">
              <PhoneCall size={12} />

              <span>
                Pokhara Hotline: 9800000000
              </span>
            </span>
          </div>
        </div>

        {/* =====================================================
            2. MAIN HEADER BAR
        ===================================================== */}

        <div className="header-main">
          {/* MOBILE HAMBURGER */}

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open mobile navigation"
          >
            <Menu size={22} />
          </button>

          {/* BRAND LOGO */}

          <Link
            to="/"
            className="brand-logo-container"
            aria-label="Geets Beauty Home"
          >
            <div className="logo-placeholder-box">
              <div className="logo-sparkle-glow" />

              <img
                src="/logo of geets beauty product.png"
                alt="Geets Beauty Logo"
                className="site-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div className="brand-text">
              <span className="brand-name">
                GEETS
              </span>

              <span className="brand-subtitle">
                <span className="brand-dot" />
                BEAUTY WORLD
              </span>
            </div>
          </Link>

          {/* =====================================================
              3. DESKTOP NAVIGATION
          ===================================================== */}

          <nav
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            {/* HOME */}

            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active-nav" : ""
                }`
              }
              end
            >
              <span>Home</span>
            </NavLink>

            {/* SHOP */}

            <div
              className="mega-menu-trigger-container"
              ref={megaMenuRef}
              onMouseEnter={() =>
                setIsShopHovered(true)
              }
              onMouseLeave={() =>
                setIsShopHovered(false)
              }
            >
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `nav-link shop-nav-link ${
                    isActive ? "active-nav" : ""
                  }`
                }
              >
                <span>Shop</span>

                <ChevronDown
                  size={14}
                  className={`dropdown-chevron ${
                    isShopHovered ? "rotated" : ""
                  }`}
                />
              </NavLink>

              {/* MEGA MENU */}

              <div
                className={`mega-menu-flyout ${
                  isShopHovered ? "show" : ""
                }`}
              >
                <div className="mega-menu-inner">
                  {/* LEFT CATEGORY GRID */}

                  <div className="mega-categories-grid">
                    {/* SKINCARE */}

                    <div className="mega-category-card">
                      <Link
                        to="/shop?category=Skincare"
                        className="mega-category-header"
                        onClick={() =>
                          setIsShopHovered(false)
                        }
                      >
                        <span className="mega-cat-icon">
                          ✨
                        </span>

                        <div>
                          <h4 className="mega-cat-title">
                            Skincare
                          </h4>

                          <p className="mega-cat-desc">
                            50 Products • Serums, Toners & SPF
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Skincare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Serums
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Skincare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Sunscreen
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Skincare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Cleansers
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* MAKEUP */}

                    <div className="mega-category-card">
                      <Link
                        to="/shop?category=Makeup"
                        className="mega-category-header"
                        onClick={() =>
                          setIsShopHovered(false)
                        }
                      >
                        <span className="mega-cat-icon">
                          💄
                        </span>

                        <div>
                          <h4 className="mega-cat-title">
                            Makeup
                          </h4>

                          <p className="mega-cat-desc">
                            50+ Products • Lipsticks & Foundations
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Makeup&subcategory=Lipstick"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Lipsticks
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Makeup&subcategory=Blush"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Blush
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Makeup&subcategory=Foundation"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Foundation
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* HAIRCARE */}

                    <div className="mega-category-card">
                      <Link
                        to="/shop?category=Haircare"
                        className="mega-category-header"
                        onClick={() =>
                          setIsShopHovered(false)
                        }
                      >
                        <span className="mega-cat-icon">
                          🌿
                        </span>

                        <div>
                          <h4 className="mega-cat-title">
                            Haircare
                          </h4>

                          <p className="mega-cat-desc">
                            30 Products • Oils, Shampoos & Masks
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Haircare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Hair Oils
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Haircare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Shampoos
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Haircare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Conditioners
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* BODYCARE */}

                    <div className="mega-category-card">
                      <Link
                        to="/shop?category=Bodycare"
                        className="mega-category-header"
                        onClick={() =>
                          setIsShopHovered(false)
                        }
                      >
                        <span className="mega-cat-icon">
                          🌸
                        </span>

                        <div>
                          <h4 className="mega-cat-title">
                            Bodycare
                          </h4>

                          <p className="mega-cat-desc">
                            10 Products • Lotions & Butters
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Bodycare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Body Lotion
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Bodycare"
                            onClick={() =>
                              setIsShopHovered(false)
                            }
                          >
                            Body Butter
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* SPOTLIGHT */}

                  <div className="mega-spotlight-card">
                    <span className="mega-spotlight-badge">
                      <Flame
                        size={12}
                        color="#fca5a5"
                      />

                      <span>
                        Special Deals
                      </span>
                    </span>

                    <div className="mega-spotlight-content">
                      <h5>
                        Limited Time Offers
                      </h5>

                      <p>
                        Save up to 25% on 20 selected
                        best-selling items in Nepal.
                      </p>

                      <Link
                        to="/shop"
                        className="mega-spotlight-btn"
                        onClick={() =>
                          setIsShopHovered(false)
                        }
                      >
                        <span>
                          Shop Discounts
                        </span>

                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* MEGA BOTTOM BAR */}

                <div className="mega-bottom-bar">
                  <div className="mega-quick-links">
                    <Link
                      to="/shop"
                      onClick={() =>
                        setIsShopHovered(false)
                      }
                    >
                      <Sparkles
                        size={13}
                        color="var(--primary)"
                      />

                      Best Sellers
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() =>
                        setIsShopHovered(false)
                      }
                    >
                      <ShieldCheck
                        size={13}
                        color="var(--primary)"
                      />

                      100% Genuine Care
                    </Link>
                  </div>

                  <Link
                    to="/shop"
                    className="mega-view-all-link"
                    onClick={() =>
                      setIsShopHovered(false)
                    }
                  >
                    <span>
                      View All Products
                    </span>

                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ABOUT */}

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active-nav" : ""
                }`
              }
            >
              <span>About</span>
            </NavLink>

            {/* CONTACT */}

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active-nav" : ""
                }`
              }
            >
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* =====================================================
              4. HEADER ACTIONS
          ===================================================== */}

          <div className="header-actions">
            {/* DESKTOP SEARCH */}

            <button
              type="button"
              className="header-search-bar-btn"
              onClick={() =>
                setIsSearchOpen(true)
              }
              aria-label="Search Catalog"
            >
              <Search
                size={16}
                className="search-icon-anim"
              />

              <span className="search-text-placeholder">
                Search cosmetics & skincare...
              </span>

              <kbd className="search-keyboard-hint">
                ⌘K
              </kbd>
            </button>

            {/* MOBILE SEARCH */}

            <button
              type="button"
              className="header-icon-btn mobile-search-trigger"
              onClick={() =>
                setIsSearchOpen(true)
              }
              aria-label="Search Catalog"
            >
              <Search size={18} />
            </button>

            {/* THEME TOGGLE */}

            <button
              type="button"
              className="header-icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <div className="theme-icon-wrapper">
                {theme === "light" ? (
                  <Moon size={18} />
                ) : (
                  <Sun size={18} />
                )}
              </div>
            </button>

            {/* WISHLIST */}

            <Link
              to="/wishlist"
              className="header-icon-btn wishlist-nav-btn"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart
                size={19}
                color="#e11d48"
              />

              {wishlistCount > 0 && (
                <span className="nav-badge animate-pop">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* USER */}

            {user ? (
              <div
                className="user-profile-menu"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  className={`profile-avatar-btn ${
                    showUserDropdown ? "open" : ""
                  }`}
                  onClick={() =>
                    setShowUserDropdown(
                      !showUserDropdown
                    )
                  }
                  aria-label="User Account Menu"
                >
                  <span className="avatar-letter">
                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </span>

                  <span className="avatar-online-dot" />
                </button>

                {showUserDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar-circle">
                        {user.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </div>

                      <div className="dropdown-user-meta">
                        <div className="dropdown-user-name-row">
                          <p className="dropdown-user-name">
                            {user.name || "Customer"}
                          </p>
                        </div>

                        <p className="dropdown-user-email">
                          {user.email || ""}
                        </p>
                      </div>
                    </div>

                    <div className="dropdown-nav-items">
                      <Link
                        to="/wishlist"
                        className="dropdown-link-item"
                        onClick={() =>
                          setShowUserDropdown(false)
                        }
                      >
                        <Heart
                          size={16}
                          color="#e11d48"
                        />

                        <div className="dropdown-link-split">
                          <span>
                            My Wishlist
                          </span>

                          {wishlistCount > 0 && (
                            <span className="dropdown-count-pill">
                              {wishlistCount}
                            </span>
                          )}
                        </div>
                      </Link>

                      <Link
                        to="/cart"
                        className="dropdown-link-item"
                        onClick={() =>
                          setShowUserDropdown(false)
                        }
                      >
                        <ShoppingBag
                          size={16}
                          color="var(--primary)"
                        />

                        <div className="dropdown-link-split">
                          <span>
                            Shopping Cart
                          </span>

                          {cartCount > 0 && (
                            <span className="dropdown-count-pill">
                              {cartCount}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="dropdown-divider" />

                      <button
                        type="button"
                        className="dropdown-logout-action"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />

                        <span>
                          Sign Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="header-signin-btn"
                onClick={() => {
                  if (
                    typeof onOpenLogin ===
                    "function"
                  ) {
                    onOpenLogin();
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <User size={16} />

                <span className="signin-btn-text">
                  Sign In
                </span>
              </button>
            )}

            {/* SHOPPING CART */}

            <Link
              to="/cart"
              className="cart-button"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="cart-count-badge animate-bounce-badge">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          5. MOBILE NAVIGATION DRAWER
      ===================================================== */}

      <div
        className={`mobile-drawer-backdrop ${
          isDrawerOpen ? "open" : ""
        }`}
        onClick={() =>
          setIsDrawerOpen(false)
        }
      />

      <aside
        className={`mobile-drawer-sidebar ${
          isDrawerOpen ? "open" : ""
        }`}
      >
        {/* DRAWER HEADER */}

        <div className="drawer-header">
          <Link
            to="/"
            className="drawer-brand"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <div className="logo-placeholder-box small">
              <img
                src="/logo of geets beauty product.png"
                alt="Geets Logo"
                className="site-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div>
              <h3 className="drawer-brand-name">
                GEETS
              </h3>

              <span className="drawer-brand-sub">
                BEAUTY WORLD
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={() =>
              setIsDrawerOpen(false)
            }
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* USER BANNER */}

        <div className="drawer-user-banner">
          {user ? (
            <div className="drawer-user-info">
              <div className="drawer-avatar">
                {user.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <div className="drawer-user-details">
                <strong>
                  {user.name || "Customer"}
                </strong>

                <small>
                  {user.email || ""}
                </small>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="drawer-login-cta"
              onClick={() => {
                setIsDrawerOpen(false);

                if (
                  typeof onOpenLogin ===
                  "function"
                ) {
                  onOpenLogin();
                } else {
                  navigate("/login");
                }
              }}
            >
              <User size={16} />

              <span>
                Sign In / Create Account
              </span>
            </button>
          )}
        </div>

        {/* SEARCH */}

        <div className="drawer-search-box">
          <button
            type="button"
            className="drawer-search-btn"
            onClick={() => {
              setIsDrawerOpen(false);
              setIsSearchOpen(true);
            }}
          >
            <Search size={16} />

            <span>
              Search products...
            </span>
          </button>
        </div>

        {/* NAVIGATION */}

        <div className="drawer-nav-list">
          <span className="drawer-section-label">
            PAGES
          </span>

          <NavLink
            to="/"
            className="drawer-nav-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
            end
          >
            <HomeIcon size={18} />

            <span>
              Home
            </span>
          </NavLink>

          <NavLink
            to="/shop"
            className="drawer-nav-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <ShoppingBag size={18} />

            <div className="drawer-item-split">
              <span>
                Shop All Products
              </span>

              <span className="drawer-pill">
                141
              </span>
            </div>
          </NavLink>

          <span className="drawer-section-label">
            CATEGORIES
          </span>

          <Link
            to="/shop?category=Skincare"
            className="drawer-nav-item sub-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <span className="drawer-icon">
              ✨
            </span>

            <span>
              Skincare (50)
            </span>
          </Link>

          <Link
            to="/shop?category=Makeup"
            className="drawer-nav-item sub-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <span className="drawer-icon">
              💄
            </span>

            <span>
              Makeup (51)
            </span>
          </Link>

          <Link
            to="/shop?category=Haircare"
            className="drawer-nav-item sub-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <span className="drawer-icon">
              🌿
            </span>

            <span>
              Haircare (30)
            </span>
          </Link>

          <Link
            to="/shop?category=Bodycare"
            className="drawer-nav-item sub-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <span className="drawer-icon">
              🌸
            </span>

            <span>
              Bodycare (10)
            </span>
          </Link>

          <span className="drawer-section-label">
            COMPANY
          </span>

          <NavLink
            to="/about"
            className="drawer-nav-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <Info size={18} />

            <span>
              About Us
            </span>
          </NavLink>

          <NavLink
            to="/contact"
            className="drawer-nav-item"
            onClick={() =>
              setIsDrawerOpen(false)
            }
          >
            <Phone size={18} />

            <span>
              Contact & Store
            </span>
          </NavLink>
        </div>

        {/* DRAWER FOOTER */}

        <div className="drawer-footer">
          <div className="drawer-theme-row">
            <span className="drawer-theme-label">
              Appearance
            </span>

            <button
              type="button"
              className="drawer-theme-toggle-btn"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon size={14} />
              ) : (
                <Sun size={14} />
              )}

              <span>
                {theme === "light"
                  ? "Dark Mode"
                  : "Light Mode"}
              </span>
            </button>
          </div>

          <div className="drawer-store-meta">
            <div className="drawer-meta-line">
              <PhoneCall size={12} />

              <span>
                Pokhara: +977 9800000000
              </span>
            </div>

            <div className="drawer-meta-line">
              <ShieldCheck size={12} />

              <span>
                100% Genuine Certified
              </span>
            </div>
          </div>

          {user && (
            <button
              type="button"
              className="drawer-logout-btn"
              onClick={() => {
                setIsDrawerOpen(false);
                handleLogout();
              }}
            >
              <LogOut size={16} />

              <span>
                Log Out
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* =====================================================
          SEARCH MODAL
      ===================================================== */}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() =>
          setIsSearchOpen(false)
        }
      />
    </>
  );
}

