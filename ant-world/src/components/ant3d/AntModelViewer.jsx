import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import AntModel from './AntModel';

/**
 * Photorealistic 3D Ant Viewer with studio lighting and environment reflections.
 * Uses IntersectionObserver for card variant to only mount Canvas when visible,
 * avoiding the browser's WebGL context limit (~8-16 simultaneous contexts).
 * Captures a static snapshot when going off-screen.
 */
export default function AntModelViewer({ speciesId, variant = 'card', accentColor = '#6cc610' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(variant === 'detail');
  const [snapshot, setSnapshot] = useState(null);
  const hasSnapped = useRef(false);

  const isDetail = variant === 'detail';

  // Capture a static snapshot from the canvas
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

  // IntersectionObserver to mount/unmount canvas based on visibility
  useEffect(() => {
    if (isDetail) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          if (canvasRef.current && hasSnapped.current) {
            captureSnapshot();
          }
          setIsVisible(false);
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isDetail, captureSnapshot]);

  const cameraPos = isDetail ? [0, 0.3, 1.2] : [0, 0.2, 1];
  const fov = isDetail ? 35 : 40;

  return (
    <div ref={containerRef} className={`ant-model-viewer ant-model-${variant}`}>
      {/* Static snapshot fallback when canvas is unmounted */}
      {!isVisible && snapshot && (
        <img
          src={snapshot}
          alt="3D ant preview"
          className="ant-model-snapshot"
          draggable={false}
        />
      )}

      {/* Active 3D Canvas */}
      {isVisible && (
        <Canvas
          camera={{ position: cameraPos, fov }}
          dpr={[1.5, isDetail ? 2.5 : 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: isDetail ? 'default' : 'low-power',
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
            if (!hasSnapped.current && variant === 'card') {
              setTimeout(() => {
                captureSnapshot();
                hasSnapped.current = true;
              }, 2000);
            }
          }}
        >
          {/* Enhanced Studio Lighting for surface detail */}
          {/* Key light — warm, dominant, from upper-right */}
          <directionalLight position={[3, 5, 3]} intensity={1.4} color="#fff5e6" />
          {/* Fill light — cool, softer, from left */}
          <directionalLight position={[-3, 2, -1]} intensity={0.5} color="#cce0ff" />
          {/* Rim light — warm edge light from behind */}
          <directionalLight position={[0, 2, -4]} intensity={0.7} color="#ffe8cc" />
          {/* Top-down detail light — highlights surface bumps */}
          <directionalLight position={[1, 6, 1]} intensity={0.3} color="#ffffff" />
          {/* Side rake light — reveals setae and ridges */}
          <directionalLight position={[4, 0.5, 0]} intensity={0.25} color="#fff0dd" />
          {/* Subtle ambient for shadow fill */}
          <ambientLight intensity={0.2} />
          {/* Species accent from below */}
          <pointLight position={[0, -0.5, 0]} intensity={0.15} color={accentColor} distance={2} decay={2} />

          {/* Environment for chitin reflections */}
          <Environment preset="studio" environmentIntensity={isDetail ? 0.5 : 0.35} />

          {/* Contact shadow for grounding (detail only) */}
          {isDetail && (
            <ContactShadows
              position={[0, -0.45, 0]}
              opacity={0.4}
              scale={2}
              blur={2.5}
              far={1}
              color="#1a0e00"
            />
          )}

          <Suspense fallback={null}>
            <AntModel speciesId={speciesId} autoRotate />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.6}
            dampingFactor={0.1}
            enableDamping
          />
        </Canvas>
      )}

      {/* Loading placeholder */}
      {!isVisible && !snapshot && (
        <div className="ant-model-placeholder">
          <div className="ant-model-loading-dot" style={{ background: accentColor }} />
        </div>
      )}
    </div>
  );
}
