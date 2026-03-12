import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TabNav.css';

const tabs = [
  { id: 'origin', label: 'Origin', icon: '🪨' },
  { id: 'species', label: 'Species', icon: '🐜' },
  { id: 'colonies', label: 'Colonies', icon: '🏗️' },
];

export default function TabNav({ activeTab, onTabChange }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`tab-nav ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.2 }}
    >
      <div className="tab-nav-inner">
        <div className="tab-nav-brand">
          <span className="brand-icon">🐜</span>
          <span className="brand-text">FORMICIDAE</span>
        </div>

        <div className="tab-nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="tab-indicator"
                  layoutId="tab-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="tab-nav-right">
          <div className="pheromone-hint">
            <span className="hint-dot" />
            Click & drag for pheromones
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
