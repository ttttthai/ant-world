import { useState, useRef, useMemo, useEffect, Suspense, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useIsPresent } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { timelineEvents } from '../data/ants';
import { illustrations } from '../components/TimelineIllustrations';
import './OriginTab.css';

const TOTAL_DISTANCE = 560;

// Reverse events: journey starts at "Today" and travels back to 168 MYA
const journeyEvents = [...timelineEvents].reverse().map((event, i) => ({
  ...event,
  originalIndex: timelineEvents.length - 1 - i,
}));

const NODE_SPACING = TOTAL_DISTANCE / (journeyEvents.length - 1);
const ACTIVE_THRESHOLD = NODE_SPACING * 0.35;

// Milestone positions along the journey
const milestonePositions = journeyEvents.map((_, i) => ({
  x: Math.sin(i * 0.7 + 1) * 3,
  y: 1.5 + Math.cos(i * 0.9 + 0.5) * 1.5,
  z: i * NODE_SPACING,
}));

/* ─── Space Camera ─── */

function SpaceCamera({ scrollProgress }) {
  const { camera } = useThree();
  const prevZ = useRef(0);

  useFrame(() => {
    const targetZ = scrollProgress.current * TOTAL_DISTANCE;
    const diff = Math.abs(targetZ - camera.position.z);
    // Faster lerp for large jumps (e.g. dot nav clicks), smooth for normal scrolling
    const lerpFactor = diff > 50 ? 0.06 : 0.12;
    const currentZ = THREE.MathUtils.lerp(camera.position.z, targetZ, lerpFactor);
    camera.position.z = currentZ;
    camera.position.x = Math.sin(currentZ * 0.008) * 1.2;
    camera.position.y = 2 + Math.cos(currentZ * 0.005) * 0.8;
    camera.lookAt(
      Math.sin(currentZ * 0.008 + 0.5) * 0.5,
      1.8,
      currentZ + 15
    );
    prevZ.current = currentZ;
  });

  return null;
}

/* ─── Starfield ─── */

function Starfield({ scrollProgress }) {
  const pointsRef = useRef();
  const { positions, sizes, count } = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Mix of close and far stars
      const radius = 3 + Math.random() * 30;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = Math.random() * (TOTAL_DISTANCE + 200) - 50;
      sizes[i] = 0.2 + Math.random() * 1.2;
    }
    return { positions, sizes, count };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#f0e6d4"
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Cosmic Dust Clouds ─── */

function CosmicDust() {
  const clouds = useMemo(() => [
    { pos: [12, 6, 60], color: '#5aad0a', scale: 10, opacity: 0.025 },
    { pos: [-14, -4, 150], color: '#c17a23', scale: 12, opacity: 0.02 },
    { pos: [10, 8, 260], color: '#6495ed', scale: 9, opacity: 0.02 },
    { pos: [-12, 5, 350], color: '#5aad0a', scale: 11, opacity: 0.025 },
    { pos: [14, -5, 440], color: '#c17a23', scale: 13, opacity: 0.02 },
    { pos: [-9, 7, 520], color: '#6cc610', scale: 8, opacity: 0.025 },
  ], []);

  return (
    <>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.pos}>
          <sphereGeometry args={[cloud.scale, 16, 16]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─── Milestone Node ─── */

function MilestoneNode({ event, position, index, scrollProgress }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();
  const lightRef = useRef();

  // Use original timeline index for visual styling
  const oi = event.originalIndex;
  const isExtinct = oi === 3;
  const isKPg = oi === 5;
  const isRadiation = oi === 6;

  const baseColor = isExtinct ? '#8b4a2a' : isKPg ? '#e05530' : isRadiation ? '#6cc610' : (oi < 5 ? '#c19a6b' : '#6cc610');
  const baseRadius = isRadiation ? 0.5 : isKPg ? 0.45 : (oi === 0 || oi === 13 ? 0.45 : 0.3);

  useFrame((state) => {
    if (!meshRef.current) return;

    const cameraZ = state.camera.position.z;
    const dist = Math.abs(cameraZ - position[2]);
    const proximity = Math.max(0, 1 - dist / (NODE_SPACING * 0.8));

    // Scale up when camera is near
    const scale = 1 + proximity * 0.4;
    meshRef.current.scale.setScalar(scale);
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

    // Glow intensity based on proximity
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scale * (1.6 + Math.sin(state.clock.elapsedTime * 2) * 0.15));
      glowRef.current.material.opacity = 0.05 + proximity * 0.2;
    }

    // Ring pulse
    if (ringRef.current) {
      ringRef.current.scale.setScalar(scale * (2.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3));
      ringRef.current.material.opacity = 0.04 + proximity * 0.1;
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }

    // Point light intensity based on proximity
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + proximity * 2;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[baseRadius * 2.5, 16, 16]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.05} />
      </mesh>

      {/* Orbit ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[baseRadius * 3, 0.015, 8, 64]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.04} />
      </mesh>

      {/* Main orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[baseRadius, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.2}
          metalness={0.5}
          emissive={baseColor}
          emissiveIntensity={0.4}
          transparent
          opacity={isExtinct ? 0.6 : 0.95}
        />
      </mesh>

      {/* Small point light to illuminate nearby space */}
      <pointLight ref={lightRef} color={baseColor} intensity={0.5} distance={8} decay={2} />
    </group>
  );
}

