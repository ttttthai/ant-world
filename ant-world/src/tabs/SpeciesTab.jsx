import { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { species } from '../data/ants';
import AntModelViewer from '../components/ant3d/AntModelViewer';
import './SpeciesTab.css';

const subfamilies = ['All', ...new Set(species.map((s) => s.subfamily))];

function TraitBar({ label, value, color }) {
  return (
    <div className="trait-bar">
      <span className="trait-label">{label}</span>
      <div className="trait-track">
        <motion.div
          className="trait-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: color }}
        />
      </div>
      <span className="trait-value">{value}</span>
    </div>
  );
}

// Readable short labels for trait keys
const traitLabels = {
  strength: 'STR',
  speed: 'SPE',
  intelligence: 'INT',
  aggression: 'AGG',
  social: 'SOC',
  warStrategy: 'WAR',
};

function SpeciesCard({ sp, isSelected, onClick, index }) {
  const dragRef = useRef({ x: 0, y: 0, dragged: false });

  const handleMouseDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, dragged: false };
  };

  const handleMouseUp = (e) => {
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 5) {
      dragRef.current.dragged = true;
    }
  };

  const handleClick = () => {
    if (!dragRef.current.dragged) onClick();
  };

  return (
    <motion.div
      className={`species-card ${isSelected ? 'selected' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -8 }}
      layout
    >
      <div className="species-card-accent" style={{ background: sp.color }} />
      <div className="species-card-img">
        <img src={sp.imageUrl} alt={sp.name} loading="lazy" draggable={false} />
      </div>
      <div className="species-card-body">
        <div className="species-card-top">
          <span className="species-card-superpower">{sp.superpower}</span>
          <span className="species-card-size">{sp.size}</span>
        </div>
        <h3 className="species-card-name">{sp.name}</h3>
        <p className="species-card-sci">{sp.scientificName}</p>
        <div className="species-card-traits-mini">
          {Object.entries(sp.traits).map(([key, val]) => (
            <div key={key} className="mini-trait">
              <div className="mini-trait-bar">
                <div className="mini-trait-fill" style={{ width: `${val}%`, background: sp.color }} />
              </div>
              <span className="mini-trait-label">{traitLabels[key] || key.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div className="species-card-footer">
          <span className="species-card-subfamily">{sp.subfamily}</span>
          <span className="species-card-arrow">→</span>
        </div>
      </div>
    </motion.div>
  );
}

// Map qualitative text values to a 0-100 gauge rating
const ratingKeywords = {
  // Very low
  'none': 10, 'minimal': 10, 'very low': 12, 'negligible': 8,
  // Low
  'low': 20, 'minor': 22, 'weak': 18, 'poor': 15, 'basic': 25, 'simple': 22, 'limited': 20,
  // Moderate
  'moderate': 45, 'medium': 50, 'average': 48, 'fair': 42,
  // Good
  'good': 65, 'strong': 70, 'high': 72, 'complex': 68, 'effective': 65,
  // Very good
  'very strong': 82, 'very good': 82, 'very high': 85, 'very complex': 85,
  'advanced': 82, 'sophisticated': 80, 'elaborate': 78,
  // Excellent
  'excellent': 90, 'exceptional': 95, 'extreme': 95, 'major': 80,
  'outstanding': 92, 'superior': 88, 'remarkable': 88,
  // Specialist terms
  'specialist': 70, 'generalist': 55,
};

function inferRating(value) {
  if (value == null) return null;
  const v = String(value).toLowerCase();

  // Direct keyword match (check longer phrases first)
  const sortedKeys = Object.keys(ratingKeywords).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (v === key || v.startsWith(key + ' ') || v.startsWith(key + ',') || v.startsWith(key + ';')) {
      return ratingKeywords[key];
    }
  }
  // Partial keyword match anywhere in text
  for (const key of sortedKeys) {
    if (v.includes(key)) return ratingKeywords[key];
  }

  // Numeric patterns like "50x", "3,000-5,000/day"
  const numMatch = v.match(/^(\d[\d,]*)/);
  if (numMatch) {
    const num = parseInt(numMatch[1].replace(/,/g, ''));
    // Carrying capacity like "50x" → high
    if (v.includes('x')) return Math.min(95, 30 + num);
    // Colony size
    if (num > 1000000) return 95;
    if (num > 100000) return 80;
    if (num > 10000) return 65;
    if (num > 1000) return 50;
    if (num > 100) return 35;
    return 25;
  }

  // Size patterns: larger = higher
  if (v.includes('mm')) {
    const sizeMatch = v.match(/(\d+)-?(\d+)?mm/);
    if (sizeMatch) {
      const maxSize = parseInt(sizeMatch[2] || sizeMatch[1]);
      return Math.min(95, 20 + maxSize * 3);
    }
  }

  // Default for descriptive text — show a mid-range bar
  return 55;
}

function AttributeGaugeRow({ label, value, color }) {
  const rating = inferRating(value);
  const displayValue = String(value);
  // Truncate long values for display alongside bar
  const shortValue = displayValue.length > 50 ? displayValue.slice(0, 47) + '…' : displayValue;

  return (
    <div className="attr-gauge-row">
      <div className="attr-gauge-header">
        <span className="attr-gauge-label">{label}</span>
        <span className="attr-gauge-value">{shortValue}</span>
      </div>
      <div className="attr-gauge-track">
        <motion.div
          className="attr-gauge-fill"
          initial={{ width: 0 }}
          animate={{ width: `${rating}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
        <div className="attr-gauge-markers">
          {[25, 50, 75].map(p => (
            <div key={p} className="attr-gauge-marker" style={{ left: `${p}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AttributeSection({ title, icon, rows, color }) {
  return (
    <div className="attr-section">
      <div className="attr-section-header">
        <span className="attr-section-icon">{icon}</span>
        <h5 className="attr-section-title">{title}</h5>
        <div className="attr-section-line" style={{ background: color }} />
      </div>
      <div className="attr-section-rows">
        {rows.filter(([, v]) => v != null).map(([label, value]) => (
          <AttributeGaugeRow key={label} label={label} value={value} color={color} />
        ))}
      </div>
    </div>
  );
}

function SpeciesDetail({ sp, onClose }) {
  const [activeSection, setActiveSection] = useState(0);
  const traitColors = {
    strength: '#c17a23',
    speed: '#5aad0a',
    intelligence: '#6b8cce',
    aggression: '#b22222',
    social: '#daa520',
    warStrategy: '#8b0000',
  };

  const sections = [
    {
      title: 'Identification', icon: '🔬', color: '#6b8cce',
      rows: [
        ['Species', sp.scientificName],
        ['Genus', sp.genus],
        ['Subfamily', sp.subfamily],
        ['Distribution', sp.distribution],
        ['Primary Habitat', sp.primaryHabitat],
      ]
    },
    {
      title: 'Physical', icon: '📏', color: '#c17a23',
      rows: [
        ['Body Length', sp.size],
        ['Worker Weight', sp.workerWeight],
        ['Morphology', sp.morphology],
        ['Mandible Type', sp.mandibleType],
        ['Exoskeleton', sp.exoskeletonStrength],
      ]
    },
    {
      title: 'Performance', icon: '💪', color: '#5aad0a',
      rows: [
        ['Carrying Capacity', sp.carryingCapacity],
        ['Bite Force', sp.biteForce],
        ['Running Speed', sp.runningSpeed],
        ['Climbing Ability', sp.climbingAbility],
        ['Cooperative Transport', sp.cooperativeTransport],
      ]
    },
    {
      title: 'Reproduction', icon: '🥚', color: '#daa520',
      rows: [
        ['Worker Lifespan', sp.lifespan],
        ['Egg-Laying Rate', sp.eggLayingRate],
        ['Colony Growth', sp.colonyGrowthSpeed],
        ['Mating Behavior', sp.matingBehavior],
      ]
    },
    {
      title: 'Colony', icon: '🏗️', color: '#8b6cce',
      rows: [
        ['Colony Size', sp.colonySize],
        ['Queen Type', sp.queenType],
        ['Division of Labor', sp.divisionOfLabor],
        ['Worker Castes', sp.workerCastes],
        ['Nest Complexity', sp.nestComplexity],
      ]
    },
    {
      title: 'Intelligence', icon: '🧠', color: '#6b8cce',
      rows: [
        ['Communication', sp.communicationMethod],
        ['Decision Making', sp.collectiveDecisionMaking],
        ['Foraging Strategy', sp.foragingStrategy],
        ['Navigation', sp.navigationAbility],
        ['Task Specialization', sp.taskSpecialization],
      ]
    },
    {
      title: 'Survival', icon: '🛡️', color: '#5aad0a',
      rows: [
        ['Temperature Tolerance', sp.temperatureTolerance],
        ['Flood Survival', sp.floodSurvival],
        ['Food Adaptability', sp.foodAdaptability],
        ['Predator Resistance', sp.predatorResistance],
        ['Colony Hygiene', sp.colonyHygiene],
      ]
    },
    {
      title: 'Defense', icon: '⚔️', color: '#b22222',
      rows: [
        ['Defense Mechanism', sp.defenseMechanism],
        ['Raid Behavior', sp.raidBehavior],
        ['Territorial', sp.territorialBehavior],
      ]
    },
    {
      title: 'Ecology', icon: '🌿', color: '#2d8a4e',
      rows: [
        ['Diet Type', sp.diet],
        ['Soil Engineering', sp.soilEngineering],
        ['Seed Dispersal', sp.seedDispersal],
        ['Symbiotic Relationships', sp.symbioticRelationships],
        ['Invasive Potential', sp.invasivePotential],
      ]
    },
    {
      title: 'Behavior', icon: '⭐', color: '#daa520',
      rows: [
        ['Farming Ability', sp.farmingAbility],
        ['Engineering', sp.engineeringAbility],
        ['Problem Solving', sp.collectiveProblemSolving],
        ['War Strategy', sp.warStrategy],
        ['Disaster Survival', sp.disasterSurvival],
      ]
    },
  ];

  return (
    <motion.div
      className="species-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="species-detail"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="detail-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="detail-3d-viewer">
          <AntModelViewer speciesId={sp.id} variant="detail" accentColor={sp.color} />
        </div>

        <div className="detail-header">
          <div className="detail-color-bar" style={{ background: sp.color }} />
          <div className="detail-title-area">
            <span className="section-label">{sp.superpower}</span>
            <h2 className="detail-name">{sp.name}</h2>
            <p className="detail-sci">{sp.scientificName}</p>
          </div>
        </div>

        {/* Description & Fun Fact */}
        <div className="detail-intro">
          <div className="detail-description">{sp.description}</div>
          <div className="detail-funfact">
            <span className="funfact-label">Did you know?</span>
            <p>{sp.funFact}</p>
          </div>
        </div>

        {/* Trait Profile Bars */}
        <div className="detail-traits-section">
          <h4 className="traits-title">Trait Profile</h4>
          <div className="traits-grid">
            {Object.entries(sp.traits).map(([key, value]) => (
              <TraitBar key={key} label={key} value={value} color={traitColors[key]} />
            ))}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="detail-section-tabs">
          {sections.map((sec, i) => (
            <button
              key={sec.title}
              className={`section-tab ${activeSection === i ? 'active' : ''}`}
              onClick={() => setActiveSection(i)}
              style={activeSection === i ? { borderColor: sec.color, color: sec.color } : undefined}
            >
              <span className="section-tab-icon">{sec.icon}</span>
              <span className="section-tab-label">{sec.title}</span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="detail-active-section"
          >
            <AttributeSection {...sections[activeSection]} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function CompareView({ speciesA, speciesB }) {
  const traitLabels = ['strength', 'speed', 'intelligence', 'aggression', 'social'];

  return (
    <motion.div
      className="compare-view glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="compare-header">
        <div className="compare-species">
          <div className="compare-color" style={{ background: speciesA.color }} />
          <h4>{speciesA.name}</h4>
        </div>
        <span className="compare-vs">VS</span>
        <div className="compare-species">
          <div className="compare-color" style={{ background: speciesB.color }} />
          <h4>{speciesB.name}</h4>
        </div>
      </div>
      <div className="compare-bars">
        {traitLabels.map((trait) => (
          <div className="compare-bar-row" key={trait}>
            <div className="compare-bar-left">
              <motion.div
                className="compare-fill left"
                initial={{ width: 0 }}
                animate={{ width: `${speciesA.traits[trait]}%` }}
                transition={{ duration: 0.6 }}
                style={{ background: speciesA.color }}
              />
            </div>
            <span className="compare-trait-label">{trait}</span>
            <div className="compare-bar-right">
              <motion.div
                className="compare-fill right"
                initial={{ width: 0 }}
                animate={{ width: `${speciesB.traits[trait]}%` }}
                transition={{ duration: 0.6 }}
                style={{ background: speciesB.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SpeciesTab() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [filter, setFilter] = useState('All');

  const filteredSpecies = useMemo(() => {
    if (filter === 'All') return species;
    return species.filter((s) => s.subfamily === filter);
  }, [filter]);

  const handleCardClick = (sp) => {
    if (compareMode) {
      setCompareList((prev) => {
        if (prev.find((s) => s.id === sp.id)) return prev.filter((s) => s.id !== sp.id);
        if (prev.length >= 2) return [prev[1], sp];
        return [...prev, sp];
      });
    } else {
      setSelectedSpecies(sp);
    }
  };

  return (
    <div className="species-tab">
      <motion.div
        className="species-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="section-label">Discover</span>
        <h1 className="species-title">
          Species <span className="title-accent">Gallery</span>
        </h1>
        <p className="species-subtitle">
          Explore the incredible diversity of ants. Each species has evolved unique
          adaptations for survival.
        </p>

        <div className="species-controls">
          <div className="filter-pills">
            {subfamilies.map((sf) => (
              <button
                key={sf}
                className={`filter-pill ${filter === sf ? 'active' : ''}`}
                onClick={() => setFilter(sf)}
              >
                {sf}
              </button>
            ))}
          </div>
          <button
            className={`compare-toggle ${compareMode ? 'active' : ''}`}
            onClick={() => { setCompareMode(!compareMode); setCompareList([]); }}
          >
            {compareMode ? '✕ Exit Compare' : '⚖ Compare'}
          </button>
        </div>
      </motion.div>

      {compareMode && compareList.length === 2 && (
        <CompareView speciesA={compareList[0]} speciesB={compareList[1]} />
      )}

      {compareMode && compareList.length < 2 && (
        <motion.p className="compare-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Select {2 - compareList.length} more species to compare
        </motion.p>
      )}

      <div className="species-grid">
        <AnimatePresence mode="popLayout">
          {filteredSpecies.map((sp, index) => (
            <SpeciesCard
              key={sp.id}
              sp={sp}
              index={index}
              isSelected={compareMode && compareList.find((s) => s.id === sp.id)}
              onClick={() => handleCardClick(sp)}
            />
          ))}
        </AnimatePresence>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedSpecies && !compareMode && (
            <SpeciesDetail sp={selectedSpecies} onClose={() => setSelectedSpecies(null)} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
