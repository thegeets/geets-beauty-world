import { Link, useLocation } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const location = useLocation();

  // Payment.jsx बाट आएको confirmed order
  const order = location.state?.order || {};

  const orderId = order.orderId;
  const customer = order.customer || {};

  const customerName =
    customer.fullName ||
    customer.name ||
    "Customer";

  const email =
    customer.email ||
    customer.user_email ||
    customer.customer_email ||
    "";

  const total =
    Number(order.total || 0);

  return (
    <main className="order-success">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="success-heading">

        <p className="success-small-title">
          GEETS BEAUTY WORLD
        </p>

        <h1>
          Order Confirmed
        </h1>

        <p className="success-subtitle">
          Your beauty order is on its way
        </p>

      </div>


      {/* ========================================
          DELIVERY ANIMATION
      ======================================== */}

      <div className="truck-animation-box">

        <div className="delivery-scene">

          {/* ROAD */}

          <div className="scene-road">

            <div className="road-line line-1"></div>
            <div className="road-line line-2"></div>
            <div className="road-line line-3"></div>
            <div className="road-line line-4"></div>
            <div className="road-line line-5"></div>

          </div>


          {/* ====================================
              LOADING PERSON
          ==================================== */}

          <div className="loader-person">

            <div className="loader-head"></div>

            <div className="loader-hair"></div>

            <div className="loader-body">
              GEETS
            </div>

            <div className="loader-arm arm-left"></div>

            <div className="loader-arm arm-right"></div>

            <div className="loader-leg leg-left"></div>

            <div className="loader-leg leg-right"></div>

          </div>


          {/* ====================================
              BOX BEING CARRIED
          ==================================== */}

          <div className="carrying-box">

            <div className="box-tape"></div>

            <span>
              GB
            </span>

          </div>


          {/* ====================================
              TRUCK
          ==================================== */}

          <div className="delivery-truck">

            {/* Cargo */}

            <div className="truck-cargo">

              <div className="truck-brand">
                GEETS
              </div>


              {/* Boxes already loaded */}

              <div className="loaded-box loaded-one">
                GB
              </div>

              <div className="loaded-box loaded-two">
                GB
              </div>

              <div className="loaded-box loaded-three">
                GB
              </div>

              <div className="loaded-box loaded-four">
                GB
              </div>


              <div className="cargo-door"></div>

            </div>


            {/* Cabin */}

            <div className="truck-cabin">

              <div className="cabin-window"></div>

              <div className="front-window"></div>

              <div className="door-handle"></div>

            </div>


            {/* Front bumper */}

            <div className="truck-bumper"></div>


            {/* Headlight */}

            <div className="truck-headlight"></div>


            {/* Wheels */}

            <div className="truck-wheel wheel-front">
              <div></div>
            </div>

            <div className="truck-wheel wheel-back">
              <div></div>
            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          SUCCESS CONTENT
      ======================================== */}

      <div className="success-content">

        <div className="success-icon">
          ✓
        </div>


        <p className="eyebrow">
          Order Confirmed
        </p>


        <h2>
          Thank You, {customerName}! 💕
        </h2>


        <p className="success-message">
          Your order has been successfully confirmed.
        </p>


        <p className="success-message">
          We are preparing your beauty products with care.
        </p>


        {/* ====================================
            ORDER INFORMATION
        ==================================== */}

        {orderId && (
          <div className="order-info">

            <div className="order-info-item">

              <span>
                Order Number
              </span>

              <strong>
                {orderId}
              </strong>

            </div>


            <div className="order-info-item">

              <span>
                Email
              </span>

              <strong>
                {email}
              </strong>

            </div>


            <div className="order-info-item">

              <span>
                Total Amount
              </span>

              <strong>
                Rs. {total.toLocaleString()}
              </strong>

            </div>

          </div>
        )}


        {/* EMAIL */}

        <p className="email-message">
          ✉️ &nbsp;
          A confirmation email has been sent to your email
          address.
        </p>


        {/* CONTINUE SHOPPING */}

        <Link
          to="/shop"
          className="continue-shopping"
        >
          Continue Shopping
          <span>→</span>
        </Link>

      </div>

    </main>
  );
}