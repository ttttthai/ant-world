import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSpeciesConfig } from './speciesConfig';

/**
 * Hyper-detailed procedural 3D ant model with:
 * - Dense setae (hair-like spines) on all body segments
 * - Sharp chitin ridges and segment plates
 * - Compound eye facets with specular highlights
 * - Tibial spurs, tarsal claws, femoral ridges
 * - Serrated mandible edges with sharp tips
 * - Procedural bump texture for chitin surface
 * - Anatomical details: spiracles, metapleural gland, propodeal spines
 */

/* Shared geometries */
const sphereGeo = new THREE.SphereGeometry(1, 32, 24);
const hiResSphereGeo = new THREE.SphereGeometry(1, 48, 36);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
const taperGeo = new THREE.CylinderGeometry(0.6, 1, 1, 12);
const coneGeo = new THREE.ConeGeometry(1, 1, 12);
const planeGeo = new THREE.PlaneGeometry(1, 1);
const torusGeo = new THREE.TorusGeometry(1, 0.15, 8, 24);
const spineGeo = new THREE.ConeGeometry(1, 1, 4);
const flatSpineGeo = new THREE.ConeGeometry(1, 1, 3); // triangular for flat setae

/* ─── Procedural Chitin Bump Map ─── */
function createChitinBumpMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    // Multi-scale noise for realistic chitin surface
    const fine = (Math.sin(x * 2.5 + y * 0.3) * Math.cos(y * 2.2 - x * 0.5)) * 30;
    const medium = Math.sin(x * 0.8) * Math.cos(y * 0.6) * 20;
    const coarse = Math.sin(x * 0.15 + y * 0.2) * 15;
    const grain = (Math.random() - 0.5) * 25;
    // Pit marks (small dark spots)
    const pit = (Math.sin(x * 5.3) * Math.sin(y * 4.7) > 0.85) ? -40 : 0;
    const v = 128 + fine + medium + coarse + grain + pit;
    const clamped = Math.max(0, Math.min(255, v));
    imageData.data[i * 4] = clamped;
    imageData.data[i * 4 + 1] = clamped;
    imageData.data[i * 4 + 2] = clamped;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

// Create a roughness variation map
function createRoughnessMap() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const v = 100 + Math.sin(x * 0.5 + y * 0.3) * 30 + (Math.random() - 0.5) * 40;
    const clamped = Math.max(0, Math.min(255, v));
    imageData.data[i * 4] = clamped;
    imageData.data[i * 4 + 1] = clamped;
    imageData.data[i * 4 + 2] = clamped;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

const chitinBumpMap = createChitinBumpMap();
const chitinRoughnessMap = createRoughnessMap();

/* ─── Dense Setae (hair-like spines) ─── */
// Much higher density than before
const headSpines = Array.from({ length: 16 }, (_, i) => {
  const theta = (i / 16) * Math.PI * 2;
  const phi = 0.2 + Math.random() * 0.7;
  return {
    pos: [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)],
    rot: [phi - Math.PI / 2, theta, 0],
    len: 0.01 + Math.random() * 0.008,
    thick: 0.2 + Math.random() * 0.15,
  };
});

const thoraxSpines = Array.from({ length: 22 }, (_, i) => {
  const theta = (i / 22) * Math.PI * 2;
  const phi = 0.15 + Math.random() * 0.85;
  return {
    pos: [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)],
    rot: [phi - Math.PI / 2, theta, 0],
    len: 0.008 + Math.random() * 0.01,
    thick: 0.18 + Math.random() * 0.12,
  };
});

const abdomenSpines = Array.from({ length: 24 }, (_, i) => {
  const theta = (i / 24) * Math.PI * 2;
  const phi = 0.1 + Math.random() * 0.9;
  return {
    pos: [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)],
    rot: [phi - Math.PI / 2, theta, 0],
    len: 0.007 + Math.random() * 0.009,
    thick: 0.15 + Math.random() * 0.1,
  };
});

