// src/components/Navbar.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  Package,
  UserPlus,
  Phone,
  Code2,
  FlaskConical,
  Wrench,
  Globe,
  Smartphone,
  Database,
  ServerCog,
  AppWindow,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const serviceLinks = [
  { label: "Application Development", to: "/services/application-development", icon: Code2 },
  { label: "Testing / Automation", to: "/services/testing-automation", icon: FlaskConical },
  { label: "Maintenance & Support", to: "/services/maintainance-support", icon: Wrench },
  { label: "Web Development", to: "/services/web-development", icon: Globe },
  { label: "Mobile App Development", to: "/services/mobile-app-development", icon: Smartphone },
  { label: "SAP Solutions", to: "/services/sap-solutions", icon: Database },
  { label: "Oracle Solutions", to: "/services/oracle-solutions", icon: ServerCog },
  { label: "Microsoft Solutions", to: "/services/microsoft-solutions", icon: AppWindow },
  { label: "Cyber Security", to: "/services/cyber-security", icon: ShieldCheck },
  { label: "AI/ML Ops", to: "/services/ai-ml", icon: BrainCircuit },
  { label: "Data Science", to: "/services/data-science", icon: BarChart3 },
  { label: "Professional Services", to: "/services/professional-services", icon: BriefcaseBusiness },
];

const Navbar = () => {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const isServicesRoute = location.pathname.startsWith("/services");
  const isProductsRoute = location.pathname.startsWith("/products");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    document.body.classList.toggle("nav-menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("nav-menu-open");
    };
  }, [isMenuOpen]);

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
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="Pirnav home" onClick={() => handleLinkClick("/")}>
          <img src={logo} alt="Pirnav Logo" />
        </Link>

        <button
          type="button"
          className="nav-menu-button"
          aria-expanded={isMenuOpen}
          aria-controls="pirnav-primary-nav"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav
          id="pirnav-primary-nav"
          className={`nav-links ${isMenuOpen ? "nav-links-open" : ""}`}
        >

          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item-active" : "")} onClick={() => handleLinkClick("/")}>
            <Home size={18}/> Home
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-item-active" : "")} onClick={() => handleLinkClick("/about")}>
            <Users size={18}/> Who We Are
          </NavLink>

          <div
            className={`dropdown ${isServicesMenuOpen ? "dropdown-open" : ""}`}
            onMouseEnter={() => {
              if (window.innerWidth > 760) {
                setIsServicesMenuOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (window.innerWidth > 760) {
                setIsServicesMenuOpen(false);
              }
            }}
          >
            <div className="dropdown-trigger">
              <NavLink
                to="/services"
                className={isServicesRoute ? "nav-item-active" : ""}
                onClick={() => handleLinkClick("/services")}
              >
                <Briefcase size={20}/> What We Do
              </NavLink>

              <button
                type="button"
                className={`dropdown-toggle ${isServicesMenuOpen ? "dropdown-toggle-open" : ""}`}
                aria-expanded={isServicesMenuOpen}
                aria-label="Toggle services menu"
                onClick={() => setIsServicesMenuOpen((current) => !current)}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <ul className="dropdown-menu">
              {serviceLinks.map((service) => {
                const Icon = service.icon;

                return (
                  <li key={service.to}>
                    <NavLink
                      to={service.to}
                      className={({ isActive }) => (isActive ? "dropdown-item-active" : "")}
                      onClick={() => handleLinkClick(service.to)}
                    >
                      <span className="dropdown-link-content">
                        <span className="dropdown-service-icon">
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        <span>{service.label}</span>
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <NavLink
            to="/products"
            className={isProductsRoute ? "nav-item-active" : ""}
            onClick={() => handleLinkClick("/products")}
          >
            <Package size={18} /> Our Products
          </NavLink>

          <NavLink to="/careers" className={({ isActive }) => (isActive ? "nav-item-active" : "")} onClick={() => handleLinkClick("/careers")}>
            <UserPlus size={18}/> Careers
          </NavLink>

          <Link to="/contact" className="nav-btn" onClick={() => handleLinkClick("/contact")}>
            <Phone size={18}/> Get In Touch
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
