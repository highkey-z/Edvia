import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [backgroundClass, setBackgroundClass] = useState('bg-1');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Background rotation effect - 5 seconds per image
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundClass(prev => {
        switch(prev) {
          case 'bg-1': return 'bg-2';
          case 'bg-2': return 'bg-3';
          case 'bg-3': return 'bg-4';
          case 'bg-4': return 'bg-1';
          default: return 'bg-1';
        }
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div className={`main-content ${backgroundClass}`}>
        <div className="bg-layer-1"></div>
        <div className="bg-layer-2"></div>
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'dashboard' && <Dashboard />}
      </div>
    </div>
  );
}

export default App;