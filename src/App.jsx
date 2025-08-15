import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Simple markdown parser for reviews
const parseReviews = (markdown) => {
  const reviews = [];
  
  // Split by ### to get individual reviews
  const reviewSections = markdown.split('### ');
  
  reviewSections.forEach((section, index) => {
    if (index === 0) {
      return; // Skip the header
    }
    
    // Get the title (first line)
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      return;
    }
    
    const title = lines[0].trim();
    
    // Find type and hot status using regex
    const typeMatch = section.match(/\*\*Type:\*\*\s*([^\n]+)/);
    const hotMatch = section.match(/\*\*Hot:\*\*\s*([^\n]+)/);
    
    if (title && typeMatch) {
      // Extract text content (everything after the metadata lines)
      const sectionLines = section.split('\n');
      let textLines = [];
      let foundMetadata = false;
      
      for (let i = 0; i < sectionLines.length; i++) {
        const line = sectionLines[i].trim();
        if (line.includes('**Type:**') || line.includes('**Hot:**')) {
          foundMetadata = true;
          continue;
        }
        if (foundMetadata && line && !line.startsWith('---')) {
          textLines.push(line);
        }
      }
      
      const reviewText = textLines.join(' ').trim();
      
      const review = {
        title: title,
        type: typeMatch[1].trim(),
        hot: hotMatch ? hotMatch[1].trim().toLowerCase() === 'true' : false,
        text: reviewText
      };
      
      reviews.push(review);
    }
  });
  
  return reviews;
};

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the markdown file
    fetch('/reviews.md')
      .then(response => response.text())
      .then(content => {
        const parsedReviews = parseReviews(content);
        setReviews(parsedReviews);
      })
      .catch(() => {
        // Fallback to embedded content if fetch fails
        const fallbackContent = `### The Matrix
**Type:** Film  
**Hot:** true

Whoa! This movie totally blew my mind! The special effects are absolutely revolutionary and Keanu Reeves is so cool as Neo. The whole concept of reality being a simulation is just incredible.

### Breaking Bad
**Type:** TV  
**Hot:** true

This show is absolutely mind-blowing! The character development is incredible and the story is so intense. Bryan Cranston is perfect as Walter White.

### Super Mario 64
**Type:** Game  

This game is amazing! The 3D graphics are mind-blowing and controlling Mario in 3D feels so natural. Princess Peach's castle is like the coolest hub world ever created.

### Neuromancer
**Type:** Book  

William Gibson is a genius! This cyberpunk masterpiece predicted the internet before it even existed. The writing style is so cool and futuristic.`;
        
        const parsedReviews = parseReviews(fallbackContent);
        setReviews(parsedReviews);
      });
  }, []);

  const filteredReviews = selectedType === 'all' 
    ? reviews 
    : reviews.filter(review => review.type.toLowerCase() === selectedType.toLowerCase());

  // Handle review selection and URL updates
  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setShowLightbox(true);
    const reviewSlug = review.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/review/${reviewSlug}`, { replace: true });
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedReview(null);
    navigate('/', { replace: true });
  };

  // Check URL for review parameter on load
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'review' && pathParts[2]) {
      const reviewSlug = pathParts[2];
      const foundReview = reviews.find(review => {
        const slug = review.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return slug === reviewSlug;
      });
      if (foundReview) {
        setSelectedReview(foundReview);
        setShowLightbox(true);
      }
    }
  }, [location.pathname, reviews]);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="main-title">
            🌟 Welcome to Aayush&apos;s Totally Rad Review Site! 🌟
          </h1>
          <div className="subtitle-container">
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdHRWH9pSUVhHigM71kwBMaE2QiQDQkAAA7" alt="spinning star" className="spinning-gif" />
            <div className="marquee-container">
              <div className="marquee">
                <span>Books • Games • Films • All the Cool Stuff!</span>
                <span>Books • Games • Films • All the Cool Stuff!</span>
                <span>Books • Games • Films • All the Cool Stuff!</span>
                <span>Books • Games • Films • All the Cool Stuff!</span>
                <span>Books • Games • Films • All the Cool Stuff!</span>
                <span>Books • Games • Films • All the Cool Stuff!</span>
              </div>
              
            </div>
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaIRdHRWH9pSUVhHigM71kwBMaE2QiQDQkAAA7" alt="spinning star" className="spinning-gif" />
          </div>
          <div className="90s-buttons">
            <button className="homepage-btn" onClick={() => window.open('https://aayush.fyi', '_blank')}>
              🏠 MY HOMEPAGE 🏠
            </button>
          </div>
        </header>

        <nav className="filter-nav">
          <button 
            className={selectedType === 'all' ? 'active' : ''}
            onClick={() => setSelectedType('all')}
          >
            🌈 All Reviews
          </button>
          <button 
            className={selectedType === 'film' ? 'active' : ''}
            onClick={() => setSelectedType('film')}
          >
            🎬 Films
          </button>
          <button 
            className={selectedType === 'tv' ? 'active' : ''}
            onClick={() => setSelectedType('tv')}
          >
            📺 TV Shows
          </button>
          <button 
            className={selectedType === 'game' ? 'active' : ''}
            onClick={() => setSelectedType('game')}
          >
            🎮 Games
          </button>
          <button 
            className={selectedType === 'book' ? 'active' : ''}
            onClick={() => setSelectedType('book')}
          >
            📚 Books
          </button>
        </nav>

        <main className="reviews-container">
          {filteredReviews.map((review, index) => (
            <div 
              key={index} 
              className={`review-card ${review.hot ? 'hot' : ''} clickable`}
              onClick={() => handleReviewClick(review)}
            >
              <h2 className="review-title">{review.title}</h2>
              <p className="review-text">
                {review.text}
              </p>
            </div>
          ))}
        </main>

          <footer className="footer">
            <div className="footer-content">
            <button className="webmaster-btn" onClick={() => window.open('https://aayush.fyi', '_blank')}>
              📧 CONTACT WEBMASTER 📧
            </button>
              <div className="visitor-counter">
                <img src="data:image/gif;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==" alt="counter" />

              </div>
            </div>
          </footer>
      </div>

      {/* 90s Style Lightbox */}
      {showLightbox && selectedReview && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <h2 className="lightbox-title">🌟 {selectedReview.title} 🌟</h2>
              <button className="lightbox-close" onClick={closeLightbox}>
                ✖ CLOSE ✖
              </button>
            </div>
            <div className="lightbox-body">
              <div className="lightbox-meta">
                <div className="lightbox-type">
                  <span className="highlight">{selectedReview.type}</span>
                </div>
                {selectedReview.hot && (
                  <div className="lightbox-hot">🔥 HOT! 🔥</div>
                )}
              </div>
              <div className="lightbox-text">
                {selectedReview.text}
              </div>
              <div className="lightbox-share">
                <p>🔗 Share this review:</p>
                <input 
                  type="text" 
                  value={`${window.location.origin}/review/${selectedReview.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                  readOnly 
                  className="share-url"
                />
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/review/${selectedReview.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
                    alert('URL copied to clipboard! 📋');
                  }}
                >
                  📋 COPY LINK 📋
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .app {
          background-color: #fce2e0;
          min-height: 100vh;
          font-family: 'Comic Sans MS', sans-serif;
          color: #2c3e50;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(249, 133, 133, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(249, 133, 133, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(249, 133, 133, 0.1) 0%, transparent 50%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          border: 3px dashed #F98585;
          padding: 20px;
          background: linear-gradient(45deg, #fce2e0, #fff);
          box-shadow: 5px 5px 0px #F98585;
          position: relative;
        }

        .main-title {
          font-size: 2.5rem;
          color: #F98585;
          text-shadow: 2px 2px 0px #2c3e50;
          margin: 0;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.7; }
        }

        .subtitle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }

        .subtitle {
          font-size: 1.2rem;
          margin: 0;
          font-weight: bold;
        }

        .spinning-gif {
          width: 20px;
          height: 20px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .filter-nav {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .filter-nav button {
          background: #F98585;
          color: white;
          border: 2px solid #2c3e50;
          padding: 10px 20px;
          font-family: inherit;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 0;
          box-shadow: 3px 3px 0px #2c3e50;
          transition: all 0.2s;
        }

        .filter-nav button:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px #2c3e50;
        }

        .filter-nav button.active {
          background: #2c3e50;
          color: #F98585;
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px #F98585;
        }

        .90s-buttons {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 10;
        }

        .homepage-btn, .webmaster-btn {
          background: #F98585;
          color: white;
          border: 3px solid #2c3e50;
          padding: 12px 20px;
          font-family: 'Comic Sans MS', cursive, sans-serif;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          border-radius: 0;
          box-shadow: 4px 4px 0px #2c3e50;
          text-shadow: 2px 2px 0px #2c3e50;
          position: relative;
          transition: all 0.2s ease;
          animation: blink 2s infinite;
        }

        .homepage-btn:hover, .webmaster-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #2c3e50;
          background: #2c3e50;
          color: #F98585;
        }

        .homepage-btn:active, .webmaster-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #2c3e50;
        }

        .reviews-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .review-card {
          background: white;
          border: 3px solid #F98585;
          padding: 20px;
          box-shadow: 5px 5px 0px #2c3e50;
          position: relative;
          transition: all 0.2s ease;
        }

        .review-card.clickable {
          cursor: pointer;
        }

        .review-card.clickable:hover {
          transform: translate(-3px, -3px);
          box-shadow: 8px 8px 0px #2c3e50;
          border-color: #2c3e50;
        }

        .review-link-hint {
          text-align: center;
          margin-top: 15px;
          font-size: 0.9rem;
          color: #F98585;
          font-weight: bold;
          animation: blink 2s infinite;
        }

        .review-card.hot::before {
          content: "HOT 🔥";
          position: absolute;
          top: -10px;
          right: -10px;
          background: #F98585;
          color: white;
          padding: 5px 10px;
          font-size: 0.8rem;
          font-weight: bold;
          transform: rotate(15deg);
          border: 2px solid #2c3e50;
        }

        .review-title {
          color: #2c3e50;
          font-size: 1.5rem;
          margin: 0 0 15px 0;
          text-decoration: underline;
          text-decoration-color: #F98585;
        }

        .review-type {
          background: #F98585;
          color: white;
          padding: 5px 10px;
          margin: 10px 0;
          display: inline-block;
          border: 2px solid #2c3e50;
        }

        .review-rating {
          font-size: 1.1rem;
          margin: 10px 0;
          font-weight: bold;
        }

        .rating-stars {
          color: #F98585;
          font-size: 1.2rem;
        }

        .review-text {
          line-height: 1.6;
          margin: 15px 0;
        }

        .highlight {
          background: #F98585;
          color: white;
          padding: 2px 5px;
        }

        .footer {
          text-align: center;
          border-top: 3px dashed #F98585;
          padding-top: 20px;
          margin-top: 40px;
        }

        .footer-content {
          background: #2c3e50;
          color: #fce2e0;
          padding: 15px;
          border: 3px solid #F98585;
        }

        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          margin-bottom: 10px;
        }

        .marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }

        .marquee span {
          display: inline-block;
          margin-right: 50px;
          font-weight: bold;
          font-size: 1.2rem;
          color: #F98585;
          text-shadow: 2px 2px 0px #2c3e50;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .visitor-counter {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 1.8rem;
          }
          
          .90s-buttons {
            position: static;
            margin-top: 20px;
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .filter-nav {
            flex-direction: column;
            align-items: center;
          }
          
          .reviews-container {
            grid-template-columns: 1fr;
          }
        }

        /* 90s Style Lightbox */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.3s ease-in-out;
        }

        .lightbox-content {
          background: #fce2e0;
          border: 5px solid #F98585;
          box-shadow: 
            0 0 0 5px #2c3e50,
            0 0 0 10px #F98585,
            0 15px 0 0 #2c3e50,
            0 15px 0 5px #F98585,
            0 15px 0 10px #F98585;
          max-width: 90%;
          max-height: 90%;
          overflow-y: auto;
          position: relative;
          animation: slideIn 0.3s ease-out;
        }

        .lightbox-header {
          background: #F98585;
          color: white;
          padding: 15px 20px;
          border-bottom: 3px solid #2c3e50;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lightbox-title {
          margin: 0;
          font-size: 1.5rem;
          text-shadow: 2px 2px 0px #2c3e50;
        }

        .lightbox-close {
          background: #2c3e50;
          color: #F98585;
          border: 2px solid #F98585;
          padding: 8px 15px;
          font-family: 'Comic Sans MS', cursive, sans-serif;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 3px 3px 0px #F98585;
          transition: all 0.2s ease;
        }

        .lightbox-close:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px #F98585;
        }

        .lightbox-body {
          padding: 20px;
        }

        .lightbox-meta {
          margin-bottom: 20px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .lightbox-type {
          background: #F98585;
          color: white;
          padding: 8px 15px;
          border: 2px solid #2c3e50;
          font-weight: bold;
        }

        .lightbox-hot {
          background: #2c3e50;
          color: #F98585;
          padding: 8px 15px;
          border: 2px solid #F98585;
          font-weight: bold;
          animation: blink 1s infinite;
        }

        .lightbox-text {
          line-height: 1.8;
          font-size: 1.1rem;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border: 3px solid #F98585;
          box-shadow: 3px 3px 0px #2c3e50;
        }

        .lightbox-share {
          background: #2c3e50;
          color: #fce2e0;
          padding: 20px;
          border: 3px solid #F98585;
        }

        .lightbox-share p {
          margin: 0 0 15px 0;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .share-url {
          width: 100%;
          padding: 10px;
          border: 2px solid #F98585;
          background: white;
          color: #2c3e50;
          font-family: monospace;
          margin-bottom: 15px;
          box-sizing: border-box;
        }

        .copy-btn {
          background: #F98585;
          color: white;
          border: 2px solid #2c3e50;
          padding: 10px 20px;
          font-family: 'Comic Sans MS', cursive, sans-serif;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 3px 3px 0px #2c3e50;
          transition: all 0.2s ease;
          width: 100%;
        }

        .copy-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px #2c3e50;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            transform: scale(0.8) translateY(-50px);
            opacity: 0;
          }
          to { 
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default App; 
