import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ArrowLeft, User, Calendar, Twitter, Facebook, Linkedin } from 'lucide-react';

function parseMarkdown(md) {
  if (!md) return '';

  // Resolve reference style links: [BUILD Magazine][1]
  const refLinks = {};
  const refRegex = /^\[(\d+)\]:\s+([^\s]+)(?:\s+"([^"]+)")?/gm;
  let match;
  const cleanMd = md;
  while ((match = refRegex.exec(cleanMd)) !== null) {
    refLinks[match[1]] = { url: match[2], title: match[3] || '' };
  }

  const lines = md.split('\n');
  let inList = false;
  let inImageGrid = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip reference declarations like [1]: https://...
    if (/^\[\d+\]:\s+/.test(line)) {
      continue;
    }

    // Match images: ![alt](url)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (!inImageGrid) {
        processedLines.push('<div class="blog-image-grid">');
        inImageGrid = true;
      }
      const altText = imageMatch[1] || 'Image';
      const imgUrl = imageMatch[2];
      processedLines.push(`
          <div class="blog-grid-image-wrapper" onclick="window.openLightbox('${imgUrl}')">
              <img src="${imgUrl}" alt="${altText}" class="blog-grid-image">
              <div class="blog-grid-image-overlay">
                  <span class="zoom-icon">&#128269; Zoom</span>
              </div>
          </div>
      `);
      continue;
    }

    // If not an image and we were in an image grid, close it
    if (inImageGrid) {
      processedLines.push('</div>');
      inImageGrid = false;
    }

    // Match lists: lines starting with * or -
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        processedLines.push('<ul class="blog-list">');
        inList = true;
      }
      let content = line.substring(2);
      // Replace bold text and inline links in list item
      content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$1</a>');
      content = content.replace(/\[([^\]]+)\]\[(\d+)\]/g, (m, text, id) => {
        const ref = refLinks[id];
        return ref ? `<a href="${ref.url}" title="${ref.title}" target="_blank" rel="noopener noreferrer" class="blog-link">${text}</a>` : text;
      });
      processedLines.push(`<li>${content}</li>`);
      continue;
    }

    // If not a list and we were in a list, close it
    if (inList) {
      processedLines.push('</ul>');
      inList = false;
    }

    // Match Headings
    if (line.startsWith('# ')) {
      const content = line.substring(2);
      processedLines.push(`<h1 class="blog-h1">${content}</h1>`);
    } else if (line.startsWith('## ')) {
      const content = line.substring(3);
      processedLines.push(`<h2 class="blog-h2">${content}</h2>`);
    } else if (line.startsWith('### ')) {
      const content = line.substring(4);
      processedLines.push(`<h3 class="blog-h3">${content}</h3>`);
    } else if (line === '---') {
      processedLines.push('<hr class="blog-hr">');
    } else if (line) {
      // Regular paragraph or text block. Process bold, inline links, reference links
      let content = line;
      content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$1</a>');
      content = content.replace(/\[([^\]]+)\]\[(\d+)\]/g, (m, text, id) => {
        const ref = refLinks[id];
        return ref ? `<a href="${ref.url}" title="${ref.title}" target="_blank" rel="noopener noreferrer" class="blog-link">${text}</a>` : text;
      });
      processedLines.push(`<p class="blog-p">${content}</p>`);
    }
  }

  // Close remaining tags if open
  if (inList) processedLines.push('</ul>');
  if (inImageGrid) processedLines.push('</div>');

  return processedLines.join('\n');
}

export default function GuideDetail() {
  const { id } = useParams();
  const { guides } = useContext(AppContext);
  const [lightboxUrl, setLightboxUrl] = useState('');

  const guide = guides.find((g) => g.id === id);

  useEffect(() => {
    window.openLightbox = (url) => {
      setLightboxUrl(url);
    };
    return () => {
      delete window.openLightbox;
    };
  }, []);

  if (!guide) {
    return (
      <div className="container" style={{ padding: '80px 15px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '15px' }}>Blog Post Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '25px' }}>
          The blog post you are looking for might have been removed or doesn't exist.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const contentHtml = parseMarkdown(guide.content || '');

  return (
    <article className="blog-detail-wrapper" style={{ padding: '40px 0' }}>
      <div className="blog-container">
        {/* Back Link */}
        <div className="blog-back-nav" style={{ marginBottom: '20px' }}>
          <Link to="/" className="btn-back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Home
          </Link>
        </div>

        {/* Blog Header */}
        <header className="blog-detail-header">
          <div className="blog-meta-category" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '8px' }}>
            Buying Guide
          </div>
          <h1 className="blog-main-title" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', lineHeight: '1.2' }}>{guide.title}</h1>
          <div className="blog-post-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span className="meta-item author" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User style={{ width: '14px', height: '14px' }} />
              <span>Elder-o-Buddy Team</span>
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar style={{ width: '14px', height: '14px' }} />
              <span>{guide.date?.split(' ')[0]}</span>
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="blog-featured-media" style={{ margin: '30px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {guide.imageSrc?.startsWith('<svg') ? (
            <div dangerouslySetInnerHTML={{ __html: guide.imageSrc }} />
          ) : (
            <img src={guide.imageSrc} alt={guide.title} className="blog-featured-img" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
          )}
        </div>

        {/* Blog Body Content */}
        <div
          className="blog-detail-content"
          style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-main)' }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Share Footer block */}
        <footer className="blog-detail-footer" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div className="share-box">
            <h4 style={{ marginBottom: '15px' }}>Share this guide:</h4>
            <div className="share-buttons" style={{ display: 'flex', gap: '10px' }}>
              <button className="share-btn twitter" onClick={() => alert('Shared on Twitter!')} style={{ background: '#1da1f2', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Twitter style={{ width: '18px', height: '18px' }} />
              </button>
              <button className="share-btn facebook" onClick={() => alert('Shared on Facebook!')} style={{ background: '#1877f2', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Facebook style={{ width: '18px', height: '18px' }} />
              </button>
              <button className="share-btn linkedin" onClick={() => alert('Shared on LinkedIn!')} style={{ background: '#0077b5', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Linkedin style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Lightbox for viewing images in large resolution */}
      {lightboxUrl && (
        <div id="blog-lightbox" className="blog-lightbox active" onClick={() => setLightboxUrl('')}>
          <div className="lightbox-close" onClick={() => setLightboxUrl('')}>
            &times;
          </div>
          <img id="lightbox-img" src={lightboxUrl} alt="Enlarged Image" />
        </div>
      )}
    </article>
  );
}
