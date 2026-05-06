import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Contact.css";
import ContactForm from "../Common/ContactForm.jsx";
 
const ContactUs = () => {
  const location = useLocation();
  const officeLocations = [
    {
      city: "Madhapur, Hyderabad",
      office: "Madhapur, Hyderabad",
      phone: "040-35339312",
      email: "contact@pirnav.com",
      description:
        "Meet the team, discuss your requirements, and plan the next step with clarity.",
    },
    {
      city: "Vijayawada",
      office: "Vijayawada",
      phone: "+91 98765 43210",
      email: "vijayawada@pirnav.com",
      description:
        "Connect with our delivery team for product discussions, support needs, and solution planning.",
    },
    {
      city: "Thirupati",
      office: "Thirupati",
      phone: "+91 91234 56789",
      email: "thirupati@pirnav.com",
      description:
        "Visit our office to discuss enterprise services, staffing support, and project execution.",
    },
    {
      city: "Banglore",
      office: "Banglore",
      phone: "+91 99887 76655",
      email: "banglore@pirnav.com",
      description:
        "Meet our team to plan digital initiatives, support requirements, and delivery engagement.",
    },
  ];

  const [activeOfficeIndex, setActiveOfficeIndex] = useState(0);
 
  const activeOffice = officeLocations[activeOfficeIndex];
 
  useEffect(()=>{
 
    const elements = document.querySelectorAll(".scroll-animate");
 
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add("show");
        }
      });
    },{threshold:0.2});
 
    elements.forEach((el)=>observer.observe(el));
 
    return ()=>observer.disconnect();
 
  },[]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.getElementById(location.hash.slice(1));

    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return(
 
    <div className="page-fade">
      <section className="contact-hero">
        <div className="overlay"></div>
        <div className="contact-hero-glow contact-hero-glow-one" />
        <div className="contact-hero-glow contact-hero-glow-two" />

        <div className="contact-hero-content">
          <div className="contact-hero-copy">
            <span className="contact-eyebrow">Let's start a conversation</span>
            <h1>Connect with our team for support, projects, and business enquiries.</h1>
            <p>
              Reach out to discuss your requirements, ask questions, or start a
              conversation about the next step for your product or business.
            </p>

            <div className="contact-hero-badges">
              <span>Fast responses</span>
              <span>Clear communication</span>
              <span>Real project support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-intro scroll-animate hidden">
          <span className="intro-kicker">Reach out</span>
          <h2>Simple contact and quick response.</h2>
          <p>Send us your message and our team will get back to you quickly.</p>
        </div>

        <div className="contact-left scroll-animate hidden">
          <div className="left-image">
            <img src="/images/contact-2.png" alt="Pirnav office contact support"/>
            <div className="left-image-overlay">
              <span className="contact-chip">Visit our office</span>
              <div className="office-location-tabs">
                {officeLocations.map((location, index) => (
                  <button
                    key={location.city}
                    type="button"
                    className={`office-location-tab ${index === activeOfficeIndex ? "office-location-tab-active" : ""}`}
                    onClick={() => setActiveOfficeIndex(index)}
                  >
                    {location.city}
                  </button>
                ))}
              </div>

              <h3>{activeOffice.city}</h3>
              <p>{activeOffice.description}</p>

              <div className="image-contact-list">
                <div className="image-contact-item">
                  <span className="image-contact-label">Office</span>
                  <strong>{activeOffice.office}</strong>
                </div>

                <div className="image-contact-item">
                  <span className="image-contact-label">Phone</span>
                  <strong>{activeOffice.phone}</strong>
                </div>

                <div className="image-contact-item">
                  <span className="image-contact-label">Email</span>
                  <strong>{activeOffice.email}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ContactForm
          className="contact-form-wrapper scroll-animate hidden show-form"
          formId="get-in-touch"
        />
      </section>
 
    </div>
 
  );
};
 
export default ContactUs;
