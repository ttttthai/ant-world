import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import TabNav from './components/TabNav';
import AntCanvas from './components/AntCanvas';
import OriginTab from './tabs/OriginTab';
import SpeciesTab from './tabs/SpeciesTab';
import ColoniesTab from './tabs/ColoniesTab';
import './App.css';

const tabComponents = {
  origin: OriginTab,
  species: SpeciesTab,
  colonies: ColoniesTab,
};

const pageVariants = {
  initial: { opacity: 0, y: 30, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
};

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="loading-brand">FORMICIDAE</div>
      </motion.div>
      <div className="loading-bar-track">
        <motion.div
          className="loading-bar-fill"
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('origin');
  const [loading, setLoading] = useState(true);
  const ActiveComponent = tabComponents[activeTab];

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setActiveTab(tab);
    }
  };

  return (
    <div className="app">
      <div className="bg-layer bg-grain" />
      <div className="bg-layer bg-gradient" />

      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <AntCanvas antCount={30} />
          <ScrollProgress />
          <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

          <main className="main-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}
    </div>
  );
}
