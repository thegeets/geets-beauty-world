import React, { useState, useMemo } from "react";

import { Link } from "react-router-dom";

import { useProducts } from "../context/ProductContext";

import ProductGrid from "../components/ProductGrid";

import {
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  Heart,
  Star,
  CheckCircle2,
  Layers,
  Leaf,
  Clock,
  MessageCircleHeart,
  Tag,
  Flame,
  BadgeCheck,
  Percent,
} from "lucide-react";

import "../styles/Home.css";

const CATEGORIES = [
  {
    name: "Skincare",
    desc: "Hydrating serums, glow toners & gentle cleansers",
    icon: "✨",
    count: "50 Products",
    path: "/shop?category=Skincare",
  },
  {
    name: "Makeup",
    desc: "Matte foundations, velvet lipsticks & setting sprays",
    icon: "💄",
    count: "50+ Products",
    path: "/shop?category=Makeup",
  },
  {
    name: "Haircare",
    desc: "Herbal hair growth oils, shampoos & keratin serums",
    icon: "🌿",
    count: "30 Products",
    path: "/shop?category=Haircare",
  },
  {
    name: "Bodycare",
    desc: "Luxury body scrubs, whipped lotions & body butters",
    icon: "🌸",
    count: "10 Products",
    path: "/shop?category=Bodycare",
  },
];

const VALUE_PROPS = [
  {
    icon: <Truck size={22} />,
    title: "Free Valley Delivery",
    desc: "Complimentary same-day delivery inside Pokhara on orders over Rs. 1,500.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "100% Genuine Care",
    desc: "Authentic, dermatologist-tested ingredients formulated for all skin types.",
  },
  {
    icon: <Leaf size={22} />,
    title: "Botanical Actives",
    desc: "Cruelty-free, paraben-free pure organic extracts and vitamins.",
  },
  {
    icon: <MessageCircleHeart size={22} />,
    title: "Beauty Consultation",
    desc: "Friendly personalized advice to help you find your exact skincare match.",
  },
];

const GLOW_STORIES = [
  {
    name: "Pooja Gurung",
    location: "Lakeside, Pokhara",
    avatar: "P",
    concern: "Dullness & Sun Damage",
    product: "Vitamin C Brightening Serum",
    productId: 2,
    rating: 5,
    comment:
      "The Vitamin C Serum completely changed my skincare game. My dark spots faded within 3 weeks and my skin feels deeply nourished and glowing every morning!",
  },
  {
    name: "Anjali Shrestha",
    location: "Kathmandu Valley",
    avatar: "A",
    concern: "Dry Skin & Fine Texture",
    product: "Hydrating Glow Serum",
    productId: 1,
    rating: 5,
    comment:
      "I love the lightweight dewy texture. It absorbs instantly without any greasiness. The packaging and same-day delivery were super professional!",
  },
  {
    name: "Sunita Adhikari",
    location: "Mahendrapool, Pokhara",
    avatar: "S",
    concern: "Hair Fall & Scalp Health",
    product: "Rosemary Hair Oil",
    productId: 101,
    rating: 5,
    comment:
      "Hands down the best herbal hair oil in Nepal. Reduced my hair shedding noticeably and gave my curls a healthy shine. 10/10 recommendation!",
  },
];

