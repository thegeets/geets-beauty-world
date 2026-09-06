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
  MoreVertical,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import SearchModal from "./SearchModal.jsx";
import "../styles/header.css";

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
  const mobileMenuRef = useRef(null);

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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =====================================================
     CLOSE MOBILE 3-DOT POPUP ON OUTSIDE CLICK
  ===================================================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDrawerOpen]);

  /* =====================================================
     CLOSE MOBILE POPUP WHEN SCREEN BECOMES DESKTOP
  ===================================================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 980) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */
  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    setIsDrawerOpen(false);
    navigate("/");
  };

  /* =====================================================
     OPEN LOGIN
  ===================================================== */
  const handleLogin = () => {
    setIsDrawerOpen(false);
    setShowUserDropdown(false);

    if (typeof onOpenLogin === "function") {
      onOpenLogin();
    } else {
      navigate("/login");
    }
  };

  /* =====================================================
     MOBILE NAVIGATION HANDLER (RELIABLE ROUTING)
  ===================================================== */
  const handleMobileNav = (path) => {
    setIsDrawerOpen(false);
    navigate(path);
  };

  /* =====================================================
     CLOSE MOBILE POPUP
  ===================================================== */
  const closeMobileMenu = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* =====================================================
          SITE HEADER
      ===================================================== */}
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
            <span className="ticker-badge">Notice</span>

            <div className="announcement-text-slider">
              <div className="announcement-track">
                {ANNOUNCEMENT_MESSAGES.map((message, index) => (
                  <span
                    key={`announcement-${index}`}
                    className="announcement-message"
                  >
                    {message}
                  </span>
                ))}

                {ANNOUNCEMENT_MESSAGES.map((message, index) => (
                  <span
                    key={`announcement-copy-${index}`}
                    className="announcement-message"
                  >
                    {message}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* POKHARA HOTLINE */}
          <div className="top-announcement-right">
            <span className="store-hotline">
              <PhoneCall size={12} />
              <span>Pokhara Hotline: 9800000000</span>
            </span>
          </div>
        </div>

        {/* =====================================================
            2. MAIN HEADER BAR
        ===================================================== */}
        <div className="header-main">
          {/* BRAND LOGO (LEFT SIDE) */}
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
              <span className="brand-name">GEETS</span>

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
                `nav-link ${isActive ? "active-nav" : ""}`
              }
              end
            >
              <span>Home</span>
            </NavLink>

            {/* SHOP */}
            <div
              className="mega-menu-trigger-container"
              ref={megaMenuRef}
              onMouseEnter={() => setIsShopHovered(true)}
              onMouseLeave={() => setIsShopHovered(false)}
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
                  {/* CATEGORY GRID */}
                  <div className="mega-categories-grid">
                    {/* SKINCARE */}
                    <div className="mega-category-card">
                      <Link
                        to="/shop?category=Skincare"
                        className="mega-category-header"
                        onClick={() => setIsShopHovered(false)}
                      >
                        <span className="mega-cat-icon">✨</span>

                        <div>
                          <h4 className="mega-cat-title">Skincare</h4>

                          <p className="mega-cat-desc">
                            50 Products • Serums, Toners & SPF
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Skincare"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Serums
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Skincare"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Sunscreen
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Skincare"
                            onClick={() => setIsShopHovered(false)}
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
                        onClick={() => setIsShopHovered(false)}
                      >
                        <span className="mega-cat-icon">💄</span>

                        <div>
                          <h4 className="mega-cat-title">Makeup</h4>

                          <p className="mega-cat-desc">
                            50+ Products • Lipsticks & Foundations
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Makeup&subcategory=Lipstick"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Lipsticks
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Makeup&subcategory=Blush"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Blush
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Makeup&subcategory=Foundation"
                            onClick={() => setIsShopHovered(false)}
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
                        onClick={() => setIsShopHovered(false)}
                      >
                        <span className="mega-cat-icon">🌿</span>

                        <div>
                          <h4 className="mega-cat-title">Haircare</h4>

                          <p className="mega-cat-desc">
                            30 Products • Oils, Shampoos & Masks
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Haircare"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Hair Oils
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Haircare"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Shampoos
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Haircare"
                            onClick={() => setIsShopHovered(false)}
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
                        onClick={() => setIsShopHovered(false)}
                      >
                        <span className="mega-cat-icon">🌸</span>

                        <div>
                          <h4 className="mega-cat-title">Bodycare</h4>

                          <p className="mega-cat-desc">
                            10 Products • Lotions & Butters
                          </p>
                        </div>
                      </Link>

                      <ul className="mega-sub-list">
                        <li>
                          <Link
                            to="/shop?category=Bodycare"
                            onClick={() => setIsShopHovered(false)}
                          >
                            Body Lotion
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/shop?category=Bodycare"
                            onClick={() => setIsShopHovered(false)}
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
                      <Flame size={12} color="#fca5a5" />
                      <span>Special Deals</span>
                    </span>

                    <div className="mega-spotlight-content">
                      <h5>Limited Time Offers</h5>

                      <p>
                        Save up to 25% on 20 selected best-selling items in
                        Nepal.
                      </p>

                      <Link
                        to="/shop"
                        className="mega-spotlight-btn"
                        onClick={() => setIsShopHovered(false)}
                      >
                        <span>Shop Discounts</span>
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
                      onClick={() => setIsShopHovered(false)}
                    >
                      <Sparkles size={13} color="var(--primary)" />
                      Best Sellers
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() => setIsShopHovered(false)}
                    >
                      <ShieldCheck size={13} color="var(--primary)" />
                      100% Genuine Care
                    </Link>
                  </div>

                  <Link
                    to="/shop"
                    className="mega-view-all-link"
                    onClick={() => setIsShopHovered(false)}
                  >
                    <span>View All Products</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active-nav" : ""}`
              }
            >
              <span>About</span>
            </NavLink>

            {/* CONTACT */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active-nav" : ""}`
              }
            >
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* =====================================================
              4. HEADER ACTIONS (RIGHT SIDE)
              On Mobile: [ ❤️ Wishlist ] [ 👤 User/Login ] [ ⋮ 3-Dot ]
          ===================================================== */}
          <div className="header-actions">
            {/* DESKTOP SEARCH */}
            <button
              type="button"
              className="header-search-bar-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Catalog"
            >
              <Search size={16} className="search-icon-anim" />

              <span className="search-text-placeholder">
                Search cosmetics & skincare...
              </span>

              <kbd className="search-keyboard-hint">⌘K</kbd>
            </button>

            {/* MOBILE SEARCH (hidden) */}
            <button
              type="button"
              className="header-icon-btn mobile-search-trigger"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Catalog"
            >
              <Search size={18} />
            </button>

            {/* THEME (desktop only) */}
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

            {/* 1. WISHLIST BUTTON (Desktop & Mobile) */}
            <Link
              to="/wishlist"
              className="header-icon-btn wishlist-nav-btn"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={19} color="#e11d48" />

              {wishlistCount > 0 && (
                <span className="nav-badge animate-pop">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* 2. USER / SIGN IN BUTTON (Desktop & Mobile) */}
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
                    setShowUserDropdown(!showUserDropdown)
                  }
                  aria-label="User Account Menu"
                >
                  <span className="avatar-letter">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>

                  <span className="avatar-online-dot" />
                </button>

                {showUserDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar-circle">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
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
                        to="/profile"
                        className="dropdown-link-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User size={16} color="var(--primary)" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        className="dropdown-link-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Heart size={16} color="#e11d48" />

                        <div className="dropdown-link-split">
                          <span>My Wishlist</span>

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
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ShoppingBag
                          size={16}
                          color="var(--primary)"
                        />

                        <div className="dropdown-link-split">
                          <span>Shopping Cart</span>

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
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="header-signin-btn"
                onClick={handleLogin}
                aria-label="Sign In"
              >
                <User size={16} />

                <span className="signin-btn-text">
                  Sign In
                </span>
              </button>
            )}

            {/* CART (Desktop Only) */}
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

            {/* 3. THREE-DOT MENU & POPUP (Mobile Only) */}
            <div
              className="mobile-menu-wrapper"
              ref={mobileMenuRef}
            >
              <button
                type="button"
                className={`mobile-three-dot-menu ${
                  isDrawerOpen ? "active" : ""
                }`}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                aria-label={
                  isDrawerOpen ? "Close Menu" : "Open Menu"
                }
                aria-expanded={isDrawerOpen}
              >
                <MoreVertical size={20} />
              </button>

              {/* THREE-DOT POPUP DROPDOWN */}
              {isDrawerOpen && (
                <div className="mobile-simple-menu open">
                  <div className="mobile-menu-title-row">
                    <span className="mobile-menu-title">
                      Menu
                    </span>
                  </div>

                  <div className="mobile-menu-divider" />

                  <div className="mobile-simple-menu-list">
                    {/* ❤️ Wishlist */}
                    <Link
                      to="/wishlist"
                      className="mobile-simple-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileNav("/wishlist");
                      }}
                    >
                      <span className="mobile-menu-item-icon wishlist">
                        <Heart size={17} color="#e11d48" />
                      </span>

                      <span className="mobile-menu-item-text">
                        Wishlist
                      </span>

                      {wishlistCount > 0 && (
                        <span className="mobile-menu-badge">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {/* 👤 Login / My Account */}
                    {user ? (
                      <Link
                        to="/profile"
                        className="mobile-simple-menu-item"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMobileNav("/profile");
                        }}
                      >
                        <span className="mobile-menu-item-icon user">
                          <User size={17} color="var(--primary)" />
                        </span>

                        <span className="mobile-menu-item-text">
                          My Account
                        </span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="mobile-simple-menu-item"
                        onClick={handleLogin}
                      >
                        <span className="mobile-menu-item-icon user">
                          <User size={17} color="var(--primary)" />
                        </span>

                        <span className="mobile-menu-item-text">
                          Login
                        </span>
                      </button>
                    )}

                    {/* 🏠 Home */}
                    <Link
                      to="/"
                      className="mobile-simple-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileNav("/");
                      }}
                    >
                      <span className="mobile-menu-item-icon home">
                        <HomeIcon size={17} />
                      </span>

                      <span className="mobile-menu-item-text">
                        Home
                      </span>
                    </Link>

                    {/* 🛍 Shop */}
                    <Link
                      to="/shop"
                      className="mobile-simple-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileNav("/shop");
                      }}
                    >
                      <span className="mobile-menu-item-icon shop">
                        <ShoppingBag size={17} />
                      </span>

                      <span className="mobile-menu-item-text">
                        Shop
                      </span>
                    </Link>

                    {/* ℹ About */}
                    <Link
                      to="/about"
                      className="mobile-simple-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileNav("/about");
                      }}
                    >
                      <span className="mobile-menu-item-icon about">
                        <Info size={17} />
                      </span>

                      <span className="mobile-menu-item-text">
                        About
                      </span>
                    </Link>

                    {/* 📞 Contact */}
                    <Link
                      to="/contact"
                      className="mobile-simple-menu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMobileNav("/contact");
                      }}
                    >
                      <span className="mobile-menu-item-icon contact">
                        <Phone size={17} />
                      </span>

                      <span className="mobile-menu-item-text">
                        Contact
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          SEARCH MODAL
      ===================================================== */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}