// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaPython,
  FaDocker,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Dashboard.css";
import securityImageMain from "../../assets/security1.png";
import securityImageSmall from "../../assets/security2.jpg";
import whyThreatImage from "../../assets/research.jpg";
import whySecurityImage from "../../assets/creative-team.jpg";
import { blogPosts } from "./blogData";

const approachSteps = [
  {
    number: "1",
    icon: "fa-solid fa-magnifying-glass-chart",
    title: "Business Discovery",
    description: "Understand goals, needs, and key priorities.",
    colorClass: "approach-step-one",
  },
  {
    number: "2",
    icon: "fa-solid fa-laptop-code",
    title: "Rapid Planning",
    description: "Set the scope, timeline, and next steps.",
    colorClass: "approach-step-two",
  },
  {
    number: "3",
    icon: "fa-solid fa-gears",
    title: "Build & Validate",
    description: "Build, test, and improve the solution.",
    colorClass: "approach-step-three",
  },
  {
    number: "4",
    icon: "fa-solid fa-layer-group",
    title: "Scalable Delivery",
    description: "Launch with support and room to grow.",
    colorClass: "approach-step-four",
  },
  {
    number: "5",
    icon: "fa-solid fa-handshake-angle",
    title: "Ongoing Partnership",
    description: "Continue with support and improvements.",
    colorClass: "approach-step-five",
  },
];

const counterItems = [
  {
    icon: "fa-solid fa-laptop-code",
    value: 10,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    icon: "fa-solid fa-handshake-angle",
    value: 10,
    suffix: "+",
    label: "Happy Clients",
  },
  {
    icon: "fa-solid fa-users-gear",
    value: 100,
    suffix: "+",
    label: "Team Members",
  },
  {
    icon: "fa-solid fa-award",
    value: 10,
    suffix: "+",
    label: "Years of Experience",
  },
];