/* ─── Space Scene ─── */

function SpaceScene({ scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 50]} intensity={0.4} />

      <Starfield scrollProgress={scrollProgress} />
      <CosmicDust />

      {journeyEvents.map((event, i) => (
        <MilestoneNode
          key={i}
          event={event}
          position={[milestonePositions[i].x, milestonePositions[i].y, milestonePositions[i].z]}
          index={i}
          scrollProgress={scrollProgress}
        />
      ))}

      <SpaceCamera scrollProgress={scrollProgress} />
    </>
  );
}

/* ─── Info Card Overlay ─── */

function InfoCard({ event, index }) {
  const Illustration = illustrations[event.originalIndex];
  const isExtinct = event.originalIndex === 3;

  return (
    <motion.div
      className="space-info-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {Illustration && (
        <div className="space-card-illustration">
          <Illustration />
        </div>
      )}
      <div className="space-card-content">
        <span className="space-card-era">{event.era}</span>
        <div className="space-card-year">{event.year}</div>
        <h3 className="space-card-title">{event.title}</h3>
        {isExtinct && <span className="space-card-extinct">Extinct lineage</span>}
        <p className="space-card-desc">{event.description}</p>
      </div>
    </motion.div>
  );
}

/* ─── Dot Navigation ─── */

function DotNav({ activeIndex, onNavigate }) {
  return (
    <div className="space-dot-nav">
      {journeyEvents.map((event, i) => (
        <button
          key={i}
          className={`space-dot ${i === activeIndex ? 'active' : ''}`}
          onClick={() => onNavigate(i)}
          title={event.title}
        >
          <span className="space-dot-pip" />
          {i === activeIndex && (
            <span className="space-dot-label">{event.year}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ─── Main Origin Tab ─── */

export default function OriginTab() {
  const isPresent = useIsPresent();
  const scrollContainerRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  // Update the ref for Three.js (can't use reactive state in useFrame)
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      scrollProgressRef.current = v;

      // Determine active milestone
      const nodeIndex = Math.round(v * (journeyEvents.length - 1));
      const nodeProgress = v * (journeyEvents.length - 1);
      const distToNearest = Math.abs(nodeProgress - nodeIndex);

      if (distToNearest < 0.3 && nodeIndex >= 0 && nodeIndex < journeyEvents.length) {
        setActiveIndex(nodeIndex);
      } else {
        setActiveIndex(-1);
      }
    });
    return unsub;
  }, [scrollYProgress]);

  const navigateToNode = useCallback((index) => {
    if (!scrollContainerRef.current) return;
    const totalHeight = scrollContainerRef.current.scrollHeight - window.innerHeight;
    const targetScroll = (index / (journeyEvents.length - 1)) * totalHeight;
    window.scrollTo({ top: targetScroll + scrollContainerRef.current.offsetTop, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="origin-tab-space" ref={scrollContainerRef} />

      {createPortal(
        <div className="space-viewport" style={!isPresent ? { opacity: 0, pointerEvents: 'none', transition: 'opacity 0.3s' } : undefined}>
          <Canvas
            camera={{ position: [0, 2, -10], fov: 60 }}
            style={{ background: 'transparent' }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <SpaceScene scrollProgress={scrollProgressRef} />
            </Suspense>
          </Canvas>

          {/* Scroll hint at start */}
          <AnimatePresence>
            {activeIndex <= 0 && (
              <motion.div
                className="space-scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="scroll-hint-text">Scroll to travel through time</div>
                <div className="scroll-hint-arrow">
                  <motion.span
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title overlay */}
          <div className="space-title-overlay">
            <h1 className="space-title">
              <span className="title-accent">Journey Through Time</span>
            </h1>
          </div>

          {/* Info card */}
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && activeIndex < journeyEvents.length && (
              <InfoCard
                key={activeIndex}
                event={journeyEvents[activeIndex]}
                index={activeIndex}
              />
            )}
          </AnimatePresence>

          {/* Dot navigation */}
          <DotNav activeIndex={activeIndex} onNavigate={navigateToNode} />

          {/* Era indicator */}
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && (
              <motion.div
                key={activeIndex}
                className="space-era-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {journeyEvents[activeIndex].icon} {journeyEvents[activeIndex].era}
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}
