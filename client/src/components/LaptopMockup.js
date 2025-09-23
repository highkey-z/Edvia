import React, { useState, useEffect, useMemo } from 'react';
import { SparklesIcon, LightbulbOutlineIcon, BookOpenIcon, TargetOutlineIcon, LightningIcon, TrendingUpIcon, BarChartIcon, SettingsIcon, LibraryIcon, ZapIcon, TargetIcon, StarIcon } from './icons';

const LaptopMockup = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('waiting');
  const [showCursor, setShowCursor] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Reset function to ensure clean state
  const resetAnimation = () => {
    setAnimationPhase('waiting');
    setInputText('');
    setOutputText('');
    setShowCursor(false);
    setShowContextMenu(false);
    setIsProcessing(false);
  };

  const sampleInputs = useMemo(() => [
    "Photosynthesis is a complex biochemical process by which green plants, algae, and certain bacteria convert light energy from the sun into chemical energy stored in glucose molecules, utilizing chlorophyll pigments and carbon dioxide from the atmosphere.",
    "The mitochondria, often referred to as the powerhouse of the cell, is a double-membraned organelle responsible for cellular respiration, energy production through ATP synthesis, and various metabolic processes essential for cellular function and survival.",
    "Climate change encompasses long-term alterations in global temperature patterns, precipitation levels, and weather phenomena, primarily attributed to anthropogenic activities such as greenhouse gas emissions, deforestation, and industrial processes that significantly impact Earth's atmospheric composition."
  ], []);

  const sampleOutputs = useMemo(() => [
    "Photosynthesis is how green plants make their food using sunlight. They use a special green substance called chlorophyll to turn sunlight into energy. They take in carbon dioxide from the air and turn it into sugar.",
    "Mitochondria are like tiny power plants inside cells. They make energy for the cell to use so it can do its jobs. They take in food and oxygen and turn it into energy that the cell needs.",
    "Climate change means the Earth's weather is getting different over many years. People are mostly causing this by the things they do, like burning fossil fuels and cutting down trees. This makes the Earth warmer and changes the weather."
  ], []);

  // Main animation cycle
  useEffect(() => {
    let isRunning = true;
    
    const animateCycle = async () => {
      if (!isRunning) return;
      
      // Phase 1: Reset and wait
      resetAnimation();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isRunning) return;

      // Phase 2: Show cursor and context menu
      setShowCursor(true);
      setCursorPosition({ x: 180, y: 140 });
      setShowContextMenu(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isRunning) return;

      // Phase 3: Paste text
      setShowContextMenu(false);
      setAnimationPhase('pasting');
      setInputText(sampleInputs[currentStep]);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!isRunning) return;

      // Phase 4: Move to button and click
      setCursorPosition({ x: 320, y: 200 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isRunning) return;

      // Phase 5: Processing
      setAnimationPhase('processing');
      setIsProcessing(true);
      setShowCursor(false);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isRunning) return;

      // Phase 6: Show results
      setOutputText(sampleOutputs[currentStep]);
      setIsProcessing(false);
      setAnimationPhase('complete');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (!isRunning) return;

      // Phase 7: Move to next step
      setCurrentStep((prev) => (prev + 1) % sampleInputs.length);
    };

    const timer = setTimeout(() => {
      animateCycle();
    }, 1000);

    return () => {
      isRunning = false;
      clearTimeout(timer);
    };
  }, [currentStep, sampleInputs, sampleOutputs]);

  return (
    <div className="laptop-mockup">
      {/* Laptop Frame */}
      <div className="laptop-frame">
        {/* Screen */}
        <div className="laptop-screen">
          <div className="screen-content">
            {/* Browser Header */}
            <div className="browser-header">
              <div className="browser-controls">
                <div className="control-dot red"></div>
                <div className="control-dot yellow"></div>
                <div className="control-dot green"></div>
              </div>
              <div className="browser-url">https://Edvia.com</div>
            </div>

            {/* App Interface */}
            <div className="mockup-app">
              {/* Main Content */}
              <div className="mockup-content">
                {/* Sidebar */}
                <div className="mockup-sidebar">
                  <div className="sidebar-section">
                    <h4 className="sidebar-title">AI Assistant</h4>
                    <div className="ai-status">
                      <div className="status-indicator online"></div>
                      <span className="status-text">Ready to help</span>
                    </div>
                    <div className="ai-suggestions">
                      <div className="suggestion-item">
                        <LightbulbOutlineIcon size={14} />
                        Try simplifying science texts
                      </div>
                      <div className="suggestion-item">
                        <BookOpenIcon size={14} />
                        Check reading levels
                      </div>
                      <div className="suggestion-item">
                        <TargetOutlineIcon size={14} />
                        Improve comprehension
                      </div>
                    </div>
                  </div>
                  
                  <div className="sidebar-section">
                    <h4 className="sidebar-title">System Status</h4>
                    <div className="status-card">
                      <div className="status-item">
                        <div className="status-indicator online"></div>
                        <div className="status-content">
                          <div className="status-label">AI Engine</div>
                          <div className="status-value">Online</div>
                        </div>
                      </div>
                      <div className="status-item">
                        <div className="status-indicator online"></div>
                        <div className="status-content">
                          <div className="status-label">Processing</div>
                          <div className="status-value">Ready</div>
                        </div>
                      </div>
                      <div className="status-item">
                        <div className="status-indicator warning"></div>
                        <div className="status-content">
                          <div className="status-label">Storage</div>
                          <div className="status-value">85% Full</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-section">
                    <h4 className="sidebar-title">Recent Activity</h4>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-dot success"></div>
                        <div className="activity-content">
                          <div className="activity-text">Text simplified</div>
                          <div className="activity-time">2 min ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-dot info"></div>
                        <div className="activity-content">
                          <div className="activity-text">Level adjusted</div>
                          <div className="activity-time">5 min ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-dot warning"></div>
                        <div className="activity-content">
                          <div className="activity-text">Complex text detected</div>
                          <div className="activity-time">10 min ago</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-section">
                    <h4 className="sidebar-title">Quick Stats</h4>
                    <div className="quick-stats">
                      <div className="stat-item">
                        <div className="stat-number">47</div>
                        <div className="stat-label">Texts Today</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">12</div>
                        <div className="stat-label">Levels Used</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Accuracy</div>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-section">
                    <h4 className="sidebar-title">Progress</h4>
                    <div className="progress-section">
                      <div className="progress-item">
                        <div className="progress-label">Daily Goal</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '75%' }}></div>
                        </div>
                        <div className="progress-text">75% Complete</div>
                      </div>
                      <div className="progress-item">
                        <div className="progress-label">Weekly Target</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '60%' }}></div>
                        </div>
                        <div className="progress-text">60% Complete</div>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-section">
                    <h4 className="sidebar-title">Notifications</h4>
                    <div className="notification-list">
                      <div className="notification-item">
                        <div className="notification-icon success">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.93"></path><polyline points="22 4 12 14 9 11"></polyline></svg>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">New update available!</div>
                          <div className="notification-time">2 hours ago</div>
                        </div>
                      </div>
                      <div className="notification-item">
                        <div className="notification-icon info">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">Daily report generated.</div>
                          <div className="notification-time">Yesterday</div>
                        </div>
                      </div>
                      <div className="notification-item">
                        <div className="notification-icon warning">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">Storage almost full!</div>
                          <div className="notification-time">3 days ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Work Area */}
                <div className="mockup-main">
                  {/* Left Column - Text Processing */}
                  <div className="mockup-column">
                    {/* Single Text Box with Transition */}
                    <div className="mockup-section">
                      <h3 className="mockup-title">
                        {animationPhase === 'complete' ? 'Simplified Text' : 'Simplify Your Text'}
                      </h3>
                      <div className="mockup-text-container">
                        {isProcessing ? (
                          <div className="processing">
                            <div className="processing-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span>Simplifying...</span>
                          </div>
                        ) : animationPhase === 'complete' ? (
                          <div className="output-text fade-in-text">
                            {outputText}
                          </div>
                        ) : (
                          <textarea
                            className="mockup-textarea"
                            value={inputText}
                            readOnly
                            placeholder="Type your complex text here..."
                            rows={4}
                          />
                        )}
                        {animationPhase !== 'complete' && (
                          <button className={`mockup-button ${animationPhase === 'processing' ? 'clicked' : ''}`}>
                            <SparklesIcon size={14} />
                            <span>Simplify</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reading Level Analysis */}
                    <div className="reading-level-card">
                      <div className="level-header">
                        <h4 className="level-title">Reading Level Analysis</h4>
                        <span className="level-badge">Beta</span>
                      </div>
                      <div className="level-indicator">
                        <div className="level-bar">
                          <div className="level-fill" style={{ width: '70%' }}></div>
                        </div>
                        <div className="level-details">
                          <span className="level-original">Original: Grade 10</span>
                          <span className="level-simplified">Simplified: Grade 6</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Analytics & Stats */}
                  <div className="mockup-column">
                    {/* Performance Metrics */}
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-icon">
                          <BarChartIcon size={16} />
                        </div>
                        <div className="metric-content">
                          <div className="metric-value">98%</div>
                          <div className="metric-label">Accuracy</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">
                          <ZapIcon size={16} />
                        </div>
                        <div className="metric-content">
                          <div className="metric-value">1.2s</div>
                          <div className="metric-label">Speed</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">
                          <TargetIcon size={16} />
                        </div>
                        <div className="metric-content">
                          <div className="metric-value">60%</div>
                          <div className="metric-label">Reduction</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">
                          <StarIcon size={16} />
                        </div>
                        <div className="metric-content">
                          <div className="metric-value">4.9</div>
                          <div className="metric-label">Rating</div>
                        </div>
                      </div>
                    </div>

                    {/* Text Statistics */}
                    <div className="text-stats">
                      <h4 className="stats-title">Text Statistics</h4>
                      <div className="stats-grid">
                        <div className="stat-row">
                          <span className="stat-label">Word Count:</span>
                          <span className="stat-value">150</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Sentence Length:</span>
                          <span className="stat-value">15.2</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Complex Words:</span>
                          <span className="stat-value">25%</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Reading Time:</span>
                          <span className="stat-value">1 min</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                      <button className="action-btn primary">
                        <span className="action-icon">
                          <BarChartIcon size={16} />
                        </span>
                        <span className="action-text">Analytics</span>
                      </button>
                      <button className="action-btn secondary">
                        <span className="action-icon">
                          <SettingsIcon size={16} />
                        </span>
                        <span className="action-text">Settings</span>
                      </button>
                      <button className="action-btn secondary">
                        <span className="action-icon">
                          <LibraryIcon size={16} />
                        </span>
                        <span className="action-text">Library</span>
                      </button>
                    </div>

                    {/* Recent Files */}
                    <div className="recent-files">
                      <h4 className="files-title">Recent Files</h4>
                      <div className="file-list">
                        <div className="file-item">
                          <div className="file-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>
                          </div>
                          <div className="file-info">
                            <div className="file-name">Science_Text_1.txt</div>
                            <div className="file-time">2 hours ago</div>
                          </div>
                        </div>
                        <div className="file-item">
                          <div className="file-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>
                          </div>
                          <div className="file-info">
                            <div className="file-name">History_Notes.txt</div>
                            <div className="file-time">1 day ago</div>
                          </div>
                        </div>
                        <div className="file-item">
                          <div className="file-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>
                          </div>
                          <div className="file-info">
                            <div className="file-name">Math_Problems.txt</div>
                            <div className="file-time">3 days ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Cursor */}
            {showCursor && (
              <div 
                className="animated-cursor"
                style={{
                  left: cursorPosition.x,
                  top: cursorPosition.y
                }}
              >
                <div className="cursor-pointer">
                  <div className="cursor-arrow"></div>
                </div>
              </div>
            )}

            {/* Context Menu */}
            {showContextMenu && (
              <div 
                className="context-menu"
                style={{
                  left: cursorPosition.x + 10,
                  top: cursorPosition.y + 10
                }}
              >
                <div className="context-item">Copy</div>
                <div className="context-item paste">Paste</div>
                <div className="context-item">Cut</div>
              </div>
            )}
          </div>
        </div>

        {/* Base */}
        <div className="laptop-base"></div>
      </div>

      {/* Glow Effect */}
      <div className="laptop-glow"></div>
    </div>
  );
};

export default LaptopMockup;