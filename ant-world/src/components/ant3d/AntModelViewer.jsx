import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, DepthOfField, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import AntModelGLB from './AntModelGLB';

/**
 * Photorealistic 3D Ant Viewer — cinematic macro photography quality.
 *
 * Global WebGL context limiter: max 4 simultaneous canvases.
 * Cards render one at a time, capture a snapshot, then free the slot.
 * Detail variant always gets a slot immediately.
 */

// ─── Global Canvas Slot Manager ───
const MAX_CONTEXTS = 4;
let activeCount = 0;
const waitQueue = [];

function requestSlot(callback) {
  if (activeCount < MAX_CONTEXTS) {
    activeCount++;
    callback();
  } else {
    waitQueue.push(callback);
  }
}

function releaseSlot() {
  activeCount = Math.max(0, activeCount - 1);
  if (waitQueue.length > 0 && activeCount < MAX_CONTEXTS) {
    activeCount++;
    const next = waitQueue.shift();
    next();
  }
}

export default function AntModelViewer({ speciesId, variant = 'card', accentColor = '#6cc610' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSlot, setHasSlot] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const hasSnapped = useRef(false);
  const slotHeld = useRef(false);

  const isDetail = variant === 'detail';

  const captureSnapshot = useCallback(() => {
    if (canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setSnapshot(dataUrl);
      } catch (e) {
        // WebGL context may be lost
      }
    }
  }, []);

  // IntersectionObserver — track if the element is in the viewport
  useEffect(() => {
    if (isDetail) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isDetail]);

  // Slot management — request/release canvas slots
  useEffect(() => {
    if (!isVisible) {
      // Going off-screen: capture snapshot and release slot
      if (slotHeld.current) {
        if (canvasRef.current && hasSnapped.current) {
          captureSnapshot();
        }
        releaseSlot();
        slotHeld.current = false;
        setHasSlot(false);
      }
      return;
    }

    // Already have a snapshot for card — don't need a new slot
    if (!isDetail && snapshot && hasSnapped.current) {
      return;
    }

    // Request a slot
    requestSlot(() => {
      slotHeld.current = true;
      setHasSlot(true);
    });

    return () => {
      // Cleanup on unmount
      if (slotHeld.current) {
        releaseSlot();
        slotHeld.current = false;
      }
    };
  }, [isVisible, isDetail, snapshot, captureSnapshot]);

  // For cards: capture snapshot after rendering, then release slot
  const handleCreated = useCallback(({ gl }) => {
    canvasRef.current = gl.domElement;
    if (!isDetail && !hasSnapped.current) {
      setTimeout(() => {
        captureSnapshot();
        hasSnapped.current = true;
        // Release slot after snapshot — static image takes over
        if (slotHeld.current) {
          releaseSlot();
          slotHeld.current = false;
          setHasSlot(false);
        }
      }, 1800);
    }
  }, [isDetail, captureSnapshot]);

  const showCanvas = hasSlot && (isDetail || !snapshot);
  const cameraPos = isDetail ? [0, 0.25, 1.15] : [0, 0.15, 0.95];
  const fov = isDetail ? 32 : 36;

  return (
    <div ref={containerRef} className={`ant-model-viewer ant-model-${variant}`}>
      {/* Static snapshot (cards only) */}
      {!showCanvas && snapshot && (
        <img src={snapshot} alt="3D ant preview" className="ant-model-snapshot" draggable={false} />
      )}

      {/* Live 3D Canvas */}
      {showCanvas && (
        <Canvas
          camera={{ position: cameraPos, fov }}
          dpr={[1, isDetail ? 2 : 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: isDetail ? 'high-performance' : 'default',
            preserveDrawingBuffer: true,
            toneMapping: THREE.AgXToneMapping,
            toneMappingExposure: isDetail ? 1.08 : 1.02,
          }}
          style={{ background: 'transparent' }}
          onCreated={handleCreated}
        >
          {/* Key light */}
          <directionalLight position={[2.5, 4, 3.5]} intensity={1.3} color="#fff5e0" castShadow={isDetail} />
          {/* Cool fill */}
          <directionalLight position={[-3, 2.5, -1]} intensity={0.75} color="#d8e4ff" />
          {/* Warm rim */}
          <directionalLight position={[0, 1.5, -4.5]} intensity={0.6} color="#ffe0b8" />
          {/* Top-down */}
          <directionalLight position={[0.5, 7, 0.5]} intensity={0.5} color="#ffffff" />
          {/* Side rake */}
          <directionalLight position={[5, 0.3, 0]} intensity={0.4} color="#ffeedd" />
          {/* Counter fill */}
          <directionalLight position={[-2, -1, 2]} intensity={0.2} color="#ffe8cc" />

          <ambientLight intensity={0.2} color="#ffe4cc" />
          <pointLight position={[0, -0.6, 0]} intensity={0.1} color={accentColor} distance={2.5} decay={2} />
          <pointLight position={[0.3, 0.3, 1.5]} intensity={0.08} color="#ffffff" distance={3} decay={2} />

          <Environment preset="studio" environmentIntensity={isDetail ? 0.5 : 0.45} />

          {isDetail && (
            <ContactShadows
              position={[0, -0.45, 0]}
              opacity={0.5}
              scale={2.5}
              blur={2}
              far={1.2}
              color="#1a0e00"
            />
          )}

          <Suspense fallback={null}>
            <AntModelGLB speciesId={speciesId} autoRotate variant={variant} />
          </Suspense>

          <OrbitControls
            enableZoom={isDetail}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.3}
            dampingFactor={0.1}
            enableDamping
          />

          {isDetail && (
            <EffectComposer multisampling={4}>
              <N8AO aoRadius={0.5} intensity={3.0} distanceFalloff={0.5} quality="high" halfRes />
              <Bloom intensity={0.18} luminanceThreshold={0.78} luminanceSmoothing={0.3} mipmapBlur />
              <DepthOfField focusDistance={0} focalLength={0.035} bokehScale={2} />
              <Vignette offset={0.25} darkness={0.4} blendFunction={BlendFunction.NORMAL} />
            </EffectComposer>
          )}
        </Canvas>
      )}

      {/* Loading placeholder */}
      {!showCanvas && !snapshot && (
        <div className="ant-model-placeholder">
          <div className="ant-model-loading-dot" style={{ background: accentColor }} />
        </div>
      )}
    </div>
  );
}
