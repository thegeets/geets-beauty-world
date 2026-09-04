import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useCart } from "../context/CartContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import "./Checkout.css";

export default function Payment() {
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading] = useState(false);

  let savedOrder = null;

  try {
    const storedOrder = localStorage.getItem("geets-pending-order");

    if (storedOrder) {
      savedOrder = JSON.parse(storedOrder);
    }
  } catch (error) {
    console.error("Unable to read pending order:", error);
  }

  if (!savedOrder) {
    return (
      <main className="page-container checkout-page">
        <div className="checkout-login">
          <p className="eyebrow">Geets Beauty World</p>

          <h1>No Order Found</h1>

          <p>
            Please add products to your cart and continue checkout.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="page-container checkout-page">
        <div className="checkout-login">
          <p className="eyebrow">Geets Beauty World</p>

          <h1>Cart is Empty</h1>

          <p>Your shopping cart is empty.</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const subtotal = Number(
    savedOrder.subtotal ?? cartTotal ?? 0
  );

  const deliveryCharge = Number(
    savedOrder.deliveryCharge ?? 0
  );

  const finalTotal = Number(
    savedOrder.total ?? subtotal + deliveryCharge
  );

  const orderItems = cart
    .map((item) => {
      const itemTotal =
        Number(item.price || 0) *
        Number(item.quantity || 0);

      return `${item.name} - Qty: ${item.quantity} - Rs. ${itemTotal.toLocaleString()}`;
    })
    .join("\n");


  /* ========================================
     PAYMENT SCREENSHOT
  ======================================== */

  const handlePaymentScreenshot = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Payment screenshot must be less than 5 MB.");

      event.target.value = "";

      return;
    }

    setPaymentScreenshot(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      setScreenshotPreview(result);

      try {
        localStorage.setItem(
          "geets-payment-screenshot",
          result
        );
      } catch (error) {
        console.warn(
          "Screenshot could not be saved locally.",
          error
        );
      }
    };

    reader.readAsDataURL(file);
  };


  /* ========================================
     PAYMENT METHOD CHANGE
  ======================================== */

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);

    if (method === "cod") {
      setPaymentScreenshot(null);
      setScreenshotPreview("");
    }
  };


  /* ========================================
     CONFIRM ORDER
  ======================================== */

  const handleConfirmOrder = async () => {

    if (
      paymentMethod === "online" &&
      !paymentScreenshot
    ) {
      alert(
        "Please upload your successful payment screenshot before confirming the order."
      );

      return;
    }

    setLoading(true);

    const orderId =
      savedOrder.orderId ||
      `GBW-${Date.now()}`;

    const customer =
      savedOrder.customer || {};


    console.log(
      "SAVED ORDER:",
      savedOrder
    );

    console.log(
      "CUSTOMER:",
      customer
    );


    const customerEmail =
      customer.email ||
      customer.user_email ||
      customer.customer_email ||
      "yourtestemail@gmail.com";


    console.log(
      "CUSTOMER EMAIL:",
      customerEmail
    );


    const paymentName =
      paymentMethod === "cod"
        ? "Cash on Delivery"
        : "Online Payment - Bank QR";


    const deliveryName =
      savedOrder.deliveryMethod === "courier"
        ? "Courier Delivery"
        : "Home Delivery";


    /* ========================================
       EMAILJS TEMPLATE
    ======================================== */

    const templateParams = {

      to_email: customerEmail,

      customer_email: customerEmail,

      customer_name:
        customer.fullName ||
        customer.name ||
        "Customer",

      order_id: orderId,

      order_items: orderItems,

      subtotal:
        `Rs. ${subtotal.toLocaleString()}`,

      delivery_charge:
        deliveryCharge === 0
          ? "FREE"
          : `Rs. ${deliveryCharge.toLocaleString()}`,

      total:
        `Rs. ${finalTotal.toLocaleString()}`,

      payment_method: paymentName,

      delivery_method: deliveryName,

      phone: customer.phone || "",

      province: customer.province || "",

      city: customer.city || "",

      area: customer.area || "",

      address: customer.address || "",

      message:
        `Your order has been confirmed successfully!

Order ID: ${orderId}

Payment Method: ${paymentName}

Total: Rs. ${finalTotal.toLocaleString()}

Thank you for shopping with Geets Beauty World!`,
    };


    try {

      console.log(
        "EMAIL PARAMS:",
        templateParams
      );


      /* ========================================
         SEND EMAIL
      ======================================== */

      const result = await emailjs.send(
        "service_ci4mjcm",
        "template_glxkxpr",
        templateParams,
        {
          publicKey: "_JLOcyJjdNYh7qTRp",
        }
      );


      console.log(
        "EmailJS success:",
        result
      );


      /* ========================================
         CONFIRMED ORDER
      ======================================== */

      const confirmedOrder = {

        ...savedOrder,

        orderId,

        paymentMethod:
          paymentName,

        paymentStatus:
          paymentMethod === "cod"
            ? "Pay on Delivery"
            : "Payment Screenshot Submitted",

        paymentScreenshotUploaded:
          paymentMethod === "online",

        confirmed: true,

        confirmedAt:
          new Date().toISOString(),
      };


      /* ========================================
         SAVE CONFIRMED ORDER
      ======================================== */

      createOrder(confirmedOrder);

      localStorage.setItem(
        "geets-confirmed-order",
        JSON.stringify(confirmedOrder)
      );

      localStorage.removeItem(
        "geets-pending-order"
      );

      localStorage.removeItem(
        "geets-payment-screenshot"
      );


      /* ========================================
         CLEAR CART
      ======================================== */

      clearCart();


      /* ========================================
         GO TO ORDER SUCCESS PAGE
         
         IMPORTANT:
         Browser alert removed.
      ======================================== */

      navigate(
        "/order-success",
        {
          state: {
            order: confirmedOrder,
          },
        }
      );


    } catch (error) {

      console.error(
        "EmailJS full error:",
        error
      );

      console.error(
        "status:",
        error?.status
      );

      console.error(
        "text:",
        error?.text
      );


      alert(
        `EmailJS failed: ${
          error?.text ||
          "Unknown error"
        }`
      );


    } finally {

      setLoading(false);

    }
  };


  /* ========================================
     PAYMENT PAGE
  ======================================== */

  return (
    <main className="page-container checkout-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-heading left-heading">

        <p className="eyebrow">
          Geets Beauty World
        </p>

        <h1>
          Payment
        </h1>

        <p>
          Choose your payment method and complete your order.
        </p>

      </div>


      {/* =========================
          CHECKOUT LAYOUT
      ========================= */}

      <div className="checkout-layout">

        <div>

          {/* =========================
              PAYMENT METHOD
          ========================= */}

          <section className="checkout-section">

            <h2>
              Payment Method
            </h2>


            {/* COD */}

            <label className="payment-option">

              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={
                  paymentMethod === "cod"
                }
                onChange={() =>
                  handlePaymentMethodChange(
                    "cod"
                  )
                }
              />

              <div>

                <strong>
                  💵 Cash on Delivery
                </strong>

                <p>
                  Pay when your order arrives at your doorstep.
                </p>

              </div>

            </label>


            {/* ONLINE */}

            <label className="payment-option">

              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={
                  paymentMethod === "online"
                }
                onChange={() =>
                  handlePaymentMethodChange(
                    "online"
                  )
                }
              />

              <div>

                <strong>
                  🏦 Online Payment
                </strong>

                <p>
                  Pay using the Bank QR code.
                </p>

              </div>

            </label>

          </section>


          {/* =========================
              ONLINE PAYMENT
          ========================= */}

          {paymentMethod === "online" && (

            <section className="checkout-section qr-payment">

              <h2>
                Scan & Pay
              </h2>

              <p>
                Scan the QR code using your mobile banking app and complete the payment.
              </p>


              <div className="qr-box">

                <img
                  src="bank-qr.png"
                  alt="Geets Beauty World Bank QR"
                  className="bank-qr"
                  width="180"
                  height="200"
                />

              </div>


              <div className="qr-instruction">

                <strong>
                  Amount to Pay
                </strong>

                <span>
                  Rs. {finalTotal.toLocaleString()}
                </span>

              </div>


              {/* PAYMENT SCREENSHOT */}

              <div className="payment-upload">

                <h3>
                  📸 Upload Payment Screenshot
                </h3>

                <p>
                  After completing your payment, upload the successful payment screenshot below.
                </p>


                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePaymentScreenshot
                  }
                />


                {screenshotPreview && (

                  <div className="payment-preview">

                    <p>
                      ✓ Screenshot selected
                    </p>

                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot preview"
                    />

                  </div>

                )}

              </div>


              {!paymentScreenshot && (

                <div className="payment-warning">

                  ⚠️ Please upload your successful payment screenshot before confirming the order.

                </div>

              )}


              {paymentScreenshot && (

                <div className="payment-success">

                  ✓ Payment screenshot uploaded.

                </div>

              )}

            </section>

          )}


          {/* =========================
              CASH ON DELIVERY
          ========================= */}

          {paymentMethod === "cod" && (

            <section className="checkout-section cod-box">

              <h2>
                💵 Cash on Delivery
              </h2>

              <p>
                Your order will be confirmed and you can pay when the order is delivered.
              </p>

              <div className="cod-note">

                💡 Please keep the required amount ready when your order arrives.

              </div>

            </section>

          )}


          {/* =========================
              CONFIRM ORDER BUTTON
          ========================= */}

          <button
            type="button"
            className="primary-button full-width"
            onClick={
              handleConfirmOrder
            }
            disabled={
              loading ||
              (
                paymentMethod === "online" &&
                !paymentScreenshot
              )
            }
          >

            {loading
              ? "Confirming Order..."
              : paymentMethod === "online" &&
                !paymentScreenshot
              ? "Upload Payment Screenshot"
              : "Confirm Order"}

          </button>

        </div>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="cart-summary checkout-summary">

          <h2>
            Order Summary
          </h2>


          {cart.map((item) => (

            <div
              className="summary-product"
              key={item.id}
            >

              <span>
                {item.name}
                {" × "}
                {item.quantity}
              </span>

              <strong>
                Rs.{" "}
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toLocaleString()}
              </strong>

            </div>

          ))}


          <hr />


          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              Rs. {subtotal.toLocaleString()}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong>

              {deliveryCharge === 0
                ? "FREE"
                : `Rs. ${deliveryCharge.toLocaleString()}`}

            </strong>

          </div>


          <hr />


          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              Rs. {finalTotal.toLocaleString()}
            </strong>

          </div>


          <div className="payment-summary">

            <span>
              Payment
            </span>

            <strong>
              {paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}