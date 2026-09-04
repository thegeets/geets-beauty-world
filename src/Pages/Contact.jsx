import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <main className="contact-page page-container">
      <section className="page-heading">
        <p className="eyebrow">Get in touch</p>
        <h1>We would love to hear from you</h1>
        <p>
          Contact us for product questions, availability and ordering support.
        </p>
      </section>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-card">
            <Phone size={24} />
            <div>
              <h3>Phone / WhatsApp</h3>
              <a href="tel:+9779827104869">+977 9827104869</a>
            </div>
          </div>

          <div className="contact-card">
            <Mail size={24} />
            <div>
              <h3>Email</h3>
              <a href="mailto:thegeets86@gmail.com">
                thegeets86@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-card">
            <MapPin size={24} />
            <div>
              <h3>Location</h3>
              <p>Pokhara, Nepal</p>
            </div>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            alert("Thank you. We will contact you soon.");
            event.target.reset();
          }}
        >
          <label>
            Your name
            <input type="text" name="name" required />
          </label>

          <label>
            Your email
            <input type="email" name="email" required />
          </label>

          <label>
            Message
            <textarea name="message" rows="6" required />
          </label>

          <button type="submit" className="primary-button">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}