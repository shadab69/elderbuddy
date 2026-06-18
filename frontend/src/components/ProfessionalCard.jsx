import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, ImageOff } from 'lucide-react';

export default function ProfessionalCard({ professional, type }) {
  const isBuilder = type === 'builder';
  const profileUrl = isBuilder ? `/builder/${professional.id}` : `/interior-designer/${professional.id}`;
  const inquiryService = isBuilder ? 'execution' : 'estimation';
  const inquiryLabel = isBuilder ? 'Builder' : 'Interior Designer';

  const triggerInquiry = (name) => {
    window.dispatchEvent(
      new CustomEvent('openInquiryModal', {
        detail: {
          service: inquiryService,
          details: `Consultation request with ${inquiryLabel}: ${name}. Please contact me.`
        }
      })
    );
  };

  const hasProjects = professional.projects && professional.projects.length > 0;
  const featuredProject = hasProjects ? professional.projects[0] : null;

  return (
    <div className="designer-card">
      <div className="designer-header">
        <Link
          to={profileUrl}
          className="designer-avatar-wrapper-link"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="designer-avatar"
            style={{
              background: professional.avatarBg || 'var(--primary-light)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {professional.avatarImg ? (
              <img
                src={professional.avatarImg}
                alt={professional.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              professional.avatarText || professional.name.substring(0, 2).toUpperCase()
            )}
          </div>
        </Link>
        <div className="designer-info">
          <Link to={profileUrl} style={{ textDecoration: 'none' }}>
            <h3 style={{ margin: 0, transition: 'color 0.2s ease' }}>{professional.name}</h3>
          </Link>
          <p className="designer-firm" style={{ margin: '4px 0 8px 0' }}>
            {professional.firm}
          </p>
          <div className="designer-stats">
            <span className="stat-badge">
              <Award style={{ width: '12px', height: '12px' }} /> {professional.experience} Exp
            </span>
            <span className="stat-badge">
              <Star
                style={{
                  width: '12px',
                  height: '12px',
                  fill: 'var(--secondary)',
                  stroke: 'none'
                }}
              />{' '}
              {professional.rating} ({professional.reviewsCount} Reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="designer-body">
        <p className="designer-bio">{professional.bio}</p>
        <div className="designer-specialties">
          {professional.specialties?.map((spec, idx) => (
            <span className="spec-tag" key={idx}>
              {spec}
            </span>
          ))}
        </div>

        {featuredProject ? (
          <div className="designer-portfolio-preview">
            <h4>Featured Project: {featuredProject.title}</h4>
            <Link to={profileUrl}>
              <img
                src={
                  featuredProject.images && featuredProject.images[0]
                    ? featuredProject.images[0]
                    : 'assets/interior_portfolio1.png'
                }
                alt={`${professional.name} Portfolio`}
                className="portfolio-img"
              />
            </Link>
          </div>
        ) : (
          <div
            className="designer-portfolio-preview"
            style={{
              padding: '24px',
              textAlign: 'center',
              border: '1px dashed var(--border-color)',
              borderRadius: '6px',
              background: 'var(--bg-surface-alt)',
              marginTop: '15px'
            }}
          >
            <ImageOff
              style={{
                width: '24px',
                height: '24px',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                display: 'inline-block'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              No projects uploaded yet.
            </p>
          </div>
        )}
      </div>

      <div className="designer-footer">
        <Link
          to={profileUrl}
          className="btn-secondary w-full text-center"
          style={{
            display: 'block',
            textDecoration: 'none',
            marginBottom: '10px',
            padding: '10px 0'
          }}
        >
          View Profile & All {professional.projects?.length || 0} Projects
        </Link>
        <button
          className="btn-primary w-full"
          onClick={() => triggerInquiry(professional.name)}
        >
          Book Free Consultation
        </button>
      </div>
    </div>
  );
}
