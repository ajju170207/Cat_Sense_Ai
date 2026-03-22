import React from "react";
import { Link } from "react-router-dom";
import CatLogo from "./CatLogo";

function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <h3 className="footer-logo"><CatLogo size={24} color="#000000" style={{marginRight: '8px'}} /> Cat<span>Sense</span> AI</h3>
            <p className="footer-tagline">
              Decoding the secret language of cats with advanced AI.
            </p>
          </div>

          {/* Product Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><button onClick={() => scrollTo("features")}>Features</button></li>
              <li><button onClick={() => scrollTo("demo")}>Live Demo</button></li>
              <li><button onClick={() => scrollTo("model")}>AI Model</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><button onClick={() => scrollTo("team")}>Our Team</button></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Social/Contact Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li><a href="https://github.com/404-not-found" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="mailto:contact@catsense.ai">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CatSense AI · AI&DS Department</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
