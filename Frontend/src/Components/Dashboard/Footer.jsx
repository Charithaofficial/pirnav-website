import { Link, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import logo from "../../assets/logo.png";
import "./Dashboard.css";

const navLinks = [
  { label: "Who We Are", to: "/about" },
  { label: "What We Do", to: "/services" },
  { label: "Our Products", to: "/products" },
  { label: "Careers", to: "/careers" },
  { label: "Get In Touch", to: "/contact#get-in-touch" },
];

const highlightItems = [
  { label: "Testing Support", to: "/services/testing-automation" },
  { label: "Microsoft Solutions", to: "/services/microsoft-solutions" },
  { label: "Professional Services", to: "/services/professional-services" },
  { label: "Web Development", to: "/services/web-development" },
  { label: "Maintainance Support", to: "/services/maintainance-support" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const handleLinkClick = (to) => {
    const [targetPath, targetHash] = to.split("#");
    const nextPath = targetPath || location.pathname;
    const currentHash = location.hash.replace("#", "");

    if (location.pathname === nextPath) {
      if (targetHash) {
        if (currentHash === targetHash) {
          const section = document.getElementById(targetHash);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <img src={logo} alt="Pirnav Logo" className="footer-logo" />
            <span className="footer-kicker">Since 2016</span>
            <p>
              Pirnav Software Solutions supports businesses with simple, reliable IT
              services, testing, cloud solutions, and staffing support for everyday
              growth. We help teams build dependable digital products with practical
              guidance, quality delivery, and long-term support.
            </p>
          </div>

          <div className="footer-col">
            <span className="footer-label">Company</span>
            <div className="footer-links">
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => handleLinkClick(item.to)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <span className="footer-label">Highlights</span>
            <div className="footer-text-list">
              {highlightItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="footer-text-item"
                  onClick={() => handleLinkClick(item.to)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col footer-contact">
            <span className="footer-label">Contact</span>
            <div className="footer-contact-links">
              <a href="mailto:contact@pirnav.com">contact@pirnav.com</a>
              <p>Hyderabad, Vijayawada, Tirupati, Bengaluru.</p>
              <p>Reach out for project discussions, support needs, and business enquiries.</p>
            </div>

            <div className="social-icons">
              <a
                className="social-box"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF aria-hidden="true" />
              </a>
              <a
                className="social-box"
                href="https://www.linkedin.com/company/pirnav/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn aria-hidden="true" />
              </a>
              <a
                className="social-box"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram aria-hidden="true" />
              </a>
              <a
                className="social-box"
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <FaXTwitter aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{`Copyright © ${currentYear} Pirnav Software Solutions. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
