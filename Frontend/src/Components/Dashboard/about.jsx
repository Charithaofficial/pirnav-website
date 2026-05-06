import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaChartLine,
  FaClipboardCheck,
  FaDraftingCompass,
  FaGlobeAsia,
  FaHandshake,
  FaLayerGroup,
  FaSearch,
  FaRocket,
  FaServer,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";
import "./about.css";

import processImg from "../../assets/about-team.jpg";
import bannerImg from "../../assets/about-banner.png";
import innovation from "../../assets/innovation.jpg";
import research from "../../assets/research.jpg";
import creativeteam from "../../assets/creative-team.jpg";

const capabilityStats = [
  { value: "10+", label: "Projects completed" },
  { value: "10+", label: "Clients supported" },
  { value: "100+", label: "Team members" },
  { value: "2016", label: "Started in" },
];

const valueCards = [
  {
    icon: FaRocket,
    title: "Build For Momentum",
    text: "We help teams move from idea to launch with clear planning and simple communication.",
  },
  {
    icon: FaShieldAlt,
    title: "Engineer With Confidence",
    text: "We keep quality and security in mind from the start.",
  },
  {
    icon: FaHandshake,
    title: "Partner For The Long Run",
    text: "We stay with teams after launch with support, staffing, and improvements.",
  },
];

const operatingModel = [
  {
    step: "01",
    icon: FaSearch,
    visualClass: "about-graph-discover",
    title: "Discover",
    text: "We understand your needs, goals, and project priorities.",
  },
  {
    step: "02",
    icon: FaDraftingCompass,
    visualClass: "about-graph-design",
    title: "Design",
    text: "We plan the solution, team, and process to fit your needs.",
  },
  {
    step: "03",
    icon: FaClipboardCheck,
    visualClass: "about-graph-deliver",
    title: "Deliver",
    text: "We build in simple steps with clear progress and regular feedback.",
  },
  {
    step: "04",
    icon: FaServer,
    visualClass: "about-graph-scale",
    title: "Scale",
    text: "We support growth with updates, maintenance, and extra team support.",
  },
];

const focusAreas = [
  "Enterprise Application Development",
  "Automation Testing and QA",
  "Cloud and Platform Modernization",
  "Mobile and Web Product Engineering",
  "AI & Machine Learning Solutions",
  "Professional IT Staffing",
];

function About() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <section
        className="about-hero-banner"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-copy fade-up">
            <h1>Technology partnerships that keep business moving.</h1>
            <p className="about-hero-text">
              Pirnav Software Solutions helps businesses build, launch, and
              improve digital systems with the right team and simple support.
            </p>
          </div>
        </div>
      </section>

      <section className="about-intro-panel fade-up">
        <div className="about-intro-main">
          <span className="about-section-label">About Us</span>
          <h2>Simple IT support for businesses that want steady growth.</h2>
          <p>
            From development and testing to staffing and support, we help teams
            move faster and work with more confidence.
          </p>
        </div>

        <div className="about-intro-side">
          <div className="about-mini-note">
            <FaGlobeAsia aria-hidden="true" />
            <span>India-based team with business-focused support</span>
          </div>
          <div className="about-mini-note">
            <FaUsers aria-hidden="true" />
            <span>Teams for development, platform work, and support</span>
          </div>
        </div>
      </section>

      <section className="about-stats-grid fade-up">
        {capabilityStats.map((item) => (
          <article key={item.label} className="about-stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="about-values-section">
        <div className="about-values-header fade-up">
          <span className="about-section-label">What Shapes Our Work</span>
          <h2>Our values support real work and simple progress.</h2>
        </div>

        <div className="about-values-grid">
          {valueCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="about-value-card fade-up">
                <span className="about-value-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-operating-section">
        <div className="about-operating-copy fade-up">
          <span className="about-section-label">How We Work</span>
          <h2>A simple work model that helps teams move forward.</h2>
          <p>
            We use clear planning, steady work, and simple communication from start to support.
          </p>

          <div className="about-focus-list">
            {focusAreas.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="about-operating-visual fade-up">
          <img src={processImg} alt="Pirnav delivery model" />
        </div>
      </section>

      <section className="about-timeline-section fade-up">
        <div className="about-timeline-header">
          <span className="about-section-label">Operating Model</span>
          <h2>How we turn needs into useful results.</h2>
        </div>

        <div className="about-timeline-grid">
          {operatingModel.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.step} className="about-timeline-card">
                <div className={`about-timeline-graph ${item.visualClass}`} aria-hidden="true">
                  <span className="about-graph-grid" />
                  <span className="about-graph-bar about-graph-bar-one" />
                  <span className="about-graph-bar about-graph-bar-two" />
                  <span className="about-graph-bar about-graph-bar-three" />
                  <span className="about-graph-bar about-graph-bar-four" />
                </div>

                <div className="about-timeline-card-content">
                  <div className="about-timeline-card-top">
                    <span className="about-timeline-step">{item.step}</span>
                    <span className="about-timeline-corner-icon">
                      <Icon aria-hidden="true" />
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-feature-showcase">
        <div className="about-feature-header fade-up">
          <span className="about-section-label">Built Around Capability</span>
          <h2>Three strengths that help us do good work.</h2>
        </div>

        <div className="about-feature-grid">
          <article className="about-feature-card fade-up">
            <img src={innovation} alt="Innovation at Pirnav" />
            <div className="about-feature-copy">
              <span>
                <FaBolt aria-hidden="true" />
                Innovation
              </span>
              <h3>We turn ideas into plans that teams can actually build.</h3>
              <p>
                Good planning works best when it connects to timelines and real work.
              </p>
            </div>
          </article>

          <article className="about-feature-card fade-up">
            <img src={research} alt="Research-driven delivery" />
            <div className="about-feature-copy">
              <span>
                <FaChartLine aria-hidden="true" />
                Insight
              </span>
              <h3>We use research and business needs to make better decisions.</h3>
              <p>
                We suggest ideas that fit the business and the work in front of us.
              </p>
            </div>
          </article>

          <article className="about-feature-card fade-up">
            <img src={creativeteam} alt="Collaborative team at Pirnav" />
            <div className="about-feature-copy">
              <span>
                <FaLayerGroup aria-hidden="true" />
                Teamwork
              </span>
              <h3>Our teams bring development, testing, staffing, and support together.</h3>
              <p>
                This helps the work stay clear and smooth from start to finish.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="about-cta-section fade-up">
        <div className="about-cta-shell">
          <div>
            <span className="about-section-label">Ready To Build</span>
            <h2>Let’s shape your next product, platform, or delivery team.</h2>
            <p>
              Whether you need a dedicated build partner, a stronger QA motion,
              or scalable staffing support, we can help you move with more
              clarity and confidence.
            </p>
          </div>

          <Link to="/contact#get-in-touch" className="about-cta-link">
            Talk to Pirnav
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;