export default function Home() {
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] = useState("All");

  /* Filter products by tab */
  const displayedProducts = useMemo(() => {
    if (activeFilter === "All") {
      return products.slice(0, 8);
    }

    return products
      .filter((p) => p.category === activeFilter)
      .slice(0, 8);
  }, [products, activeFilter]);

  /* Dedicated Discounted / Special Deals products */
  const discountedDeals = useMemo(() => {
    return products
      .filter(
        (p) =>
          p.oldPrice &&
          Number(p.oldPrice) > Number(p.price)
      )
      .slice(0, 8);
  }, [products]);

  return (
    <main className="home-page">

      {/* =====================================================
          1. HERO SECTION (EDITORIAL LUXURY SHOWCASE)
      ===================================================== */}

      <section className="hero-section">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        {/* LEFT CONTENT */}
        <div className="hero-content">
          <div className="hero-tag-badge">
            <Sparkles
              size={14}
              className="hero-tag-sparkle"
            />

            <span>
              Pure Botanical Formulations • Pokhara, Nepal
            </span>
          </div>

          <h1 className="hero-title">
            Reveal Your Natural,
            <span className="hero-title-highlight">
              Radiant Skin Glow
            </span>
          </h1>

          <p className="hero-description">
            Discover Nepal's most loved skincare & luxury cosmetic
            formulations. Clinically formulated, cruelty-free, and designed
            to nourish and elevate your everyday natural beauty.
          </p>

          <div className="hero-cta-group">
            <Link
              to="/shop"
              className="hero-btn-primary"
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop?category=Skincare"
              className="hero-btn-secondary"
            >
              <span>Best Sellers</span>
            </Link>
          </div>
        </div>

        {/* RIGHT EDITORIAL PRODUCT COMPOSITION */}
        <div className="hero-showcase">
          <div className="showcase-grid-composition">

            {/* Main Featured Highlight */}
            <div className="showcase-main-card">
              <span className="showcase-badge-pill">
                🔥 #1 Best Seller
              </span>

              <div className="showcase-img-wrap">
                <img
                  src="/vitamin c brightening serum.png"
                  alt="Vitamin C Brightening Serum"
                  className="showcase-img"
                  onError={(e) => {
                    e.target.src =
                      "/logo of geets beauty product.png";
                  }}
                />
              </div>

              <div className="showcase-info">
                <h4>Vitamin C Glow Serum</h4>

                <p>
                  Triple antioxidant complex for bright, even-toned skin
                </p>

                <div className="showcase-price-row">
                  <span className="showcase-price">
                    Rs. 1,199
                  </span>

                  <span className="showcase-old-price">
                    Rs. 1,499
                  </span>
                </div>
              </div>
            </div>

            {/* Side Highlights Column */}
            <div className="showcase-side-column">

              <Link
                to="/shop?category=Skincare"
                className="showcase-mini-card"
              >
                <div className="showcase-mini-img-wrap">
                  <img
                    src="/Matte Sunscreen SPF 50.png"
                    alt="Matte Sunscreen"
                    className="showcase-mini-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                <div className="showcase-mini-info">
                  <h5>Sunscreen SPF 50</h5>
                  <span>Rs. 999</span>
                </div>
              </Link>

              <Link
                to="/shop?category=Makeup"
                className="showcase-mini-card"
              >
                <div className="showcase-mini-img-wrap">
                  <img
                    src="/Red Velvet Lipstick.png"
                    alt="Velvet Lipstick"
                    className="showcase-mini-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                <div className="showcase-mini-info">
                  <h5>Velvet Lipstick</h5>
                  <span>Rs. 799</span>
                </div>
              </Link>

              {/* Floating Live Rating Pill */}
              <div className="showcase-rating-pill">
                <span className="rating-star-icon">
                  ⭐
                </span>

                <div className="rating-text">
                  <strong>4.9 / 5.0 Rating</strong>
                  <small>
                    Over 5,000+ Happy Glowers
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. CURATED CATEGORIES SECTION
      ===================================================== */}

      <section className="categories-section">
        <div className="section-header">
          <p className="section-subtitle">
            Curated Collections
          </p>

          <h2 className="section-title">
            Explore by Beauty Category
          </h2>

          <p className="section-description">
            Tailored formulations designed to target your unique skin,
            hair, and cosmetic needs.
          </p>
        </div>

        <div className="categories-cards-grid">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={index}
              to={cat.path}
              className="category-luxury-card"
            >
              <div className="cat-top-row">
                <div className="cat-icon-box">
                  {cat.icon}
                </div>

                <span className="cat-count-tag">
                  {cat.count}
                </span>
              </div>

              <h3 className="cat-title">
                {cat.name}
              </h3>

              <p className="cat-desc">
                {cat.desc}
              </p>

              <span className="cat-action-link">
                <span>Shop Collection</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          3. WHY CHOOSE GEETS BEAUTY (VALUE PROPOSITIONS)
      ===================================================== */}

      <section className="why-choose-section">
        <div className="value-props-grid">
          {VALUE_PROPS.map((prop, idx) => (
            <div
              key={idx}
              className="value-prop-card"
            >
              <div className="value-prop-icon">
                {prop.icon}
              </div>

              <div className="value-prop-content">
                <h4>{prop.title}</h4>
                <p>{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          4. TRENDING & BEST SELLERS SECTION
      ===================================================== */}

      <section className="trending-section">
        <div className="trending-header-row">
          <div>
            <p className="section-subtitle">
              Customer Favorites
            </p>

            <h2
              className="section-title"
              style={{ margin: 0 }}
            >
              Trending & Best Sellers
            </h2>

            {/* Category Filter Tabs */}
            <div className="category-filter-tabs">
              {[
                "All",
                "Skincare",
                "Makeup",
                "Haircare",
                "Bodycare",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`cat-tab-btn ${
                    activeFilter === tab
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveFilter(tab)
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/shop"
            className="view-all-shop-link"
          >
            <span>
              View Full Catalog ({products.length})
            </span>

            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product Grid Component */}
        <ProductGrid
          products={displayedProducts}
          enableHover
        />
      </section>

      {/* =====================================================
          5. SPECIAL DISCOUNTS & FLASH DEALS
      ===================================================== */}

      <section className="flash-deals-section">
        <div className="flash-deals-banner-header">
          <div className="flash-deals-header-left">

            <div className="flash-badge-pill">
              <Flame
                size={15}
                color="#ef4444"
              />

              <span>
                Special Offers & Deals • Up to 25% OFF
              </span>
            </div>

            <h2 className="flash-deals-title">
              Special Discounts & Deals on Selected Products
            </h2>

            <p className="flash-deals-desc">
              Grab high-demand skincare serums, herbal haircare shampoos,
              and luxury cosmetics with verified discount pricing and
              same-day delivery in Nepal.
            </p>
          </div>

          <Link
            to="/shop"
            className="flash-explore-all-btn"
          >
            <span>
              Explore All Discounted Deals
            </span>

            <ArrowRight size={16} />
          </Link>
        </div>

        {/* DISCOUNTED PRODUCTS GRID */}
        <ProductGrid
          products={discountedDeals}
          enableHover
        />
      </section>

      {/* =====================================================
          6. GLOW STORIES & VERIFIED CUSTOMER REVIEWS
      ===================================================== */}

      <section className="glow-stories-section">
        <div className="section-header">
          <p className="section-subtitle">
            Real Glow Stories
          </p>

          <h2 className="section-title">
            Loved by 5,000+ Beauty Lovers
          </h2>

          <p className="section-description">
            Honest transformations and reviews from verified customers
            across Pokhara & Nepal.
          </p>
        </div>

        {/* Editorial Reviews Grid */}
        <div className="reviews-editorial-grid">
          {GLOW_STORIES.map((story, i) => (
            <div
              key={i}
              className="review-luxury-card"
            >
              <div>
                <div className="review-card-header">
                  <div className="review-star-row">
                    {[...Array(story.rating)].map(
                      (_, rIdx) => (
                        <Star
                          key={rIdx}
                          size={15}
                          fill="#f59e0b"
                          color="#f59e0b"
                        />
                      )
                    )}
                  </div>

                  <span className="review-concern-tag">
                    {story.concern}
                  </span>
                </div>

                <Link
                  to="/shop"
                  className="review-product-pill"
                >
                  <Sparkles
                    size={13}
                    color="var(--primary)"
                  />

                  <span>
                    {story.product}
                  </span>
                </Link>

                <p className="review-quote-text">
                  "{story.comment}"
                </p>
              </div>

              <div className="review-user-footer">
                <div className="review-user-avatar">
                  {story.avatar}
                </div>

                <div className="review-user-meta">
                  <strong>
                    <span>{story.name}</span>

                    <BadgeCheck
                      size={16}
                      className="verified-blue-check"
                    />
                  </strong>

                  <small>
                    {story.location} • Verified Glow Buyer
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Statistics Bar */}
        <div className="community-stats-strip">

          <div className="community-stat-box">
            <span className="stat-number-val">
              4.9 / 5.0
            </span>

            <span className="stat-desc-label">
              ⭐ 1,200+ Verified Reviews
            </span>
          </div>

          <div className="community-stat-box">
            <span className="stat-number-val">
              98.6%
            </span>

            <span className="stat-desc-label">
              ⚡ Same-Day Pokhara Dispatch
            </span>
          </div>

          <div className="community-stat-box">
            <span className="stat-number-val">
              100%
            </span>

            <span className="stat-desc-label">
              🌿 Cruelty-Free & Authentic
            </span>
          </div>

          <div className="community-stat-box">
            <span className="stat-number-val">
              5,000+
            </span>

            <span className="stat-desc-label">
              🌸 Happy Nepali Glowers
            </span>
          </div>

        </div>
      </section>
    </main>
  );
}