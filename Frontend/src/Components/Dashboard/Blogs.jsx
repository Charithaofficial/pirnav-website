import { Link } from "react-router-dom";
import "./Blogs.css";
import { blogPosts } from "./blogData";

const Blogs = () => {
  return (
    <main className="blogs-page">
      <section className="blogs-hero">
        <div className="blogs-shell">
          <span className="blogs-kicker">Blogs</span>
          <h1>Simple ideas for business and technology.</h1>
          <p>
            Read short updates from our team about IT support, cloud tools,
            testing, and digital work.
          </p>
        </div>
      </section>

      <section className="blogs-list-section">
        <div className="blogs-shell">
          <div className="blogs-grid">
            {blogPosts.map((post) => (
              <article key={post.title} className="blogs-card">
                <img className="blogs-card-image" src={post.image} alt={post.title} />

                <div className="blogs-card-body">
                  <div className="blogs-card-meta">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>

                  <Link to={`/blogs/${post.slug}`} className="blogs-card-link">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blogs;