function Setae({ spines, scaleX, scaleY, scaleZ, matProps }) {
  return (
    <>
      {spines.map((s, i) => (
        <mesh
          key={i}
          geometry={i % 3 === 0 ? flatSpineGeo : spineGeo}
          position={[s.pos[0] * scaleX * 0.97, s.pos[1] * scaleY * 0.97, s.pos[2] * scaleZ * 0.97]}
          rotation={s.rot}
          scale={[s.len * s.thick, s.len, s.len * s.thick]}
        >
          <meshPhysicalMaterial
            color={matProps.color}
            roughness={0.6}
            metalness={0.05}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─── Chitin Ridge Ring ─── */
function ChitinRidge({ position, radius, matProps }) {
  return (
    <mesh geometry={torusGeo} position={position} rotation={[Math.PI / 2, 0, 0]} scale={[radius, radius, radius * 0.6]}>
      <meshPhysicalMaterial
        {...matProps}
        metalness={Math.max(matProps.metalness || 0, 0.2)}
        clearcoat={1.0}
        clearcoatRoughness={0.03}
        bumpMap={chitinBumpMap}
        bumpScale={0.003}
      />
    </mesh>
  );
}

/* ─── Compound Eye (faceted hemisphere) ─── */
function CompoundEye({ position, scale, eyeMat }) {
  // More facets for realism
  const facets = useMemo(() => {
    const f = [];
    for (let ring = 0; ring < 3; ring++) {
      const count = ring === 0 ? 1 : ring === 1 ? 6 : 10;
      const r = ring * 0.35;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + ring * 0.3;
        f.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
          z: 0.7 + (1 - ring * 0.15) * 0.15,
          s: 0.22 - ring * 0.04,
        });
      }
    }
    return f;
  }, []);

  return (
    <group position={position}>
      {/* Main eye sphere */}
      <mesh geometry={hiResSphereGeo} scale={scale}>
        <meshPhysicalMaterial {...eyeMat} />
      </mesh>
      {/* Facet bumps */}
      {facets.map((f, i) => (
        <mesh
          key={i}
          geometry={sphereGeo}
          position={[f.x * scale[0], f.y * scale[1], f.z * scale[2]]}
          scale={[scale[0] * f.s, scale[1] * f.s, scale[2] * f.s * 0.6]}
        >
          <meshPhysicalMaterial
            {...eyeMat}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Single Leg (femur + tibia with spur + tarsus with claw) ─── */
function Leg({ side, pairIndex, length, thickness, matProps }) {
  const xSign = side === 'left' ? -1 : 1;
  const zOffset = (pairIndex - 1) * 0.18;
  const hipAngle = 0.6 + pairIndex * 0.15;
  const kneeAngle = -0.8;

  return (
    <group position={[xSign * 0.12, -0.04, zOffset]}>
      {/* Coxa (hip joint) */}
      <mesh geometry={sphereGeo} position={[0, 0, 0]} scale={[thickness * 1.3, thickness * 1.1, thickness * 1.3]}>
        <meshPhysicalMaterial {...matProps} bumpMap={chitinBumpMap} bumpScale={0.002} />
      </mesh>

      <group rotation={[0, 0, xSign * hipAngle]}>
        {/* Femur */}
        <mesh
          geometry={cylinderGeo}
          position={[0, -length * 0.3, 0]}
          scale={[thickness, length * 0.5, thickness]}
        >
          <meshPhysicalMaterial {...matProps} bumpMap={chitinBumpMap} bumpScale={0.002} />
        </mesh>
        {/* Femoral ridge */}
        <mesh geometry={torusGeo} position={[0, -length * 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness * 1.2, thickness * 1.2, thickness * 0.5]}>
          <meshPhysicalMaterial {...matProps} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>
        {/* Femur-tibia joint */}
        <mesh geometry={torusGeo} position={[0, -length * 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness * 1.4, thickness * 1.4, thickness * 0.8]}>
          <meshPhysicalMaterial {...matProps} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Tibia */}
        <group position={[0, -length * 0.55, 0]} rotation={[0, 0, xSign * kneeAngle]}>
          <mesh
            geometry={cylinderGeo}
            position={[0, -length * 0.3, 0]}
            scale={[thickness * 0.7, length * 0.55, thickness * 0.7]}
          >
            <meshPhysicalMaterial {...matProps} bumpMap={chitinBumpMap} bumpScale={0.002} />
          </mesh>
          {/* Tibial spur — sharp spine */}
          <mesh
            geometry={spineGeo}
            position={[xSign * thickness * 0.6, -length * 0.12, 0]}
            rotation={[0, 0, xSign * -0.5]}
            scale={[thickness * 0.35, length * 0.14, thickness * 0.35]}
          >
            <meshPhysicalMaterial {...matProps} metalness={0.25} clearcoat={1.0} clearcoatRoughness={0.02} />
          </mesh>
          {/* Second tibial spur (opposite side) */}
          <mesh
            geometry={spineGeo}
            position={[-xSign * thickness * 0.4, -length * 0.18, 0]}
            rotation={[0, 0, -xSign * -0.4]}
            scale={[thickness * 0.25, length * 0.1, thickness * 0.25]}
          >
            <meshPhysicalMaterial {...matProps} metalness={0.25} clearcoat={1.0} />
          </mesh>
          {/* Tibia setae (hairs along tibia) */}
          {[0.15, 0.25, 0.35, 0.45].map((t, j) => (
            <mesh key={j} geometry={spineGeo}
              position={[thickness * 0.5 * (j % 2 ? 1 : -1), -length * t, thickness * 0.3 * (j % 2 ? 1 : -1)]}
              rotation={[(j % 2 ? 0.4 : -0.4), 0, (j % 2 ? 0.3 : -0.3)]}
              scale={[thickness * 0.12, length * 0.05, thickness * 0.12]}
            >
              <meshPhysicalMaterial color={matProps.color} roughness={0.6} />
            </mesh>
          ))}

          {/* Tarsus with segments */}
          <group position={[0, -length * 0.55, 0]} rotation={[0, 0, xSign * 0.4]}>
            {/* Tarsomere 1 */}
            <mesh geometry={taperGeo} position={[0, -length * 0.06, 0]} scale={[thickness * 0.45, length * 0.1, thickness * 0.45]}>
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            {/* Tarsomere 2 */}
            <mesh geometry={taperGeo} position={[0, -length * 0.12, 0]} scale={[thickness * 0.35, length * 0.08, thickness * 0.35]}>
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            {/* Pretarsus with claws */}
            <group position={[0, -length * 0.17, 0]}>
              {/* Claw 1 */}
              <mesh geometry={spineGeo} position={[thickness * 0.15, -length * 0.03, 0]} rotation={[0.3, 0, xSign * 0.3]} scale={[thickness * 0.15, length * 0.06, thickness * 0.12]}>
                <meshPhysicalMaterial {...matProps} metalness={0.3} clearcoat={1.0} clearcoatRoughness={0.02} />
              </mesh>
              {/* Claw 2 */}
              <mesh geometry={spineGeo} position={[-thickness * 0.15, -length * 0.03, 0]} rotation={[0.3, 0, -xSign * 0.3]} scale={[thickness * 0.15, length * 0.06, thickness * 0.12]}>
                <meshPhysicalMaterial {...matProps} metalness={0.3} clearcoat={1.0} clearcoatRoughness={0.02} />
              </mesh>
              {/* Arolium (pad between claws) */}
              <mesh geometry={sphereGeo} position={[0, -length * 0.025, 0]} scale={[thickness * 0.2, thickness * 0.12, thickness * 0.15]}>
                <meshPhysicalMaterial color={matProps.color} roughness={0.7} transparent opacity={0.6} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ─── Antenna (segmented with sensory hairs) ─── */
function Antenna({ side, length, matProps }) {
  const xSign = side === 'left' ? -1 : 1;
  const thickness = 0.012;

  return (
    <group position={[xSign * 0.06, 0.08, 0.12]} rotation={[0.3, xSign * 0.3, xSign * 0.4]}>
      {/* Scape */}
      <mesh geometry={cylinderGeo} position={[0, length * 0.2, 0]} scale={[thickness, length * 0.35, thickness]}>
        <meshPhysicalMaterial {...matProps} bumpMap={chitinBumpMap} bumpScale={0.001} />
      </mesh>
      {/* Scape-pedicel joint */}
      <mesh geometry={torusGeo} position={[0, length * 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness * 1.5, thickness * 1.5, thickness]}>
        <meshPhysicalMaterial {...matProps} clearcoat={1.0} />
      </mesh>
      {/* Pedicel */}
      <group position={[0, length * 0.38, 0]} rotation={[0.4, 0, xSign * 0.25]}>
        <mesh geometry={cylinderGeo} position={[0, length * 0.18, 0]} scale={[thickness * 0.85, length * 0.3, thickness * 0.85]}>
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Funiculus — multi-segmented tip */}
        <group position={[0, length * 0.32, 0]} rotation={[0.3, 0, xSign * 0.15]}>
          {/* Segment rings on funiculus */}
          {[0, 0.25, 0.5, 0.72].map((t, i) => (
            <mesh key={i} geometry={torusGeo}
              position={[0, length * t * 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}
              scale={[thickness * (0.7 - i * 0.08), thickness * (0.7 - i * 0.08), thickness * 0.3]}>
              <meshPhysicalMaterial {...matProps} clearcoat={0.8} />
            </mesh>
          ))}
          <mesh geometry={taperGeo} position={[0, length * 0.15, 0]} scale={[thickness * 0.65, length * 0.28, thickness * 0.65]}>
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Sensory hairs — denser */}
          {Array.from({ length: 8 }, (_, j) => {
            const angle = (j / 8) * Math.PI * 2;
            const t = 0.08 + (j / 8) * 0.2;
            return (
              <mesh key={j} geometry={spineGeo}
                position={[Math.cos(angle) * thickness * 0.45, length * t, Math.sin(angle) * thickness * 0.45]}
                rotation={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
                scale={[thickness * 0.1, length * 0.035, thickness * 0.1]}>
                <meshPhysicalMaterial color={matProps.color} roughness={0.5} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
}

/* ─── Mandible with serrated inner edge ─── */
function Mandible({ side, length, angle, thickness, matProps, hooked }) {
  const xSign = side === 'left' ? -1 : 1;
  const mandMat = {
    ...matProps,
    metalness: Math.max(matProps.metalness || 0, 0.3),
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  };

  const toothCount = Math.max(4, Math.floor(length * 14));

  return (
    <group position={[xSign * 0.05, -0.04, 0.12]} rotation={[0.2, xSign * angle, 0]}>
      {/* Main mandible body — slightly curved */}
      <mesh
        geometry={hooked ? taperGeo : cylinderGeo}
        position={[0, 0, length * 0.5]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[thickness, length, thickness * 0.8]}
      >
        <meshPhysicalMaterial {...mandMat} bumpMap={chitinBumpMap} bumpScale={0.002} />
      </mesh>
      {/* Dorsal ridge along mandible */}
      <mesh
        geometry={cylinderGeo}
        position={[0, thickness * 0.3, length * 0.45]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[thickness * 0.3, length * 0.7, thickness * 0.15]}
      >
        <meshPhysicalMaterial {...mandMat} />
      </mesh>
      {/* Serrated teeth on inner edge */}
      {Array.from({ length: toothCount }, (_, i) => {
        const t = (i + 1) / (toothCount + 1);
        const toothSize = 1 - t * 0.4; // bigger at base
        return (
          <mesh key={i} geometry={spineGeo}
            position={[xSign * thickness * 0.5, 0, length * t]}
            rotation={[0, xSign * -0.3, 0]}
            scale={[thickness * 0.3 * toothSize, thickness * 0.7 * toothSize, thickness * 0.2 * toothSize]}>
            <meshPhysicalMaterial {...mandMat} />
          </mesh>
        );
      })}
      {/* Sharp tip — more pronounced */}
      <mesh geometry={coneGeo}
        position={[0, 0, length * 0.98]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[thickness * 0.45, length * 0.15, thickness * 0.35]}>
        <meshPhysicalMaterial {...mandMat} metalness={0.35} />
      </mesh>
    </group>
  );
}

/* ─── Spiracle (breathing pore) ─── */
function Spiracle({ position }) {
  return (
    <group position={position}>
      <mesh geometry={sphereGeo} scale={[0.008, 0.006, 0.004]}>
        <meshPhysicalMaterial color="#1a0e04" roughness={0.8} metalness={0} />
      </mesh>
      {/* Rim */}
      <mesh geometry={torusGeo} rotation={[0, Math.PI / 2, 0]} scale={[0.007, 0.007, 0.005]}>
        <meshPhysicalMaterial color="#2a1a0a" roughness={0.5} metalness={0.15} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Main Ant Model ─── */
export default function AntModel({ speciesId, autoRotate = true }) {
  const groupRef = useRef();
  const config = useMemo(() => getSpeciesConfig(speciesId), [speciesId]);

  // Chitin exoskeleton material with bump texture
  const bodyMat = useMemo(() => ({
    color: config.bodyColor,
    roughness: config.roughness,
    metalness: config.metalness,
    emissive: config.bodyColor,
    emissiveIntensity: config.emissiveIntensity,
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
    sheen: config.sheen,
    sheenRoughness: config.sheenRoughness,
    sheenColor: config.sheenColor,
    ior: config.ior,
    envMapIntensity: 1.2,
    bumpMap: chitinBumpMap,
    bumpScale: 0.004,
    roughnessMap: chitinRoughnessMap,
  }), [config]);

  const legMat = useMemo(() => ({
    ...bodyMat,
    color: config.legColor,
    emissive: config.legColor,
    bumpScale: 0.002,
  }), [bodyMat, config.legColor]);

  const translucentMat = useMemo(() => ({
    color: config.bodyColor,
    roughness: config.roughness,
    metalness: config.metalness,
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
    transmission: config.transmission,
    thickness: config.thickness,
    ior: config.ior,
    transparent: true,
    opacity: 0.85,
    envMapIntensity: 1.0,
    bumpMap: chitinBumpMap,
    bumpScale: 0.003,
  }), [config]);

  const eyeMat = useMemo(() => ({
    color: config.eyeColor,
    roughness: 0.08,
    metalness: 0.6,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.6,
  }), [config.eyeColor]);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const hasStinger = config.extras.includes('stinger');
  const hasLeaf = config.extras.includes('leaf');
  const hasTranslucentBody = config.extras.includes('translucent-body');
  const hasHookedMandibles = config.extras.includes('hooked-mandibles');

  const mainMat = hasTranslucentBody ? translucentMat : bodyMat;

  const hs = config.headScale;
  const ts = config.thoraxScale;
  const as = config.abdomenScale;

  return (
    <group ref={groupRef} scale={config.overallScale} position={[0, -0.15, 0]}>
      {/* ─── Head ─── */}
      <group position={[0, 0.05, 0.28]}>
        <mesh geometry={hiResSphereGeo} scale={[0.14 * hs[0], 0.13 * hs[1], 0.14 * hs[2]]}>
          <meshPhysicalMaterial {...mainMat} />
        </mesh>
        {/* Head setae */}
        <Setae spines={headSpines} scaleX={0.14 * hs[0]} scaleY={0.13 * hs[1]} scaleZ={0.14 * hs[2]} matProps={mainMat} />

        {/* Compound Eyes — detailed facets */}
        <CompoundEye position={[0.08, 0.03, 0.06]} scale={[0.038, 0.032, 0.032]} eyeMat={eyeMat} />
        <CompoundEye position={[-0.08, 0.03, 0.06]} scale={[0.038, 0.032, 0.032]} eyeMat={eyeMat} />

        {/* Clypeus (frontal plate) — with texture */}
        <mesh geometry={sphereGeo} position={[0, -0.02, 0.13]} scale={[0.08 * hs[0], 0.03, 0.04]}>
          <meshPhysicalMaterial {...mainMat} metalness={(mainMat.metalness || 0) + 0.12} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Frons (forehead plate) */}
        <mesh geometry={sphereGeo} position={[0, 0.06, 0.11]} scale={[0.06 * hs[0], 0.025, 0.03]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={0.9} />
        </mesh>

        {/* Vertex ridges (top of head) */}
        <mesh geometry={torusGeo} position={[0, 0.1 * hs[1], 0.03]} rotation={[0.6, 0, 0]} scale={[0.06 * hs[0], 0.003, 0.08 * hs[2]]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.02} />
        </mesh>

        {/* Mandibles */}
        <Mandible side="left" length={config.mandibleLength} angle={config.mandibleAngle} thickness={config.mandibleThickness} matProps={legMat} hooked={hasHookedMandibles} />
        <Mandible side="right" length={config.mandibleLength} angle={config.mandibleAngle} thickness={config.mandibleThickness} matProps={legMat} hooked={hasHookedMandibles} />

        {/* Antennae */}
        <Antenna side="left" length={config.antennaLength} matProps={legMat} />
        <Antenna side="right" length={config.antennaLength} matProps={legMat} />

        {/* Leaf accessory (Leafcutter) */}
        {hasLeaf && (
          <group position={[0, 0.12, 0.18]} rotation={[0.3, 0.2, 0.5]}>
            <mesh geometry={planeGeo} scale={[0.18, 0.14, 1]}>
              <meshPhysicalMaterial
                color="#3a7020"
                roughness={0.65}
                clearcoat={0.4}
                clearcoatRoughness={0.35}
                transmission={0.15}
                thickness={0.5}
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Leaf vein */}
            <mesh geometry={cylinderGeo} position={[0, 0, 0.001]} rotation={[0, 0, 0]} scale={[0.003, 0.12, 0.001]}>
              <meshBasicMaterial color="#2a5515" />
            </mesh>
          </group>
        )}
      </group>

      {/* ─── Head-Neck Ridge ─── */}
      <ChitinRidge position={[0, 0.02, 0.22]} radius={0.06} matProps={mainMat} />

      {/* ─── Neck (procoxa) ─── */}
      <mesh geometry={cylinderGeo} position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} scale={[0.05, 0.08, 0.05]}>
        <meshPhysicalMaterial {...mainMat} />
      </mesh>

      {/* ─── Neck-Thorax Ridge ─── */}
      <ChitinRidge position={[0, 0.01, 0.12]} radius={0.065} matProps={mainMat} />

      {/* ─── Thorax (Mesosoma) ─── */}
      <group position={[0, 0.02, 0]}>
        <mesh geometry={hiResSphereGeo} scale={[0.13 * ts[0], 0.11 * ts[1], 0.16 * ts[2]]}>
          <meshPhysicalMaterial {...mainMat} />
        </mesh>
        {/* Thorax setae */}
        <Setae spines={thoraxSpines} scaleX={0.13 * ts[0]} scaleY={0.11 * ts[1]} scaleZ={0.16 * ts[2]} matProps={mainMat} />

        {/* Pronotum (front dorsal plate) */}
        <mesh geometry={sphereGeo} position={[0, 0.11 * ts[1] * 0.9, 0.08]} scale={[0.1 * ts[0], 0.015, 0.06]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Mesonotum (middle dorsal plate) */}
        <mesh geometry={sphereGeo} position={[0, 0.11 * ts[1] * 0.85, -0.02]} scale={[0.08 * ts[0], 0.012, 0.05]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Pronotum ridge */}
        <mesh geometry={torusGeo} position={[0, 0.11 * ts[1] * 0.85, 0.05]} rotation={[0.3, 0, 0]} scale={[0.1 * ts[0], 0.003, 0.12 * ts[2]]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Spiracles on thorax sides */}
        <Spiracle position={[0.13 * ts[0] * 0.9, 0, 0.05]} />
        <Spiracle position={[-0.13 * ts[0] * 0.9, 0, 0.05]} />
        <Spiracle position={[0.13 * ts[0] * 0.85, 0, -0.05]} />
        <Spiracle position={[-0.13 * ts[0] * 0.85, 0, -0.05]} />

        {/* Metapleural gland opening (unique to ants) */}
        <mesh geometry={sphereGeo} position={[0.12 * ts[0], -0.04, -0.08]} scale={[0.012, 0.008, 0.008]}>
          <meshPhysicalMaterial color="#2a1508" roughness={0.3} metalness={0.2} clearcoat={0.8} />
        </mesh>
        <mesh geometry={sphereGeo} position={[-0.12 * ts[0], -0.04, -0.08]} scale={[0.012, 0.008, 0.008]}>
          <meshPhysicalMaterial color="#2a1508" roughness={0.3} metalness={0.2} clearcoat={0.8} />
        </mesh>

        {/* All 6 legs */}
        {[0, 1, 2].map(pair => (
          <Leg key={`l-${pair}`} side="left" pairIndex={pair} length={config.legLength} thickness={config.legThickness} matProps={legMat} />
        ))}
        {[0, 1, 2].map(pair => (
          <Leg key={`r-${pair}`} side="right" pairIndex={pair} length={config.legLength} thickness={config.legThickness} matProps={legMat} />
        ))}
      </group>

      {/* ─── Thorax-Petiole Ridge ─── */}
      <ChitinRidge position={[0, -0.005, -0.14]} radius={0.04} matProps={mainMat} />

      {/* ─── Petiole (waist node) ─── */}
      <mesh geometry={sphereGeo} position={[0, -0.01, -0.18]} scale={[0.04, 0.04, 0.04]}>
        <meshPhysicalMaterial {...mainMat} />
      </mesh>
      {/* Petiole dorsal spine */}
      <mesh geometry={spineGeo} position={[0, 0.035, -0.18]} scale={[0.009, 0.028, 0.009]}>
        <meshPhysicalMaterial {...mainMat} clearcoat={1.0} metalness={(mainMat.metalness || 0) + 0.15} />
      </mesh>
      {/* Subpetiolar process */}
      <mesh geometry={sphereGeo} position={[0, -0.035, -0.18]} scale={[0.02, 0.015, 0.02]}>
        <meshPhysicalMaterial {...mainMat} />
      </mesh>

      {/* ─── Petiole-Abdomen Ridge ─── */}
      <ChitinRidge position={[0, -0.015, -0.24]} radius={0.055} matProps={mainMat} />

      {/* ─── Abdomen (Gaster) ─── */}
      <group position={[0, -0.02, -0.35]}>
        <mesh geometry={hiResSphereGeo} scale={[0.16 * as[0], 0.14 * as[1], 0.2 * as[2]]}>
          <meshPhysicalMaterial {...mainMat} />
        </mesh>
        {/* Abdomen setae */}
        <Setae spines={abdomenSpines} scaleX={0.16 * as[0]} scaleY={0.14 * as[1]} scaleZ={0.2 * as[2]} matProps={mainMat} />

        {/* Tergite segment plates — more defined */}
        {[0.25, 0.42, 0.58, 0.74].map((t, i) => (
          <group key={i}>
            {/* Ridge line */}
            <mesh geometry={torusGeo} position={[0, 0, -0.2 * as[2] * (t * 2 - 1)]} rotation={[Math.PI / 2, 0, 0]}
              scale={[0.155 * as[0] * (1 - t * 0.25), 0.004, 0.135 * as[1] * (1 - t * 0.25)]}>
              <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
            </mesh>
            {/* Slight plate overlap bump */}
            <mesh geometry={sphereGeo} position={[0, 0.01, -0.2 * as[2] * (t * 2 - 1)]}
              scale={[0.15 * as[0] * (1 - t * 0.22), 0.005, 0.02]}>
              <meshPhysicalMaterial {...mainMat} clearcoat={0.9} />
            </mesh>
          </group>
        ))}

        {/* Spiracles on abdomen sides */}
        <Spiracle position={[0.15 * as[0], 0, 0.05]} />
        <Spiracle position={[-0.15 * as[0], 0, 0.05]} />
        <Spiracle position={[0.14 * as[0], 0, -0.06]} />
        <Spiracle position={[-0.14 * as[0], 0, -0.06]} />

        {/* Pygidium (terminal plate) */}
        <mesh geometry={sphereGeo} position={[0, -0.005, -0.19 * as[2]]} scale={[0.065 * as[0], 0.045 * as[1], 0.025]}>
          <meshPhysicalMaterial {...mainMat} metalness={(mainMat.metalness || 0) + 0.12} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Ventral sternites (belly plates) */}
        {[0.3, 0.5, 0.7].map((t, i) => (
          <mesh key={`stern-${i}`} geometry={sphereGeo}
            position={[0, -0.13 * as[1] * 0.85, -0.2 * as[2] * (t * 2 - 1)]}
            scale={[0.1 * as[0] * (1 - t * 0.2), 0.004, 0.025]}>
            <meshPhysicalMaterial {...mainMat} clearcoat={0.8} />
          </mesh>
        ))}

        {/* Stinger */}
        {hasStinger && (
          <group position={[0, -0.02, -0.18]}>
            <mesh geometry={coneGeo} rotation={[Math.PI / 2, 0, 0]} scale={[0.022, 0.09, 0.022]}>
              <meshPhysicalMaterial
                color={config.legColor}
                roughness={0.15}
                metalness={0.35}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
                bumpMap={chitinBumpMap}
                bumpScale={0.001}
              />
            </mesh>
            {/* Stinger barbs */}
            {[0.02, 0.04, 0.055].map((d, i) => (
              <mesh key={i} geometry={spineGeo}
                position={[0.008 * (i % 2 ? 1 : -1), 0, -d]}
                rotation={[0.4, 0, (i % 2 ? 0.3 : -0.3)]}
                scale={[0.004, 0.013 - i * 0.002, 0.004]}>
                <meshPhysicalMaterial color={config.legColor} roughness={0.15} metalness={0.35} clearcoat={1.0} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}
