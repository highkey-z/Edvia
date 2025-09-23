import React from 'react';
import LaptopMockup from './LaptopMockup';
import { SparklesIcon, SettingsIcon, TargetIcon, BookIcon } from './icons';

const Home = ({ onNavigate }) => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Edvia
              </h1>
              <h2 className="hero-subtitle">
                A smart, engaging platform for mastering reading comprehension.
              </h2>
              <div className="hero-actions">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="btn btn-primary btn-lg"
                >
                  <span className="flex items-center space-x-2">
                    <SparklesIcon size={16} />
                    <span>Start Simplifying Text</span>
                  </span>
                </button>
              </div>
            </div>
            
            <div className="hero-visual">
              <LaptopMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Why use Edvia?</h2>
            <p className="features-subtitle">
              Transform complex text into student-friendly content with AI-powered simplification
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <SettingsIcon size={32} />
              </div>
              <h3 className="feature-title">Smart AI Technology</h3>
              <p className="feature-description">
                Advanced AI algorithms analyze text complexity and automatically simplify content while preserving meaning and educational value.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <SparklesIcon size={32} />
              </div>
              <h3 className="feature-title">Instant Results</h3>
              <p className="feature-description">
                Get simplified text in seconds. Our lightning-fast processing transforms complex academic content into student-friendly language.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <TargetIcon size={32} />
              </div>
              <h3 className="feature-title">Reading Level Control</h3>
              <p className="feature-description">
                Choose from multiple reading levels to match your students' abilities. From elementary to high school, we've got you covered.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BookIcon size={32} />
              </div>
              <h3 className="feature-title">Educational Focus</h3>
              <p className="feature-description">
                Designed specifically for educators and students. Maintain academic integrity while making content accessible to all learners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;