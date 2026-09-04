import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  Store,
  Sparkles
} from "lucide-react";
import "../styles/footer.css";

const socialLinks = {
  facebook: "https://www.facebook.com/geeta.poudel.5621/",
  instagram: "https://www.instagram.com/geets.poudel/",
  github: "https://github.com/thegeets",
  youtube: "https://www.youtube.com/@geetapoudel7791",
};

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Top Value Banner */}
      <div className="footer-top-perks">
        <div className="footer-perk-item">
          <Store size={20} />
          <div>
            <strong>In-Store Pickup</strong>
            <span>Pick up immediately in Pokhara</span>
          </div>
        </div>

        <div className="footer-perk-item">
          <Truck size={20} />
          <div>
            <strong>Courier Delivery</strong>
            <span>1-day inside Valley, 2-3 days outside</span>
          </div>
        </div>

        <div className="footer-perk-item">
          <ShieldCheck size={20} />
          <div>
            <strong>100% Genuine Care</strong>
            <span>Dermatologist-approved beauty formulas</span>
          </div>
        </div>
      </div>

      <div className="footer-grid">
        {/* Brand & Mission Column */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">
            GEETS <span>BEAUTY WORLD</span>
          </Link>

          <p className="footer-bio-text">
            Nepal's dedicated destination for premium skincare, botanical haircare,
            and luxury cosmetics. Crafted with care for your everyday radiant glow.
          </p>

          <div className="footer-contact-lines">
            <a href="tel:+9779827104869" className="footer-contact-link">
              <Phone size={15} />
              <span>+977 9827104869</span>
            </a>
            <a href="mailto:thegeets86@gmail.com" className="footer-contact-link">
              <Mail size={15} />
              <span>thegeets86@gmail.com</span>
            </a>
          </div>

          <div className="social-links">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              YouTube
            </a>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h3>Categories</h3>
          <Link to="/shop?category=Skincare">Skincare & Serums</Link>
          <Link to="/shop?category=Makeup">Makeup & Cosmetics</Link>
          <Link to="/shop?category=Haircare">Hair Care & Herbal Oils</Link>
          <Link to="/shop?category=Bodycare">Bath & Body Care</Link>
          <Link to="/shop">All Products Catalog</Link>
        </div>

        {/* Useful Links Column */}
        <div>
          <h3>Useful Links</h3>
          <Link to="/shop">Shop Online</Link>
          <Link to="/wishlist">My Wishlist</Link>
          <Link to="/profile">My Orders & Profile</Link>
          <Link to="/about">About Geets Beauty</Link>
          <Link to="/contact">Contact & Store Location</Link>
        </div>

        {/* Store Locations & Hours Column */}
        <div>
          <h3>Our Locations</h3>
          <div className="footer-loc-item">
            <MapPin size={15} className="footer-loc-icon" />
            <div>
              <strong>Pokhara Main Boutique</strong>
              <small>Lakeside & Mahendrapool, Pokhara 33700</small>
            </div>
          </div>

          <div className="footer-loc-item">
            <MapPin size={15} className="footer-loc-icon" />
            <div>
              <strong>Kathmandu Hub (Dispatch Point)</strong>
              <small>Thamel / Durbar Marg, Kathmandu</small>
            </div>
          </div>

          <div className="footer-loc-item">
            <Clock size={15} className="footer-loc-icon" />
            <div>
              <strong>Store Timings</strong>
              <small>Sun - Fri: 9:00 AM - 8:00 PM</small>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} <strong>Geets Beauty World</strong> (Nepal). All Rights Reserved.
        </div>
        <div className="footer-bottom-links">
          <span>100% Authentic Products</span>
          <span>•</span>
          <span>Fast Delivery across Nepal</span>
          <span>•</span>
          <span>Cash On Delivery & Online Bank QR</span>
        </div>
      </div>
    </footer>
  );
}