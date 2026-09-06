
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/ProductGrid";

import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Store,
  Tag,
  Star,
  X,
  RotateCcw,
  Truck,
} from "lucide-react";

import "../styles/shop.css";

const CATEGORY_META = {
  All: {
    title: "All Beauty & Cosmetic Products",
    subtitle: "Complete Catalog in Nepal",
    desc: "Discover Nepal's most comprehensive collection of authentic skincare, organic haircare, and luxury makeup essentials formulated for radiant, healthy beauty.",
  },

  Skincare: {
    title: "Buy Skincare & Serums at Best Price in Nepal",
    subtitle: "Dermatologist Tested Formulations",
    desc: "Find the perfect facial cleanser, vitamin C serum, hydrating toner, and daily SPF 50 sunscreen tailored for Asian and Nepali skin types.",
  },

  Makeup: {
    title: "Buy Makeup & Cosmetics in Nepal",
    subtitle: "Flawless Everyday Glamour",
    desc: "Explore velvet matte lipsticks, long-wear dewy foundations, setting sprays, and high-pigment blush palettes for every skin tone.",
  },

  Haircare: {
    title: "Buy Shampoo & Haircare at Best Price in Nepal",
    subtitle: "Healthy Scalp & Silky Strands",
    desc: "From anti-dandruff herbal shampoos and rosemary growth oils to deep keratin repair serums, achieve smooth and voluminous hair.",
  },

  Bodycare: {
    title: "Buy Luxury Bodycare & Scrubs in Nepal",
    subtitle: "All-Over Skin Nourishment",
    desc: "Pamper your body with natural coffee scrubs, whipped body lotions, soothing aloe gels, and replenishing sheet masks.",
  },
};

const BEAUTY_CONCERNS = [
  "Brightening & Glow",
  "Anti-Acne & Pores",
  "Deep Hydration",
  "Anti-Hair Fall",
  "Anti-Dandruff",
  "Sun Protection",
  "Matte Finish",
  "Anti-Aging",
];

