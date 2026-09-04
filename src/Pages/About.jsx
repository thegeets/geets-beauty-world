import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="about-page">

      {/* =========================================
          ABOUT HEADING
      ========================================= */}

      <section
        className="page-heading"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "65px 25px 55px",
          boxSizing: "border-box",
          textAlign: "left",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#9a4b5e",
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          About Geets
        </p>

        <h1
          style={{
            margin: "0 0 18px",
            color: "#542733",
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: "48px",
            fontWeight: "700",
            lineHeight: "1.15",
            letterSpacing: "-0.5px",
            textAlign: "left",
          }}
        >
          Beauty selected with care.
        </h1>

        <p
          style={{
            maxWidth: "780px",
            margin: "0",
            color: "#6f5a60",
            fontFamily: "Arial, sans-serif",
            fontSize: "18px",
            fontWeight: "500",
            lineHeight: "1.7",
            textAlign: "left",
          }}
        >
          Geets Beauty Product is a Nepal-based beauty store focused on
          skincare, makeup and everyday self-care products.
        </p>
      </section>


      {/* =========================================
          ABOUT CONTENT
      ========================================= */}

      <section className="about-content page-container">

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900"
            alt="Skincare products"
          />
        </div>

        <div className="about-text">

          <p className="eyebrow">
            Our promise
          </p>

          <h2>
            Simple beauty. Confident you.
          </h2>

          <p>
            We want to make it easier for customers in Nepal to discover
            useful and beautiful products for their daily routine.
          </p>

          <p>
            Every product collection is presented with clear information,
            simple ordering and friendly customer support.
          </p>

          <Link
            to="/shop"
            className="primary-button"
          >
            Explore Products
          </Link>

        </div>

      </section>

    </main>
  );
}