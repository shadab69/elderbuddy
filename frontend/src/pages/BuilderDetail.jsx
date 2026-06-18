import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ArrowLeft, MapPin, FolderOpen } from 'lucide-react';

function ProjectSlider({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-surface-alt)'
        }}
      >
        <span>No Images Available</span>
      </div>
    );
  }

  return (
    <div className="project-slider-wrapper" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div
        className="project-slider-track"
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          transform: `translateX(-${activeIndex * 100}%)`
        }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${title} slide ${idx + 1}`}
            className="project-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }}
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="project-slider-btn prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="project-slider-btn next" onClick={nextSlide}>
            &#10095;
          </button>
          <div className="project-slider-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`slider-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function BuilderDetail() {
  const { id } = useParams();
  const { builders } = useContext(AppContext);

  const builder = builders.find((b) => b.id === id);

  if (!builder) {
    return (
      <div className="container" style={{ padding: '80px 15px', textAlign: 'center' }}>
        <h2>Builder not found</h2>
        <Link
          to="/builders"
          className="btn-primary"
          style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none' }}
        >
          Back to Builders
        </Link>
      </div>
    );
  }

  const triggerInquiry = () => {
    window.dispatchEvent(
      new CustomEvent('openInquiryModal', {
        detail: {
          service: 'execution',
          details: `Consultation request with Builder: ${builder.name}. Please contact me.`
        }
      })
    );
  };

  const hasProjects = builder.projects && builder.projects.length > 0;

  return (
    <section className="designer-detail-container" style={{ padding: '40px 0' }}>
      <div className="container">
        <Link to="/builders" className="btn-back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', textDecoration: 'none' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Builders
        </Link>

        <div className="designer-detail-grid">
          {/* Sidebar Profile Info */}
          <aside className="designer-profile-sidebar">
            <div
              className="sidebar-avatar"
              style={{
                background: builder.avatarBg || 'var(--primary-light)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 15px auto'
              }}
            >
              {builder.avatarImg ? (
                <img
                  src={builder.avatarImg}
                  alt={builder.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                builder.avatarText || builder.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <h2 style={{ textAlign: 'center', margin: '10px 0 5px 0' }}>{builder.name}</h2>
            <p className="designer-firm" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}>{builder.firm}</p>

            <div className="sidebar-stats-list">
              <div className="sidebar-stat-row">
                <span>Experience:</span>
                <span>{builder.experience}</span>
              </div>
              <div className="sidebar-stat-row">
                <span>Completed Projects:</span>
                <span>{builder.completedProjects || builder.projects?.length || 0}+</span>
              </div>
              <div className="sidebar-stat-row">
                <span>Rating:</span>
                <span>{builder.rating} ⭐</span>
              </div>
              <div className="sidebar-stat-row">
                <span>Reviews:</span>
                <span>{builder.reviewsCount}</span>
              </div>
            </div>

            <p className="designer-full-bio" style={{ margin: '20px 0', fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              {builder.fullBio || builder.bio}
            </p>

            <button className="btn-primary w-full" onClick={triggerInquiry}>
              Book Consultation
            </button>
          </aside>

          {/* Projects Section */}
          <main className="designer-projects-showcase">
            <h2 style={{ marginBottom: '20px' }}>
              Project Portfolio ({builder.projects ? builder.projects.length : 0} Featured Projects)
            </h2>
            <div className="projects-list-wrapper">
              {hasProjects ? (
                builder.projects.map((proj, projectIndex) => (
                  <div className="project-card-item" key={projectIndex}>
                    <div className="project-card-img-wrapper" style={{ height: '350px', overflow: 'hidden', position: 'relative' }}>
                      <ProjectSlider images={proj.images} title={proj.title} />
                      <span className="project-year-badge">{proj.year}</span>
                    </div>
                    <div className="project-card-info" style={{ padding: '20px' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>{proj.title}</h3>
                      <div className="project-location" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <MapPin style={{ width: '14px', height: '14px' }} />
                        <span>{proj.location}</span>
                      </div>
                      <p className="project-desc" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, color: 'var(--text-muted)' }}>
                        {proj.desc}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="no-results"
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-alt)'
                  }}
                >
                  <FolderOpen
                    style={{
                      width: '48px',
                      height: '48px',
                      color: 'var(--text-muted)',
                      display: 'inline-block',
                      marginBottom: '12px'
                    }}
                  />
                  <h4>No projects uploaded yet.</h4>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