const techStack = [
  { label: "React", icon: FaReact, color: "#61dafb" },
  { label: "Node.js", icon: FaNodeJs, color: "#68a063" },
  { label: "AWS", icon: FaAws, color: "#ff9900" },
  { label: "Python", icon: FaPython, color: "#3776ab" },
  { label: "Docker", icon: FaDocker, color: "#2496ed" },
  { label: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { label: "HTML5", icon: FaHtml5, color: "#e34f26" },
  { label: "CSS3", icon: FaCss3Alt, color: "#1572b6" },
  { label: "JavaScript", icon: FaJsSquare, color: "#f7df1e" },
];

const dashboardServices = [
  {
    title: "Application Development",
    description:
      "We build custom business apps that are fast, secure, and easy to use.",
    pills: ["Custom apps", "Secure systems", "Smooth performance"],
    to: "/services/application-development",
  },
  {
    title: "Testing / Automation",
    description:
      "We improve software quality with testing, automation, and regular checks.",
    pills: ["Test automation", "Regression testing", "Quality checks"],
    to: "/services/testing-automation",
  },
  {
    title: "Maintenance & Support",
    description:
      "We keep systems running well with monitoring, fixes, and support.",
    pills: ["System monitoring", "Quick fixes", "Ongoing support"],
    to: "/services/maintainance-support",
  },
  {
    title: "Web Development",
    description:
      "We create websites and web apps that are fast, simple, and user-friendly.",
    pills: ["Responsive websites", "Web apps", "Better user experience"],
    to: "/services/web-development",
  },
  {
    title: "Mobile App Development",
    description:
      "We build mobile apps for Android and iOS with smooth performance.",
    pills: ["Android apps", "iOS apps", "Cross-platform apps"],
    to: "/services/mobile-app-development",
  },
  {
    title: "SAP Solutions",
    description:
      "We help businesses use SAP better with setup, integration, and support.",
    pills: ["SAP setup", "System integration", "Business support"],
    to: "/services/sap-solutions",
  },
  {
    title: "Oracle Solutions",
    description:
      "We provide Oracle solutions for databases, systems, and business support.",
    pills: ["Oracle databases", "Business systems", "Platform support"],
    to: "/services/oracle-solutions",
  },
  {
    title: "Microsoft Solutions",
    description:
      "We build Microsoft solutions with Azure, .NET, and cloud tools.",
    pills: ["Azure services", ".NET apps", "Cloud tools"],
    to: "/services/microsoft-solutions",
  },
  {
    title: "Cyber Security",
    description:
      "We protect apps, cloud systems, and user access with better security.",
    pills: ["App security", "Cloud security", "User protection"],
    to: "/services/cyber-security",
  },
  {
    title: "AI / ML Ops",
    description:
      "We help teams launch and manage AI and machine learning solutions.",
    pills: ["Model launch", "ML monitoring", "AI support"],
    to: "/services/ai-ml",
  },
  {
    title: "Data Science",
    description:
      "We turn data into useful reports, insights, and forecasts.",
    pills: ["Insights", "Forecasting", "Data analysis"],
    to: "/services/data-science",
  },
  {
    title: "Professional Services",
    description:
      "We provide consulting, staffing, and support to help teams grow.",
    pills: ["Consulting", "Staffing", "Team support"],
    to: "/services/professional-services",
  },
];

const Dashboard = () => {
  const counterSectionRef = useRef(null);
  const servicesScrollerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const [counts, setCounts] = useState(() => counterItems.map(() => 0));
  const [activeTechIndex, setActiveTechIndex] = useState(0);

  /* SCROLL ANIMATION */
  useEffect(() => {

    const elements = document.querySelectorAll(
      ".fade-up, .fade-left, .fade-right, .zoom-in"
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    });

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollDashboardServices = (direction) => {
    const container = servicesScrollerRef.current;

    if (!container) {
      return;
    }

    const track = container.querySelector(".dashboard-services-track");
    const gap = track ? Number.parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || "0") : 0;
    const amount = container.clientWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const section = counterSectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) {
          return;
        }

        hasAnimatedRef.current = true;
        const duration = 1800;
        const start = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setCounts(
            counterItems.map((item) => Math.floor(item.value * easedProgress))
          );

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveTechIndex((current) => (current + 1) % techStack.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>

{/* ================= HERO SECTION ================= */}

<div className="hero-container">

<Swiper
modules={[Navigation, Autoplay, Pagination]}
navigation
pagination={{ clickable: true }}
autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
loop={true}
>

<SwiperSlide>
<div className="slide slide2">
<div className="hero-content">
<h1>Enterprise Application Development</h1>
<p>
We build business software that makes daily work easier and supports growth.
</p>
</div>
</div>
</SwiperSlide>

<SwiperSlide>
<div className="slide slide1">
<div className="hero-content">
<h1 className="hero-heading-up">Cloud & Digital Transformation</h1>
<p>
Move to the cloud with simple, secure, and scalable digital solutions.
</p>
</div>
</div>
</SwiperSlide>

<SwiperSlide>
  <div className="slide slide3">
    <div className="hero-content">
      <h1>End-to-End Software Development</h1>
      <p>
        From planning to launch, we build software that is simple, strong, and ready to use.
      </p>
    </div>
  </div>
</SwiperSlide>

</Swiper>

</div>

{/* ================= CTA SECTION ================= */}

<section className="cta-section fade-up">

<div className="cta-container">

<div className="cta-copy">
<span className="cta-eyebrow">Start Your Next Build</span>
<h2>Reliable IT services with fast support.</h2>
<p>
Work with a team that supports development, cloud, testing, and staffing.
</p>
<div className="cta-points">
<span>Fast support</span>
<span>Skilled teams</span>
<span>Quick project start</span>
</div>
</div>

<div className="cta-side">
<div className="cta-orbit" aria-hidden="true">
<span className="cta-orbit-core"></span>
<span className="cta-orbit-ring ring-one"></span>
<span className="cta-orbit-ring ring-two"></span>
<span className="cta-orbit-dot dot-one"></span>
<span className="cta-orbit-dot dot-two"></span>
</div>

<div className="cta-actions">
<Link to="/contact" className="cta-btn">
Contact Pirnav Today
</Link>
<p>Tell us what you need and we will connect you with the right team.</p>
</div>
</div>

</div>

</section>

{/* ================= ABOUT SECTION ================= */}

<section className="about-section fade-up">

<div className="about-heading">
<h2>
Innovative IT Solutions & Staffing Services for Modern Businesses
</h2>
</div>

<div className="about-container">

<div className="about-images fade-left">
<div className="dashboard-about-image-stack">
<img
src={securityImageMain}
className="about-img-main zoom-in"
alt="Pirnav IT solutions"
/>

<img
src={securityImageSmall}
className="about-img-small fade-right"
alt="Pirnav team collaboration"
/>

<div className="about-badge fade-up">
<h3>2016</h3>
<p>Delivering IT Solutions & Staffing Services</p>
</div>
</div>

</div>

<div className="about-content fade-right">

<p>
Pirnav Software Solutions is a trusted technology partner helping
businesses grow with simple and reliable technology services.
</p>

<ul className="about-list">
<li>Enterprise Application Development</li>
<li>Automation Testing & QA</li>
<li>Cloud Transformation</li>
<li>Professional IT Staffing</li>
</ul>

<Link to="/about" className="about-cta">
Learn More About Pirnav
</Link>

</div>

</div>

</section>

<section className="approach-section fade-up">
<div className="approach-wrapper">
<h2>Our Simple Approach to IT Delivery</h2>

<div className="approach-track">
{approachSteps.map((step) => (
<div key={step.number} className={`approach-step ${step.colorClass}`}>
<div className="approach-circle">
<div className="approach-icon">
<i className={step.icon}></i>
</div>
<h3>{step.title}</h3>
<p>{step.description}</p>
</div>
<span className="approach-number">{step.number}</span>
</div>
))}
</div>
</div>
</section>

<section className="tech-strip-section fade-up">
  <div className="tech-strip-shell">
    <div className="tech-strip-scroll">
      <div className="tech-strip-track" role="list" aria-label="Technology stack">
        {[...techStack, ...techStack].map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={`${item.label}-${index}`}
            className={`tech-strip-card ${
              index % techStack.length === activeTechIndex ? "tech-strip-card-active" : ""
            }`}
            role="listitem"
            style={{ "--tech-brand": item.color }}
          >
            <Icon className="tech-strip-icon" aria-hidden="true" />
            <span>{item.label}</span>
          </div>
        );
        })}
      </div>
    </div>
  </div>
