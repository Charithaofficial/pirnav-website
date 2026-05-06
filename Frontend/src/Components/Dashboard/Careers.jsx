import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Careers.css";
import { buildApiUrl } from "../../config/api";

const JOBS_PUBLIC_API = buildApiUrl("Jobs/public");

const careerHighlights = [
  {
    label: "Fast-moving team",
    value: "Agile delivery with room to own your work",
  },
  {
    label: "Flexible culture",
    value: "Hybrid-friendly collaboration and thoughtful balance",
  },
  {
    label: "Growth-first",
    value: "Work that stretches your skills on real products",
  },
];

const cultureCards = [
  {
    title: "Meaningful work",
    text: "Build products that solve practical problems and leave a visible impact across the business.",
  },
  {
    title: "Strong collaboration",
    text: "Design, engineering, and operations work closely together so good ideas move quickly.",
  },
  {
    title: "Modern environment",
    text: "We care about clarity, ownership, and a healthy pace that supports quality work.",
  },
];

const formatDescription = (text) => {
  if (!text) {
    return "Join our team and help shape thoughtful digital experiences with people who care about quality.";
  }

  if (text.length <= 140) {
    return text;
  }

  return `${text.substring(0, 140).trim()}...`;
};

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(JOBS_PUBLIC_API, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.$values) {
          setJobs(data.$values);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="careers-page">
      <section className="careers-hero">
        <div className="careers-hero-glow careers-hero-glow-one" />
        <div className="careers-hero-glow careers-hero-glow-two" />

        <div className="careers-hero-content">
          <div className="careers-copy">
            <span className="eyebrow">Build the next chapter with us</span>
            <h1>Ambitious work. Clean culture. Real ownership.</h1>
            <p>
              Explore open roles and join a company focused on thoughtful execution,
              modern products, and a genuinely collaborative culture.
            </p>

            <div className="careers-hero-badges">
              <span>Real ownership</span>
              <span>Supportive team</span>
              <span>Growth-focused roles</span>
            </div>

            <div className="hero-actions">
              <a href="#open-roles" className="primary-cta">View Open Roles</a>
              <div className="hero-mini-note">Now hiring across product, operations, and delivery.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="culture-section">
        <div className="section-heading">
          <span className="section-kicker">Our environment</span>
          <h2>A workplace that feels polished, focused, and human.</h2>
          <p>
            We keep the experience simple: clear goals, supportive collaboration,
            and enough autonomy to do your best work.
          </p>
        </div>

        <div className="culture-grid">
          {cultureCards.map((card, index) => (
            <article
              key={card.title}
              className="culture-card"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <span className="culture-index">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="openings-section" id="open-roles">
        <div className="section-heading openings-heading">
          <span className="section-kicker">Open positions</span>
          <h2>Current opportunities</h2>
          <p>Find a role where your ideas, craft, and momentum can make a difference.</p>
        </div>

        {loading && (
          <div className="jobs-list jobs-list-loading">
            {[1, 2, 3].map((item) => (
              <div key={item} className="job-card skeleton-card">
                <div className="skeleton-line skeleton-line-title" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line-short" />
              </div>
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="empty-state">
            <h3>No openings available right now.</h3>
            <p>Check back soon. We update this page whenever a new role opens up.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="jobs-list">
            {jobs.map((job, index) => (
              <article
                key={job.id}
                className="job-card"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="job-info">
                  <h3>{job.jobTitle}</h3>
                  <p className="job-desc">{formatDescription(job.jobDescription)}</p>

                  <div className="job-tags">
                    <span>{job.workLocation || "Location flexible"}</span>
                    <span>{job.jobType || "Full-time"}</span>
                  </div>
                </div>

                <div className="job-action">
                  <button
                    className="apply-btn"
                    onClick={() => navigate(`/careers/${job.id}`)}
                  >
                    Apply Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Careers;
