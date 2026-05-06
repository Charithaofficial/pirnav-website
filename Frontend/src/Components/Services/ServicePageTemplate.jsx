import React from "react";
import { Link } from "react-router-dom";

function ServicePageTemplate({ service }) {
  return (
    <div className="service-page">
      <section className="service-page__hero service-page__section-shell">
        <div className="service-page__hero-copy">
          <span className="service-page__eyebrow">
            {service.eyebrow || "Technology Service"}
          </span>

          <div className="service-page__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>{service.breadcrumbLabel || service.title}</span>
          </div>

          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>

        <div className="service-page__hero-media">
          <img src={service.image.src} alt={service.image.alt} />
        </div>
      </section>

      <section className="service-page__section service-page__section-shell">
        <div className="service-page__section-header">
          <span className="service-page__section-kicker">Service Overview</span>
          <h2>Capabilities and outcomes built on the same delivery model.</h2>
          <p>
            Each service page follows the same structure, spacing, and component
            sizing so the experience stays consistent while the content stays specific.
          </p>
        </div>

        <div className="service-page__grid">
          {service.overviewCards.map((card) => (
            <article key={card.title} className="service-page__card">
              <h3>{card.title}</h3>

              <ul className="service-page__feature-list">
                {card.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.text} className="service-page__feature-item">
                      <span className="service-page__feature-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="service-page__section service-page__section-shell service-page__section--accent">
        <div className="service-page__section-header">
          <span className="service-page__section-kicker">Related Technologies</span>
          <h2>{service.technologiesTitle || "Platforms and technologies we use in delivery."}</h2>
          <p>
            {service.technologiesDescription ||
              "Technology choices are aligned to business context, integration needs, security requirements, and long-term maintainability."}
          </p>
        </div>

        <div className="service-page__tech-grid">
          {service.technologies.map((item) => (
            <div key={item} className="service-page__tech-chip">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ServicePageTemplate;