</section>

<section className="dashboard-services-section fade-up">
  <div className="dashboard-services-shell">
    <button
      type="button"
      className="dashboard-services-arrow dashboard-services-arrow-left"
      onClick={() => scrollDashboardServices("left")}
      aria-label="Scroll services left"
    >
      <FaArrowLeft />
    </button>

    <div className="dashboard-services-scroller" ref={servicesScrollerRef}>
      <div className="dashboard-services-track">
        {dashboardServices.map((service) => {
        return (
          <article key={service.title} className="dashboard-service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>

            <div className="dashboard-service-pills">
              {service.pills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>

            <Link to={service.to} className="dashboard-service-link">
              Learn more
            </Link>
          </article>
        );
        })}
      </div>
    </div>

    <button
      type="button"
      className="dashboard-services-arrow dashboard-services-arrow-right"
      onClick={() => scrollDashboardServices("right")}
      aria-label="Scroll services right"
    >
      <FaArrowRight />
    </button>
  </div>
</section>

<section className="blog-preview-section fade-up">
  <div className="blog-preview-shell">
    <div className="blog-preview-header">
      <div>
        <span className="blog-preview-kicker">Latest Blogs</span>
        <h2>Simple ideas and useful updates.</h2>
        <p>
          Read short articles from our team about technology, business support,
          and digital work.
        </p>
      </div>

      <Link to="/blogs" className="blog-preview-viewall">
        View All Blogs
      </Link>
    </div>

    <div className="blog-preview-grid">
      {blogPosts.slice(0, 4).map((post, index) => (
        <article key={post.title} className="blog-preview-card">
          <div className="blog-preview-image-wrap">
            <img
              className="blog-preview-image"
              src={post.image}
              alt={post.title}
            />
            <span className="blog-preview-chip">{post.category}</span>
          </div>

          <div className="blog-preview-card-body">
            <div className="blog-preview-card-meta">
              <span>{post.readTime}</span>
              <span>{`0${index + 1}`}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>

            <Link to={`/blogs/${post.slug}`} className="blog-preview-link">
              Read More
            </Link>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
{/* ================= WHY SECTION ================= */}
{/* ================= COUNTER SECTION ================= */}

<section className="counter-section fade-up" ref={counterSectionRef}>
  <div className="counter-shell">
    <div className="counter-intro">
      <span className="counter-kicker">Delivery Snapshot</span>
      <h2>Built for teams that care about speed, quality, and staying supported after launch.</h2>
      <p>
        Pirnav brings development, testing, cloud, and staffing support together in one simple model.
      </p>

      <div className="counter-trust-list">
        <span>Simple process</span>
        <span>Skilled teams</span>
        <span>Long-term support</span>
      </div>
    </div>

    <div className="counter-grid">
      {counterItems.map((item, index) => (
        <article className="counter-stat-card" key={item.label}>
          <div className="counter-stat-top">
            <span className="counter-stat-icon">
              <i className={item.icon}></i>
            </span>
            <span className="counter-stat-label">{item.label}</span>
          </div>

          <h3>
            {counts[index].toLocaleString()}
            <span>{item.suffix}</span>
          </h3>

          <p>
            {index === 0 && "Projects completed across web, cloud, and business systems."}
            {index === 1 && "Clients supported with clear communication and steady work."}
            {index === 2 && "Team members working across development, testing, and support."}
            {index === 3 && "Years of experience in business technology services."}
          </p>
        </article>
      ))}
    </div>
  </div>

</section>

</>
  );
};

export default Dashboard;