export default function Shop() {
  const { products } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();

  const queryCategory =
    searchParams.get("category") || "All";

  const querySubcategory =
    searchParams.get("subcategory") || "All";

  const [category, setCategory] =
    useState(queryCategory);

  const [subcategory, setSubcategory] =
    useState(querySubcategory);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] =
    useState("default");

  const [maxPrice, setMaxPrice] =
    useState(3500);

  const [selectedConcern, setSelectedConcern] =
    useState("All");

  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);

  // =========================================
  // SYNC URL PARAMETERS
  // =========================================
  useEffect(() => {
    setCategory(queryCategory);
    setSubcategory(querySubcategory);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [queryCategory, querySubcategory]);

  // =========================================
  // CATEGORIES
  // =========================================
  const categories = [
    "All",
    "Skincare",
    "Makeup",
    "Haircare",
    "Bodycare",
  ];

  // =========================================
  // CATEGORY COUNTS
  // =========================================
  const categoryCounts = useMemo(() => {
    const counts = {
      All: products.length,
    };

    categories.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = products.filter(
          (product) =>
            product.category === cat
        ).length;
      }
    });

    return counts;
  }, [products]);

  // =========================================
  // TOP RATED PRODUCTS
  // =========================================
  const topRatedProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          (Number(b.rating) || 0) -
          (Number(a.rating) || 0)
      )
      .slice(0, 3);
  }, [products]);

  // =========================================
  // FILTER + SORT PRODUCTS
  // =========================================
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const productCategory =
        product.category?.toLowerCase() || "";

      const productDescription =
        product.description?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();

      const concernText =
        selectedConcern.toLowerCase();

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesSubcategory =
        category !== "Makeup" ||
        subcategory === "All" ||
        product.subcategory === subcategory;

      const matchesSearch =
        productName.includes(searchText) ||
        productCategory.includes(searchText) ||
        productDescription.includes(searchText);

      const matchesPrice =
        Number(product.price) <= maxPrice;

      const matchesConcern =
        selectedConcern === "All" ||
        productName.includes(concernText) ||
        productDescription.includes(concernText);

      return (
        matchesCategory &&
        matchesSubcategory &&
        matchesSearch &&
        matchesPrice &&
        matchesConcern
      );
    });

    // =========================================
    // SORT
    // =========================================
    if (sortBy === "price-asc") {
      result = [...result].sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    } else if (sortBy === "price-desc") {
      result = [...result].sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    } else if (sortBy === "rating") {
      result = [...result].sort(
        (a, b) =>
          (Number(b.rating) || 0) -
          (Number(a.rating) || 0)
      );
    } else if (sortBy === "newest") {
      result = [...result].reverse();
    }

    return result;
  }, [
    products,
    category,
    subcategory,
    search,
    maxPrice,
    selectedConcern,
    sortBy,
  ]);

  // =========================================
  // CATEGORY CHANGE
  // =========================================
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);

    if (newCat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: newCat,
      });
    }

    if (newCat !== "Makeup") {
      setSubcategory("All");
    }
  };

  // =========================================
  // RESET FILTERS
  // =========================================
  const handleResetFilters = () => {
    setCategory("All");
    setSubcategory("All");
    setSearch("");
    setMaxPrice(3500);
    setSelectedConcern("All");
    setSortBy("default");
    setSearchParams({});
  };

  // =========================================
  // ACTIVE FILTER CHECK
  // =========================================
  const hasActiveFilters =
    category !== "All" ||
    search !== "" ||
    maxPrice < 3500 ||
    selectedConcern !== "All" ||
    sortBy !== "default";

  const currentMeta =
    CATEGORY_META[category] ||
    CATEGORY_META.All;

  return (
    <main className="shop-page-wrapper">

      {/* =========================================
          1. BREADCRUMB NAVIGATION
      ========================================= */}

      <nav
        className="shop-breadcrumbs"
        aria-label="Breadcrumb"
      >
        <Link to="/">
          Home
        </Link>

        <span className="breadcrumb-separator">
          /
        </span>

        <Link
          to="/shop"
          onClick={() =>
            handleCategoryChange("All")
          }
        >
          Shop Catalog
        </Link>

        {category !== "All" && (
          <>
            <span className="breadcrumb-separator">
              /
            </span>

            <span className="breadcrumb-current">
              {category}
            </span>
          </>
        )}

        {subcategory !== "All" && (
          <>
            <span className="breadcrumb-separator">
              /
            </span>

            <span className="breadcrumb-current">
              {subcategory}
            </span>
          </>
        )}
      </nav>

      {/* =========================================
          2. CATEGORY BANNER
      ========================================= */}

      <section className="shop-category-banner">

        <div className="category-banner-badge">
          <Sparkles size={13} />

          <span>
            {currentMeta.subtitle}
          </span>
        </div>

        <h1 className="category-banner-title">
          {currentMeta.title}
        </h1>

        <p className="category-banner-desc">
          {currentMeta.desc}
        </p>

      </section>

      {/* =========================================
          3. MAIN TWO-COLUMN LAYOUT
      ========================================= */}

      <div className="shop-layout-container">

        {/* =========================================
            LEFT SIDEBAR
        ========================================= */}

        <aside
          className={`shop-sidebar-filter ${
            isMobileFilterOpen
              ? "mobile-open"
              : ""
          }`}
          aria-label="Product filters"
        >

          {/* MOBILE FILTER HEADER */}
          {isMobileFilterOpen && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom:
                  "1px solid var(--border-color)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                Filters
              </h3>

              <button
                type="button"
                onClick={() =>
                  setIsMobileFilterOpen(false)
                }
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-main)",
                }}
              >
                <X size={22} />
              </button>
            </div>
          )}

          {/* =========================================
              CATEGORY FILTER
          ========================================= */}

          <div className="filter-widget-group">

            <div className="filter-widget-title">

              <span>
                Categories
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-filter-btn"
                  onClick={handleResetFilters}
                >
                  Reset All
                </button>
              )}

            </div>

            <ul className="sidebar-category-list">

              {categories.map((cat) => (
                <li key={cat}>

                  <button
                    type="button"
                    className={`sidebar-category-item ${
                      category === cat
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      handleCategoryChange(cat);

                      if (isMobileFilterOpen) {
                        setIsMobileFilterOpen(false);
                      }
                    }}
                  >
                    <span>
                      {cat}
                    </span>

                    <span className="sidebar-cat-count">
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>

                </li>
              ))}

            </ul>
          </div>

          {/* =========================================
              PRICE FILTER
          ========================================= */}

          <div className="filter-widget-group">

            <div className="filter-widget-title">
              <span>
                Filter by Price
              </span>
            </div>

            <div className="price-slider-wrap">

              <input
                type="range"
                min="400"
                max="3500"
                step="50"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Number(e.target.value)
                  )
                }
                className="price-range-slider"
                aria-label="Filter maximum price"
              />

              <div className="price-slider-labels">

                <span>
                  ₨ 400
                </span>

                <span className="price-slider-active-val">
                  Up to ₨{" "}
                  {maxPrice.toLocaleString()}
                </span>

              </div>
            </div>
          </div>

          {/* =========================================
              BEAUTY CONCERNS
          ========================================= */}

          <div className="filter-widget-group">

            <div className="filter-widget-title">
              <span>
                Skin & Hair Concern
              </span>
            </div>

            <div className="concern-chips-grid">

              <button
                type="button"
                className={`concern-chip-btn ${
                  selectedConcern === "All"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedConcern("All")
                }
              >
                All Concerns
              </button>

              {BEAUTY_CONCERNS.map(
                (concern) => (
                  <button
                    key={concern}
                    type="button"
                    className={`concern-chip-btn ${
                      selectedConcern === concern
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedConcern(
                        concern
                      )
                    }
                  >
                    {concern}
                  </button>
                )
              )}

            </div>
          </div>

          {/* =========================================
              TOP RATED PRODUCTS
          ========================================= */}

          <div className="filter-widget-group">

            <div className="filter-widget-title">
              <span>
                Top Rated Products
              </span>
            </div>

            <div className="top-rated-widget-list">

              {topRatedProducts.map((p) => {

                const imgPath = p.image
                  ? "/" +
                    p.image
                      .replace(
                        /^public\//,
                        ""
                      )
                      .replace(
                        /^\//,
                        ""
                      )
                  : "/logo of geets beauty product.png";

                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="top-rated-mini-item"
                  >

                    <div className="top-rated-thumb">
                      <img
                        src={imgPath}
                        alt={p.name}
                        onError={(e) => {
                          if (!e.currentTarget.src.includes("logo")) {
                            e.currentTarget.src =
                              "/logo of geets beauty product.png";
                          }
                        }}
                      />
                    </div>

                    <div className="top-rated-meta">

                      <h5>
                        {p.name}
                      </h5>

                      <div className="top-rated-stars">

                        <Star
                          size={12}
                          fill="#f59e0b"
                          color="#f59e0b"
                        />

                        <span>
                          {p.rating || "4.8"}
                        </span>

                      </div>

                      <div className="top-rated-price-row">

                        <span>
                          ₨{" "}
                          {Number(
                            p.price || 0
                          ).toLocaleString()}
                        </span>

                        {p.oldPrice && (
                          <span className="top-rated-price-old">
                            ₨{" "}
                            {Number(
                              p.oldPrice
                            ).toLocaleString()}
                          </span>
                        )}

                      </div>

                    </div>

                  </Link>
                );
              })}

            </div>
          </div>

        </aside>

        {/* =========================================
            RIGHT PRODUCT CATALOG
        ========================================= */}

        <section className="shop-catalog-area">

          {/* =========================================
              CATALOG TOOLBAR
          ========================================= */}

          <div className="catalog-toolbar">

            <div className="toolbar-left">

              <button
                type="button"
                className="mobile-filter-drawer-btn"
                onClick={() =>
                  setIsMobileFilterOpen(true)
                }
              >
                <SlidersHorizontal size={15} />

                <span>
                  Filter & Price
                </span>
              </button>

              <span className="results-count-text">
                Showing{" "}
                {filteredProducts.length}{" "}
                of{" "}
                {products.length} results
              </span>

            </div>

            <div className="toolbar-right">

              {/* QUICK SEARCH */}
              <div className="toolbar-search-input">

                <Search
                  size={15}
                  color="var(--primary)"
                />

                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    style={{
                      background:
                        "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}

              </div>

              {/* SORT */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="sort-select-box"
                aria-label="Sort products"
              >
                <option value="default">
                  Sort by: Featured & Popular
                </option>

                <option value="price-asc">
                  Sort by: Price (Low to High)
                </option>

                <option value="price-desc">
                  Sort by: Price (High to Low)
                </option>

                <option value="rating">
                  Sort by: Customer Rating
                </option>

                <option value="newest">
                  Sort by: Newest Arrivals
                </option>
              </select>

            </div>
          </div>

          {/* =========================================
              PRODUCT GRID
          ========================================= */}

          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              enableHover={false}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "var(--bg-card)",
                borderRadius: "24px",
                border:
                  "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >

              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background:
                    "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "var(--primary)",
                }}
              >
                <Search size={28} />
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                }}
              >
                No products found
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  margin: "0 0 20px",
                }}
              >
                We couldn't find any products
                matching your current filters.
              </p>

              <button
                type="button"
                onClick={handleResetFilters}
                className="hero-btn-primary"
                style={{
                  display: "inline-flex",
                }}
              >
                <RotateCcw size={16} />

                <span>
                  Reset All Filters
                </span>
              </button>

            </div>
          )}

          {/* =========================================
              TRUST SERVICES
          ========================================= */}

          <div className="shop-trust-services">

            <div className="service-card-item">

              <div className="service-icon-wrap">
                <Store size={22} />
              </div>

              <div className="service-meta">

                <h4>
                  In-Store Pickup
                </h4>

                <p>
                  Pick up your beauty orders
                  instantly from our Pokhara
                  Boutique.
                </p>

              </div>
            </div>

            <div className="service-card-item">

              <div className="service-icon-wrap">
                <Truck size={22} />
              </div>

              <div className="service-meta">

                <h4>
                  Courier Delivery
                </h4>

                <p>
                  1-day delivery for Pokhara
                  Valley, 2-3 days for all other
                  Nepal locations.
                </p>

              </div>
            </div>

            <div className="service-card-item">

              <div className="service-icon-wrap">
                <Tag size={22} />
              </div>

              <div className="service-meta">

                <h4>
                  Special Offers
                </h4>

                <p>
                  Use code{" "}
                  <strong>GLOW20</strong>{" "}
                  for instant 20% discount at
                  checkout.
                </p>

              </div>
            </div>

          </div>

        </section>
      </div>
    </main>
  );
}

