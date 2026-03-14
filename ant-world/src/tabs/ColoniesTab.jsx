import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { colonyStructure } from '../data/ants';
import './ColoniesTab.css';

/* ═══════════════════════════════════════════════════
   Constants & Helpers
   ═══════════════════════════════════════════════════ */

function chamberPos(c) {
  return new THREE.Vector3(
    (c.x - 50) / 10,
    -(c.depth * 1.8) - 0.5,
    (c.y - 40) / 25
  );
}

function chamberScale(c) {
  return c.radius / 16;
}

function buildTunnelGraph() {
  const adj = {};
  const curves = {};

  for (const c of colonyStructure.chambers) {
    adj[c.id] = [];
  }

  for (const t of colonyStructure.tunnels) {
    const a = colonyStructure.chambers.find(c => c.id === t.from);
    const b = colonyStructure.chambers.find(c => c.id === t.to);
    if (!a || !b) continue;

    adj[t.from].push(t.to);
    adj[t.to].push(t.from);

    const start = chamberPos(a);
    const end = chamberPos(b);
    const mid = start.clone().lerp(end, 0.5);
    mid.y -= 0.4;
    mid.z = (start.z + end.z) / 2 + 0.2;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const key1 = `${t.from}→${t.to}`;
    const key2 = `${t.to}→${t.from}`;
    curves[key1] = curve;
    curves[key2] = { getPoint: (t_val) => curve.getPoint(1 - t_val) };
  }

  return { adj, curves };
}

const tunnelGraph = buildTunnelGraph();

function findPath(fromId, toId) {
  if (fromId === toId) return [fromId];
  const visited = new Set([fromId]);
  const queue = [[fromId, [fromId]]];
  while (queue.length) {
    const [node, path] = queue.shift();
    for (const neighbor of (tunnelGraph.adj[node] || [])) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      const newPath = [...path, neighbor];
      if (neighbor === toId) return newPath;
      queue.push([neighbor, newPath]);
    }
  }
  return [fromId];
}

const ROLES = {
  forager:  { chambers: ['entrance', 'food-storage'], color: '#5a3a18' },
  nurse:    { chambers: ['nursery-eggs', 'nursery-larvae', 'nursery-pupae'], color: '#6b4422' },
  worker:   { chambers: ['food-storage', 'fungus-garden'], color: '#4a2e14' },
  attendant:{ chambers: ['queen-chamber', 'nursery-larvae', 'nursery-pupae'], color: '#3e2810' },
  waste:    { chambers: ['waste', 'winter', 'queen-chamber'], color: '#382010' },
};

const ROLE_NAMES = Object.keys(ROLES);

function randomRole() {
  const weights = [12, 10, 8, 6, 4];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < ROLE_NAMES.length; i++) {
    r -= weights[i];
    if (r <= 0) return ROLE_NAMES[i];
  }
  return 'forager';
}

const _sphereGeo = new THREE.SphereGeometry(1, 20, 14);
const _tubeRadius = 0.08;

/* ═══════════════════════════════════════════════════
   Procedural Noise Texture for Soil
   ═══════════════════════════════════════════════════ */

function createSoilTexture(baseR, baseG, baseB, variation = 30) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    // Multi-octave noise simulation
    const n1 = Math.sin(x * 0.3) * Math.cos(y * 0.4) * 15;
    const n2 = Math.sin(x * 0.7 + y * 0.5) * 8;
    const n3 = (Math.random() - 0.5) * variation;
    const offset = n1 + n2 + n3;
    imageData.data[i * 4] = Math.max(0, Math.min(255, baseR + offset));
    imageData.data[i * 4 + 1] = Math.max(0, Math.min(255, baseG + offset * 0.7));
    imageData.data[i * 4 + 2] = Math.max(0, Math.min(255, baseB + offset * 0.4));
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

// Pre-create soil textures for different layers
const soilTextures = {
  topsoil: createSoilTexture(92, 61, 30, 25),
  subsoil: createSoilTexture(74, 46, 22, 20),
  deepsoil: createSoilTexture(61, 36, 16, 18),
  clay: createSoilTexture(51, 32, 14, 15),
  deepclay: createSoilTexture(42, 26, 10, 12),
};

// Bump map for rough surfaces
function createBumpMap() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let i = 0; i < size * size; i++) {
    const v = Math.random() * 180 + Math.sin(i * 0.02) * 40;
    imageData.data[i * 4] = v;
    imageData.data[i * 4 + 1] = v;
    imageData.data[i * 4 + 2] = v;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

const soilBumpMap = createBumpMap();

/* ═══════════════════════════════════════════════════
   Soil Particles, Rocks & Embedded Objects
   ═══════════════════════════════════════════════════ */

const soilParticles = Array.from({ length: 90 }, () => ({
  x: (Math.random() - 0.5) * 14,
  y: -Math.random() * 10 - 0.5,
  z: (Math.random() - 0.5) * 3 + 0.5,
  s: 0.02 + Math.random() * 0.06,
  color: ['#5a3d20', '#4a3018', '#3a2510', '#6a4a28', '#2e1e0e'][Math.floor(Math.random() * 5)],
}));

const soilRocks = Array.from({ length: 35 }, () => ({
  x: (Math.random() - 0.5) * 12,
  y: -Math.random() * 9 - 1,
  z: (Math.random() - 0.5) * 3 + 0.3,
  sx: 0.04 + Math.random() * 0.12,
  sy: 0.03 + Math.random() * 0.08,
  sz: 0.03 + Math.random() * 0.1,
  ry: Math.random() * Math.PI,
  rz: Math.random() * 0.5,
  color: ['#5c4a3a', '#4a3a2a', '#6a5a48', '#3e2e20', '#786858'][Math.floor(Math.random() * 5)],
}));

// Embedded objects in soil — fossils, pebble clusters, clay chunks
const embeddedObjects = Array.from({ length: 18 }, (_, i) => ({
  x: (Math.random() - 0.5) * 11,
  y: -1.5 - Math.random() * 8,
  z: (Math.random() - 0.5) * 2,
  type: ['pebble-cluster', 'clay-chunk', 'mineral', 'fossil'][Math.floor(Math.random() * 4)],
  scale: 0.06 + Math.random() * 0.12,
  rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.5],
}));

// Worm trail paths through soil
const wormTrails = Array.from({ length: 5 }, () => {
  const startX = (Math.random() - 0.5) * 10;
  const startY = -2 - Math.random() * 6;
  const points = [];
  let x = startX, y = startY;
  for (let j = 0; j < 8; j++) {
    x += (Math.random() - 0.5) * 0.8;
    y -= Math.random() * 0.4;
    points.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.5 + 0.3));
  }
  return points;
});

/* ═══════════════════════════════════════════════════
   Tree Roots
   ═══════════════════════════════════════════════════ */

// Pre-generate organic root paths
const treeRoots = [
  // Main root from top-left
  { points: [
    new THREE.Vector3(-4.5, 0.4, 0.8),
    new THREE.Vector3(-3.8, -0.5, 0.5),
    new THREE.Vector3(-3.2, -1.5, 0.3),
    new THREE.Vector3(-2.8, -2.8, 0.1),
    new THREE.Vector3(-2.5, -3.6, -0.2),
  ], radius: 0.12, color: '#4a3520' },
  // Branch root from first
  { points: [
    new THREE.Vector3(-3.2, -1.5, 0.3),
    new THREE.Vector3(-2.5, -1.8, 0.6),
    new THREE.Vector3(-1.8, -2.4, 0.4),
    new THREE.Vector3(-1.2, -2.8, 0.2),
  ], radius: 0.07, color: '#3d2a18' },
  // Second main root from top-right
  { points: [
    new THREE.Vector3(4.2, 0.3, 0.6),
    new THREE.Vector3(3.8, -0.8, 0.4),
    new THREE.Vector3(3.3, -1.6, 0.2),
    new THREE.Vector3(3.5, -2.5, 0.0),
    new THREE.Vector3(3.2, -3.2, -0.3),
  ], radius: 0.1, color: '#4a3520' },
  // Small branch
  { points: [
    new THREE.Vector3(3.3, -1.6, 0.2),
    new THREE.Vector3(2.8, -2.0, 0.5),
    new THREE.Vector3(2.2, -2.6, 0.3),
  ], radius: 0.05, color: '#3d2a18' },
  // Fine root tendrils
  { points: [
    new THREE.Vector3(-5.5, 0.5, 1.0),
    new THREE.Vector3(-5.2, -0.3, 0.8),
    new THREE.Vector3(-4.8, -1.0, 0.5),
    new THREE.Vector3(-4.9, -1.6, 0.2),
  ], radius: 0.04, color: '#3a2515' },
  { points: [
    new THREE.Vector3(5.0, 0.4, 0.7),
    new THREE.Vector3(4.6, -0.5, 0.9),
    new THREE.Vector3(4.8, -1.2, 0.6),
  ], radius: 0.04, color: '#3a2515' },
  // Deep thin root near center
  { points: [
    new THREE.Vector3(-1.0, 0.3, 0.5),
    new THREE.Vector3(-1.2, -0.6, 0.3),
    new THREE.Vector3(-0.8, -1.2, 0.1),
    new THREE.Vector3(-1.1, -1.8, -0.1),
  ], radius: 0.035, color: '#3d2a18' },
];

function TreeRoots() {
  return (
    <group>
      {treeRoots.map((root, i) => {
        const curve = new THREE.CatmullRomCurve3(root.points);
        const geometry = new THREE.TubeGeometry(curve, 16, root.radius, 8, false);

        return (
          <group key={`root-${i}`}>
            <mesh geometry={geometry}>
              <meshPhysicalMaterial
                color={root.color}
                roughness={0.92}
                metalness={0}
                bumpMap={soilBumpMap}
                bumpScale={0.03}
              />
            </mesh>
            {/* Root nodules — small bumps along roots for organic feel */}
            {root.points.slice(1, -1).map((pt, j) => (
              <mesh
                key={`rn-${i}-${j}`}
                position={[pt.x, pt.y, pt.z]}
              >
                <sphereGeometry args={[root.radius * 1.3, 6, 4]} />
                <meshPhysicalMaterial color={root.color} roughness={0.92} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Floating Dust Motes (animated particles)
   ═══════════════════════════════════════════════════ */

const dustData = Array.from({ length: 40 }, () => ({
  x: (Math.random() - 0.5) * 12,
  y: -Math.random() * 9,
  z: (Math.random() - 0.5) * 4 + 1,
  speed: 0.001 + Math.random() * 0.003,
  drift: Math.random() * Math.PI * 2,
  size: 0.008 + Math.random() * 0.015,
  brightness: 0.4 + Math.random() * 0.6,
}));

function DustMotes() {
  const meshesRef = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < meshesRef.current.length; i++) {
      const mesh = meshesRef.current[i];
      if (!mesh) continue;
      const d = dustData[i];
      mesh.position.x = d.x + Math.sin(t * d.speed * 100 + d.drift) * 0.3;
      mesh.position.y = d.y + Math.sin(t * d.speed * 60 + d.drift * 2) * 0.15;
      mesh.position.z = d.z + Math.cos(t * d.speed * 80 + d.drift) * 0.2;
      mesh.material.opacity = d.brightness * (0.3 + Math.sin(t * 2 + d.drift) * 0.15);
    }
  });

  return (
    <group>
      {dustData.map((d, i) => (
        <mesh
          key={`dust-${i}`}
          ref={(el) => { meshesRef.current[i] = el; }}
          position={[d.x, d.y, d.z]}
        >
          <sphereGeometry args={[d.size, 4, 3]} />
          <meshBasicMaterial
            color="#d4b896"
            transparent
            opacity={d.brightness * 0.3}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Water Droplets (moisture in deep chambers)
   ═══════════════════════════════════════════════════ */

function MoistureEffects() {
  return (
    <group>
      {/* Moisture patches on deep chamber walls — wet sheen spots */}
      {[
        [-2, -6.5, 0.6], [1.5, -7, 0.4], [-3, -8, 0.3],
        [2.5, -5.5, 0.5], [-1, -9, 0.2], [0.5, -8.5, 0.35],
        [0, -7.5, 0.45], [-1.5, -8.5, 0.3], [2, -6, 0.55],
      ].map(([x, y, z], i) => (
        <mesh key={`moist-${i}`} position={[x, y, z]} rotation={[0.1, 0, 0.2 * (i % 2 ? 1 : -1)]}>
          <planeGeometry args={[0.25 + i * 0.03, 0.12 + i * 0.015]} />
          <meshPhysicalMaterial
            color="#3a4a5a"
            transparent
            opacity={0.12}
            roughness={0.05}
            metalness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Small water puddle at bottom of deep chambers */}
      <mesh position={[0, -9.5, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 12]} />
        <meshPhysicalMaterial
          color="#2a3a4a"
          transparent
          opacity={0.2}
          roughness={0.02}
          metalness={0.8}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Light Shaft from Entrance
   ═══════════════════════════════════════════════════ */

function LightShaft() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing of the light shaft
      const t = state.clock.elapsedTime;
      meshRef.current.material.opacity = 0.06 + Math.sin(t * 0.5) * 0.015;
    }
  });

  // Cone of light from entrance going down into the colony
  const entranceChamber = colonyStructure.chambers.find(c => c.id === 'entrance');
  const ePos = entranceChamber ? chamberPos(entranceChamber) : new THREE.Vector3(0, -0.5, 0);

  return (
    <group>
      {/* Main light cone — shining down into the colony */}
      <mesh
        ref={meshRef}
        position={[ePos.x, ePos.y - 0.5, ePos.z + 0.5]}
        rotation={[0.05, 0, 0]}
      >
        <coneGeometry args={[1.2, 3, 16, 1, true]} />
        <meshBasicMaterial
          color="#fff5d0"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Secondary softer shaft */}
      <mesh
        position={[ePos.x, ePos.y - 0.2, ePos.z + 0.3]}
        rotation={[0.1, 0.05, 0]}
      >
        <coneGeometry args={[0.6, 2, 12, 1, true]} />
        <meshBasicMaterial
          color="#ffe8a0"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Spot light casting actual illumination into entrance */}
      <spotLight
        position={[ePos.x, ePos.y + 3, ePos.z + 2]}
        target-position={[ePos.x, ePos.y - 1, ePos.z]}
        intensity={0.8}
        angle={0.4}
        penumbra={0.8}
        color="#fff0d0"
        distance={8}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Underground Fog / Depth Atmosphere
   ═══════════════════════════════════════════════════ */

function UndergroundFog() {
  const fogRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    // Add exponential fog for depth — subtle so scene is still visible
    scene.fog = new THREE.FogExp2('#1a0f06', 0.018);
    return () => { scene.fog = null; };
  }, [scene]);

  return (
    <group>
      {/* Layered fog planes at different depths */}
      {[
        { y: -4, opacity: 0.025, color: '#2a1a0a' },
        { y: -6.5, opacity: 0.035, color: '#221408' },
        { y: -9, opacity: 0.05, color: '#1a0e04' },
      ].map((fog, i) => (
        <mesh key={`fog-${i}`} position={[0, fog.y, -2]} rotation={[Math.PI * 0.05, 0, 0]}>
          <planeGeometry args={[20, 2]} />
          <meshBasicMaterial
            color={fog.color}
            transparent
            opacity={fog.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Earth Layers (Background cross-section) — ENHANCED
   ═══════════════════════════════════════════════════ */

function EarthLayers() {
  const layers = [
    { y: 0.3, h: 0.6, d: 6, color: '#3a5c1e', tex: null },
    { y: -0.3, h: 0.6, d: 7, color: '#5c3d1e', tex: soilTextures.topsoil },
    { y: -1.5, h: 1.8, d: 8, color: '#4a2e16', tex: soilTextures.subsoil },
    { y: -3.5, h: 2.2, d: 8, color: '#3d2410', tex: soilTextures.deepsoil },
    { y: -5.8, h: 2.4, d: 8, color: '#33200e', tex: soilTextures.clay },
    { y: -8.2, h: 2.4, d: 7, color: '#2a1a0a', tex: soilTextures.deepclay },
    { y: -10.2, h: 1.6, d: 6, color: '#221408', tex: soilTextures.deepclay },
  ];

  return (
    <group>
      {layers.map((l, i) => (
        <mesh key={i} position={[0, l.y, -l.d * 0.5 - 1]}>
          <boxGeometry args={[18, l.h, l.d]} />
          <meshPhysicalMaterial
            color={l.color}
            roughness={0.95}
            metalness={0}
            map={l.tex}
            bumpMap={soilBumpMap}
            bumpScale={0.02}
          />
        </mesh>
      ))}

      {/* Sediment lines — horizontal strata visible in cross-section */}
      {[
        { y: -1.0, color: '#5a3a1e', w: 16 },
        { y: -2.5, color: '#4a2e14', w: 14 },
        { y: -4.2, color: '#3a2010', w: 15 },
        { y: -6.0, color: '#2e1a0c', w: 13 },
        { y: -7.5, color: '#261408', w: 14 },
        { y: -9.0, color: '#1e1006', w: 12 },
      ].map((s, i) => (
        <mesh key={`sed-${i}`} position={[0, s.y, 0.2]} rotation={[0, 0, (Math.random() - 0.5) * 0.02]}>
          <planeGeometry args={[s.w, 0.02 + Math.random() * 0.03]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Sky box above ground */}
      <mesh position={[0, 1.5, -4]}>
        <boxGeometry args={[18, 2, 8]} />
        <meshBasicMaterial color="#1a2a3a" transparent opacity={0.5} />
      </mesh>

      {/* Soil particles for texture */}
      {soilParticles.map((p, i) => (
        <mesh key={`sp-${i}`} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.s, 4, 3]} />
          <meshPhysicalMaterial color={p.color} roughness={0.95} />
        </mesh>
      ))}

      {/* Small embedded rocks */}
      {soilRocks.map((r, i) => (
        <mesh key={`sr-${i}`} position={[r.x, r.y, r.z]} rotation={[0, r.ry, r.rz]}>
          <dodecahedronGeometry args={[r.sx, 0]} />
          <meshPhysicalMaterial
            color={r.color}
            roughness={0.85}
            metalness={0.05}
            bumpMap={soilBumpMap}
            bumpScale={0.015}
          />
        </mesh>
      ))}

      {/* Embedded objects — fossils, clay chunks, minerals */}
      {embeddedObjects.map((obj, i) => {
        const s = obj.scale;
        switch (obj.type) {
          case 'pebble-cluster':
            return (
              <group key={`eo-${i}`} position={[obj.x, obj.y, obj.z]} rotation={obj.rotation}>
                {[0, 0.6, 1.2].map((a, j) => (
                  <mesh key={j} position={[Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.3, 0]}>
                    <dodecahedronGeometry args={[s * (0.5 + j * 0.15), 0]} />
                    <meshPhysicalMaterial color="#7a6a5a" roughness={0.8} metalness={0.1} />
                  </mesh>
                ))}
              </group>
            );
          case 'mineral':
            return (
              <mesh key={`eo-${i}`} position={[obj.x, obj.y, obj.z]} rotation={obj.rotation}>
                <octahedronGeometry args={[s * 0.8, 0]} />
                <meshPhysicalMaterial
                  color="#8a7a6a"
                  roughness={0.3}
                  metalness={0.4}
                  clearcoat={0.3}
                />
              </mesh>
            );
          case 'fossil':
            return (
              <mesh key={`eo-${i}`} position={[obj.x, obj.y, obj.z]} rotation={obj.rotation}>
                <torusGeometry args={[s * 0.6, s * 0.15, 6, 8, Math.PI * 1.5]} />
                <meshPhysicalMaterial color="#9a8a7a" roughness={0.6} metalness={0.15} />
              </mesh>
            );
          default: // clay-chunk
            return (
              <mesh key={`eo-${i}`} position={[obj.x, obj.y, obj.z]} rotation={obj.rotation}>
                <icosahedronGeometry args={[s * 0.7, 0]} />
                <meshPhysicalMaterial color="#6a4a30" roughness={0.95} />
              </mesh>
            );
        }
      })}

      {/* Worm trails — thin tubes winding through soil */}
      {wormTrails.map((pts, i) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, 12, 0.018, 4, false);
        return (
          <mesh key={`wt-${i}`} geometry={geo}>
            <meshPhysicalMaterial color="#3a2a1a" roughness={0.95} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Surface Details — ENHANCED
   ═══════════════════════════════════════════════════ */

const grassPositions = Array.from({ length: 50 }, (_, i) => ({
  x: (i / 50) * 16 - 8 + (Math.random() - 0.5) * 0.5,
  z: (Math.random() - 0.3) * 0.6,  // keep grass near front surface only
  h: 0.08 + Math.random() * 0.15,
  lean: (Math.random() - 0.5) * 0.3,
  shade: Math.random() * 0.15,
  width: 0.02 + Math.random() * 0.02,
}));

// Small surface debris — twigs, leaf litter
const surfaceDebris = Array.from({ length: 15 }, () => ({
  x: (Math.random() - 0.5) * 14,
  z: (Math.random() - 0.5) * 2.5,
  type: Math.random() > 0.5 ? 'twig' : 'leaf',
  rotation: Math.random() * Math.PI,
  scale: 0.05 + Math.random() * 0.1,
}));

function SurfaceDetails() {
  return (
    <group>
      {/* Grass blades — dark green, tone mapping disabled */}
      {grassPositions.map((g, i) => (
        <mesh
          key={i}
          position={[g.x, 0.6 + g.h / 2, g.z]}
          rotation={[0, 0, g.lean]}
        >
          <boxGeometry args={[g.width, g.h, 0.012]} />
          <meshBasicMaterial
            color={new THREE.Color(0.12 + g.shade * 0.08, 0.25 + g.shade * 0.1, 0.04)}
            fog={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Ant mound — more detailed with dirt texture */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.6, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#5c3a1e"
          roughness={0.95}
          bumpMap={soilBumpMap}
          bumpScale={0.04}
        />
      </mesh>
      {/* Mound entrance hole */}
      <mesh position={[0, 0.55, 0.25]} rotation={[-0.3, 0, 0]}>
        <circleGeometry args={[0.12, 12]} />
        <meshBasicMaterial color="#1a0e06" side={THREE.DoubleSide} />
      </mesh>
      {/* Mound dirt scatter with varied sizes */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const r = 0.45 + Math.random() * 0.4;
        return (
          <mesh key={`md-${i}`} position={[Math.cos(a) * r, 0.42, Math.sin(a) * r * 0.6]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.06, 5, 4]} />
            <meshPhysicalMaterial color={i % 3 === 0 ? '#6a4422' : '#5a3818'} roughness={0.92} />
          </mesh>
        );
      })}

      {/* Surface debris */}
      {surfaceDebris.map((d, i) =>
        d.type === 'twig' ? (
          <mesh key={`sd-${i}`} position={[d.x, 0.42, d.z]} rotation={[0, d.rotation, 0.1]}>
            <cylinderGeometry args={[0.006, 0.004, d.scale * 2, 4]} />
            <meshPhysicalMaterial color="#5a4030" roughness={0.9} />
          </mesh>
        ) : (
          <mesh key={`sd-${i}`} position={[d.x, 0.42, d.z]} rotation={[0.3, d.rotation, 0]}>
            <planeGeometry args={[d.scale, d.scale * 0.7]} />
            <meshPhysicalMaterial
              color="#5a6a30"
              roughness={0.8}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      )}

      {/* Small mushrooms near mound */}
      {[[-0.8, 0.3], [0.9, -0.2], [-0.5, -0.4]].map(([x, z], i) => (
        <group key={`mush-${i}`} position={[x, 0.42, z]}>
          {/* Stem */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.008, 0.01, 0.06, 6]} />
            <meshPhysicalMaterial color="#d4c8b0" roughness={0.7} />
          </mesh>
          {/* Cap */}
          <mesh position={[0, 0.065, 0]}>
            <sphereGeometry args={[0.025, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color={i === 0 ? '#aa4422' : '#886644'} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Earth Chamber — ENHANCED with rough walls
   ═══════════════════════════════════════════════════ */

const CHAMBER_COLORS = {
  entrance:       { wall: '#5c3d1e', inner: '#3a2510', glow: '#ffcc66', glowIntensity: 0.6 },
  'food-storage': { wall: '#4a3018', inner: '#2e1e0e', glow: '#d4a050', glowIntensity: 0.3 },
  'nursery-eggs': { wall: '#4a3220', inner: '#30200e', glow: '#ffe8b0', glowIntensity: 0.25 },
  'nursery-larvae':{ wall: '#4a3220', inner: '#30200e', glow: '#ffd88a', glowIntensity: 0.25 },
  'nursery-pupae':{ wall: '#4a3220', inner: '#30200e', glow: '#ffcc80', glowIntensity: 0.2 },
  'queen-chamber':{ wall: '#4a2818', inner: '#2e180a', glow: '#ffaa44', glowIntensity: 0.5 },
  'fungus-garden':{ wall: '#3a3018', inner: '#252010', glow: '#88aa55', glowIntensity: 0.3 },
  waste:          { wall: '#3a2a1a', inner: '#221810', glow: '#887766', glowIntensity: 0.15 },
  winter:         { wall: '#332218', inner: '#201410', glow: '#6688aa', glowIntensity: 0.2 },
};

// Pre-generate wall bump positions for each chamber to make them look rough/organic
const chamberBumps = {};
for (const c of colonyStructure.chambers) {
  chamberBumps[c.id] = Array.from({ length: 14 }, () => ({
    theta: Math.random() * Math.PI * 2,
    phi: Math.random() * Math.PI,
    size: 0.08 + Math.random() * 0.15,
    offset: 0.85 + Math.random() * 0.25,
  }));
}

function ChamberDecorations({ chamberId, scale }) {
  const s = scale * 0.3;
  switch (chamberId) {
    case 'food-storage':
      return (
        <group>
          {[[-0.3, -0.1, 0.05], [0.2, -0.15, 0.08], [0, -0.2, 0.03], [-0.15, 0.1, 0.06], [0.25, 0.05, 0.04], [-0.1, -0.05, 0.045], [0.15, -0.25, 0.035]].map(([x, y, sz], i) => (
            <mesh key={i} position={[x * s * 2, y * s * 2, 0.05]} scale={[sz * s * 8, sz * s * 8, sz * s * 4]}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshPhysicalMaterial color={i % 2 === 0 ? '#c48830' : '#b07828'} roughness={0.6} />
            </mesh>
          ))}
        </group>
      );
    case 'nursery-eggs':
      return (
        <group>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r = 0.1 + Math.random() * 0.22;
            return (
              <mesh key={i} position={[Math.cos(a) * r * s * 2, Math.sin(a) * r * s * 2 - s * 0.3, 0.05]} scale={[s * 0.22, s * 0.16, s * 0.13]}>
                <sphereGeometry args={[1, 6, 6]} />
                <meshPhysicalMaterial color="#f0e8d8" roughness={0.2} clearcoat={0.7} clearcoatRoughness={0.1} />
              </mesh>
            );
          })}
        </group>
      );
    case 'nursery-larvae':
      return (
        <group>
          {Array.from({ length: 9 }, (_, i) => {
            const x = (Math.random() - 0.5) * s * 2.5;
            const y = (Math.random() - 0.5) * s * 1.5 - s * 0.2;
            return (
              <mesh key={i} position={[x, y, 0.05]} rotation={[0, 0, Math.random() * Math.PI]} scale={[s * 0.35, s * 0.15, s * 0.12]}>
                <capsuleGeometry args={[0.5, 1, 4, 8]} />
                <meshPhysicalMaterial color="#ede0c8" roughness={0.35} clearcoat={0.3} />
              </mesh>
            );
          })}
        </group>
      );
    case 'nursery-pupae':
      return (
        <group>
          {Array.from({ length: 6 }, (_, i) => {
            const x = (Math.random() - 0.5) * s * 2;
            const y = (Math.random() - 0.5) * s * 1.2;
            return (
              <mesh key={i} position={[x, y, 0.05]} rotation={[0, 0, Math.random() * Math.PI * 0.5]} scale={[s * 0.2, s * 0.35, s * 0.15]}>
                <capsuleGeometry args={[0.4, 1, 4, 8]} />
                <meshPhysicalMaterial color="#d8c8a8" roughness={0.3} clearcoat={0.4} clearcoatRoughness={0.1} />
              </mesh>
            );
          })}
        </group>
      );
    case 'queen-chamber':
      return (
        <group position={[0, -s * 0.2, 0.06]}>
          <mesh position={[s * 0.5, 0, 0]} scale={[s * 0.25, s * 0.2, s * 0.12]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshPhysicalMaterial color="#3a1e08" roughness={0.25} clearcoat={0.7} />
          </mesh>
          <mesh position={[s * 0.15, 0, 0]} scale={[s * 0.3, s * 0.18, s * 0.12]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshPhysicalMaterial color="#3a1e08" roughness={0.25} clearcoat={0.7} />
          </mesh>
          <mesh position={[-s * 0.35, 0, 0]} scale={[s * 0.5, s * 0.35, s * 0.18]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshPhysicalMaterial color="#3a1e08" roughness={0.25} clearcoat={0.7} />
          </mesh>
          {/* Eggs near queen */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} position={[-s * 0.35 + (Math.random() - 0.5) * s * 0.6, -s * 0.35 + Math.random() * s * 0.1, 0.02]} scale={[s * 0.08, s * 0.06, s * 0.05]}>
              <sphereGeometry args={[1, 5, 4]} />
              <meshPhysicalMaterial color="#f0e8d8" roughness={0.2} clearcoat={0.5} />
            </mesh>
          ))}
        </group>
      );
    case 'fungus-garden':
      return (
        <group>
          {Array.from({ length: 10 }, (_, i) => {
            const x = (Math.random() - 0.5) * s * 2.5;
            const y = (Math.random() - 0.5) * s * 2;
            const sz = 0.08 + Math.random() * 0.15;
            return (
              <group key={i}>
                <mesh position={[x, y, 0.04]} scale={[s * sz * 3, s * sz * 2, s * sz * 2]}>
                  <sphereGeometry args={[1, 8, 6]} />
                  <meshPhysicalMaterial color={['#7a9050', '#6a8040', '#8aa060', '#5a7030'][i % 4]} roughness={0.7} />
                </mesh>
                {/* Tiny fungal filaments */}
                {i % 3 === 0 && (
                  <mesh position={[x, y + s * sz * 1.5, 0.04]}>
                    <cylinderGeometry args={[0.002, 0.005, s * sz * 2, 3]} />
                    <meshPhysicalMaterial color="#a0b070" roughness={0.6} transparent opacity={0.7} />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      );
    case 'waste':
      return (
        <group>
          {Array.from({ length: 8 }, (_, i) => {
            const x = (Math.random() - 0.5) * s * 2;
            const y = (Math.random() - 0.5) * s * 1.5;
            return (
              <mesh key={i} position={[x, y, 0.04]} scale={[s * 0.15, s * 0.1, s * 0.08]} rotation={[0, 0, Math.random() * Math.PI]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial color={i % 2 === 0 ? '#4a3a28' : '#3a2a1a'} roughness={0.95} />
              </mesh>
            );
          })}
        </group>
      );
    default:
      return null;
  }
}

function EarthChamber({ chamber, isHovered, isSelected, onHover, onUnhover, onClick }) {
  const glowRef = useRef();
  const pos = chamberPos(chamber);
  const s = chamberScale(chamber);
  const colors = CHAMBER_COLORS[chamber.id] || CHAMBER_COLORS.entrance;
  const bumps = chamberBumps[chamber.id] || [];

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.material.opacity =
        colors.glowIntensity * (0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2);
    }
  });

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Outer soil wall — textured spheroid */}
      <mesh
        onPointerOver={onHover}
        onPointerOut={onUnhover}
        onClick={onClick}
        scale={[s * 1.3, s, s * 1.1]}
      >
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial
          color={isHovered || isSelected ? '#6a4a28' : colors.wall}
          roughness={0.92}
          metalness={0}
          bumpMap={soilBumpMap}
          bumpScale={0.06}
        />
      </mesh>

      {/* Rough wall bumps — irregular soil protrusions around chamber */}
      {bumps.map((b, i) => {
        const bx = Math.sin(b.theta) * Math.cos(b.phi) * s * b.offset;
        const by = Math.cos(b.theta) * s * b.offset * 0.8;
        const bz = Math.sin(b.theta) * Math.sin(b.phi) * s * b.offset * 0.9;
        return (
          <mesh key={`bump-${i}`} position={[bx, by, bz]}>
            <dodecahedronGeometry args={[s * b.size, 0]} />
            <meshPhysicalMaterial
              color={colors.wall}
              roughness={0.95}
              metalness={0}
              bumpMap={soilBumpMap}
              bumpScale={0.03}
            />
          </mesh>
        );
      })}

      {/* Inner cavity (darker, backface) */}
      <mesh scale={[s * 1.15, s * 0.85, s * 0.95]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial
          color={colors.inner}
          roughness={0.95}
          metalness={0}
          side={THREE.BackSide}
          bumpMap={soilBumpMap}
          bumpScale={0.04}
        />
      </mesh>

      {/* Warm inner glow */}
      <mesh ref={glowRef} scale={[s * 0.9, s * 0.65, s * 0.7]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={colors.glowIntensity}
          depthWrite={false}
        />
      </mesh>

      {/* Point light inside */}
      <pointLight
        position={[0, 0, 0.15]}
        intensity={colors.glowIntensity * 0.6}
        distance={s * 4}
        color={colors.glow}
        decay={2}
      />

      {/* Chamber floor — slight ground plane inside cavity */}
      <mesh position={[0, -s * 0.6, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[s * 0.9, 12]} />
        <meshPhysicalMaterial
          color={colors.inner}
          roughness={0.98}
          bumpMap={soilBumpMap}
          bumpScale={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Chamber decorations */}
      <ChamberDecorations chamberId={chamber.id} scale={s} />

      {/* Label */}
      <Text
        position={[0, s + 0.2, 0.1]}
        fontSize={0.18}
        color={isHovered || isSelected ? '#ffcc66' : '#b8a080'}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.015}
        outlineColor="#1a1008"
      >
        {chamber.name}
      </Text>

      {/* Hover highlight ring */}
      {(isHovered || isSelected) && (
        <mesh scale={[s * 1.45, s * 1.1, s * 0.1]}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color="#ffcc66" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Earth Tunnel — ENHANCED with organic rough walls
   ═══════════════════════════════════════════════════ */

function EarthTunnel({ from, to }) {
  const a = colonyStructure.chambers.find(c => c.id === from);
  const b = colonyStructure.chambers.find(c => c.id === to);
  if (!a || !b) return null;

  const { mainGeo, innerGeo, bumpPositions } = useMemo(() => {
    const start = chamberPos(a);
    const end = chamberPos(b);
    const mid = start.clone().lerp(end, 0.5);
    mid.y -= 0.4;
    mid.z = -0.05;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const mainGeo = new THREE.TubeGeometry(curve, 24, _tubeRadius, 10, false);
    const innerGeo = new THREE.TubeGeometry(curve, 24, _tubeRadius * 0.75, 8, false);

    // Generate bump positions along tunnel
    const bumpPositions = [];
    for (let i = 0; i < 6; i++) {
      const t = 0.15 + (i / 6) * 0.7;
      const pt = curve.getPoint(t);
      for (let j = 0; j < 3; j++) {
        const angle = (j / 3) * Math.PI * 2 + i;
        bumpPositions.push({
          x: pt.x + Math.cos(angle) * _tubeRadius * 1.1,
          y: pt.y + Math.sin(angle) * _tubeRadius * 0.8,
          z: pt.z + Math.sin(angle + 1) * _tubeRadius * 0.5,
          size: 0.015 + Math.random() * 0.025,
        });
      }
    }

    return { mainGeo, innerGeo, bumpPositions };
  }, [a, b]);

  return (
    <group>
      {/* Outer tunnel wall */}
      <mesh geometry={mainGeo}>
        <meshPhysicalMaterial
          color="#3a2510"
          roughness={0.95}
          metalness={0}
          side={THREE.DoubleSide}
          bumpMap={soilBumpMap}
          bumpScale={0.03}
        />
      </mesh>
      {/* Inner tunnel — slightly different shade for depth */}
      <mesh geometry={innerGeo}>
        <meshPhysicalMaterial
          color="#2a1808"
          roughness={0.98}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Tunnel wall bumps for organic feel */}
      {bumpPositions.map((bp, i) => (
        <mesh key={`tb-${i}`} position={[bp.x, bp.y, bp.z]}>
          <sphereGeometry args={[bp.size, 4, 3]} />
          <meshPhysicalMaterial color="#3a2510" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Colony Ant — follows tunnel paths between chambers
   ═══════════════════════════════════════════════════ */

function ColonyAnt({ role, antIndex }) {
  const groupRef = useRef();
  const state = useRef(null);

  if (!state.current) {
    const roleDef = ROLES[role];
    const startChamber = roleDef.chambers[Math.floor(Math.random() * roleDef.chambers.length)];
    state.current = {
      role,
      currentChamber: startChamber,
      path: [],
      segmentIndex: 0,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
      pauseTimer: Math.random() * 60,
      carrying: role === 'forager' && Math.random() > 0.5,
    };
    const destIdx = Math.floor(Math.random() * roleDef.chambers.length);
    const dest = roleDef.chambers[destIdx];
    if (dest !== startChamber) {
      state.current.path = findPath(startChamber, dest);
      state.current.segmentIndex = 0;
      state.current.t = 0;
    }
  }

  useFrame(() => {
    const s = state.current;
    if (!groupRef.current) return;

    if (s.pauseTimer > 0) {
      s.pauseTimer--;
      const cData = colonyStructure.chambers.find(c => c.id === s.currentChamber);
      if (cData) {
        const cp = chamberPos(cData);
        const jitter = 0.05;
        groupRef.current.position.set(
          cp.x + (Math.sin(Date.now() * 0.002 + antIndex) * jitter),
          cp.y + (Math.cos(Date.now() * 0.003 + antIndex * 1.3) * jitter * 0.6),
          cp.z + 0.12
        );
      }
      return;
    }

    if (s.path.length < 2 || s.segmentIndex >= s.path.length - 1) {
      const roleDef = ROLES[s.role];
      const choices = roleDef.chambers.filter(c => c !== s.currentChamber);
      const dest = choices.length > 0
        ? choices[Math.floor(Math.random() * choices.length)]
        : roleDef.chambers[0];
      s.path = findPath(s.currentChamber, dest);
      s.segmentIndex = 0;
      s.t = 0;
      s.pauseTimer = 30 + Math.random() * 90;

      if (s.role === 'forager') {
        s.carrying = s.currentChamber === 'food-storage' ? false :
                     s.currentChamber === 'entrance' ? true : s.carrying;
      }
      return;
    }

    const fromId = s.path[s.segmentIndex];
    const toId = s.path[s.segmentIndex + 1];
    const curveKey = `${fromId}→${toId}`;
    const curve = tunnelGraph.curves[curveKey];

    if (curve) {
      s.t += s.speed;
      if (s.t >= 1) {
        s.t = 0;
        s.segmentIndex++;
        s.currentChamber = toId;
        if (s.segmentIndex >= s.path.length - 1) {
          s.pauseTimer = 40 + Math.random() * 100;
        }
        return;
      }

      const point = curve.getPoint(s.t);
      groupRef.current.position.set(point.x, point.y, point.z + 0.12);

      const nextPoint = curve.getPoint(Math.min(1, s.t + 0.05));
      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;
      groupRef.current.rotation.z = Math.atan2(dy, dx);
    }
  });

  const roleColor = ROLES[role]?.color || '#3a1e10';

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0.04, 0, 0]} scale={[0.03, 0.025, 0.02]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshPhysicalMaterial color={roleColor} roughness={0.25} clearcoat={0.6} />
      </mesh>
      {/* Thorax */}
      <mesh position={[0, 0, 0]} scale={[0.035, 0.02, 0.018]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshPhysicalMaterial color={roleColor} roughness={0.25} clearcoat={0.6} />
      </mesh>
      {/* Abdomen */}
      <mesh position={[-0.045, 0, 0]} scale={[0.04, 0.03, 0.022]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshPhysicalMaterial color={roleColor} roughness={0.25} clearcoat={0.6} />
      </mesh>
      {/* Legs (6 thin lines) */}
      {[-1, 0, 1].map(l => (
        <group key={l}>
          <mesh position={[l * 0.018, -0.015, 0]} rotation={[0, 0, -0.6 + l * 0.15]} scale={[0.002, 0.025, 0.002]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={roleColor} />
          </mesh>
          <mesh position={[l * 0.018, 0.015, 0]} rotation={[0, 0, 0.6 - l * 0.15]} scale={[0.002, 0.025, 0.002]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={roleColor} />
          </mesh>
        </group>
      ))}
      {/* Antennae */}
      <mesh position={[0.06, 0.01, 0]} rotation={[0, 0, 0.5]} scale={[0.0015, 0.03, 0.0015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={roleColor} />
      </mesh>
      <mesh position={[0.06, -0.01, 0]} rotation={[0, 0, -0.5]} scale={[0.0015, 0.03, 0.0015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={roleColor} />
      </mesh>
      {/* Carrying food indicator */}
      {state.current?.carrying && (
        <mesh position={[0.02, 0.035, 0]} scale={[0.018, 0.014, 0.012]}>
          <sphereGeometry args={[1, 6, 4]} />
          <meshBasicMaterial color="#d4a030" />
        </mesh>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Colony Scene — assembled 3D view — ENHANCED
   ═══════════════════════════════════════════════════ */

const ANT_COUNT = 55;
const antRoles = Array.from({ length: ANT_COUNT }, () => randomRole());

function ColonyScene({ onChamberSelect, hoveredChamber, selectedChamber, setHoveredChamber }) {
  return (
    <>
      {/* Lighting — dramatic underground */}
      <ambientLight intensity={0.15} color="#8B7355" />
      <directionalLight position={[0, 10, 6]} intensity={0.5} color="#fff5e0" />
      <directionalLight position={[-5, 3, 3]} intensity={0.15} color="#aaccff" />
      {/* Warm underground glow from below */}
      <pointLight position={[0, -6, 2]} intensity={0.25} color="#c19a6b" distance={15} decay={2} />
      {/* Deeper ambient */}
      <pointLight position={[0, -9, 1]} intensity={0.15} color="#6a4a30" distance={12} decay={2} />
      {/* Rim light from sides for depth */}
      <pointLight position={[-6, -4, 4]} intensity={0.1} color="#8090a0" distance={12} decay={2} />
      <pointLight position={[6, -4, 4]} intensity={0.1} color="#8090a0" distance={12} decay={2} />

      {/* Environment for subtle reflections */}
      <Environment preset="apartment" environmentIntensity={0.1} />

      {/* Underground fog */}
      {/* UndergroundFog removed for 360° viewing */}

      {/* Surface grass and mound (no earth wall — free orbit) */}
      <SurfaceDetails />

      {/* Floating dust motes */}
      <DustMotes />

      {/* Moisture effects in deep areas */}
      <MoistureEffects />

      {/* Tunnels (rendered as tubes) */}
      {colonyStructure.tunnels.map((tunnel, i) => (
        <EarthTunnel key={i} from={tunnel.from} to={tunnel.to} />
      ))}

      {/* Chambers */}
      {colonyStructure.chambers.map((chamber) => (
        <EarthChamber
          key={chamber.id}
          chamber={chamber}
          isHovered={hoveredChamber === chamber.id}
          isSelected={selectedChamber === chamber.id}
          onHover={() => setHoveredChamber(chamber.id)}
          onUnhover={() => setHoveredChamber(null)}
          onClick={() => onChamberSelect(chamber)}
        />
      ))}

      {/* Living colony ants */}
      {antRoles.map((role, i) => (
        <ColonyAnt key={i} role={role} antIndex={i} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={3}
        maxDistance={20}
        target={[0, -3.8, 0]}
        dampingFactor={0.1}
        enableDamping
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   Pheromone Simulation (improved visuals)
   ═══════════════════════════════════════════════════ */

function PheromoneSimulation() {
  const canvasRef = useRef(null);
  const antsRef = useRef([]);
  const foodRef = useRef([]);
  const homeRef = useRef({ x: 0, y: 0 });
  const pheromoneGridRef = useRef(null);
  const animRef = useRef();
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);

  const GRID_SIZE = 2;
  const DECAY = 0.997;
  const SIM_ANT_COUNT = 80;

  const initSimulation = useCallback((canvas) => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const cols = Math.ceil(w / GRID_SIZE);
    const rows = Math.ceil(h / GRID_SIZE);

    homeRef.current = { x: w * 0.18, y: h * 0.5 };

    foodRef.current = [
      { x: w * 0.75, y: h * 0.3, amount: 500, maxAmount: 500, color: '#88aa44' },
      { x: w * 0.82, y: h * 0.7, amount: 500, maxAmount: 500, color: '#cc8833' },
      { x: w * 0.58, y: h * 0.55, amount: 300, maxAmount: 300, color: '#77bb55' },
    ];

    pheromoneGridRef.current = {
      toFood: new Float32Array(cols * rows),
      toHome: new Float32Array(cols * rows),
      cols,
      rows,
    };

    antsRef.current = Array.from({ length: SIM_ANT_COUNT }, () => ({
      x: homeRef.current.x + (Math.random() - 0.5) * 20,
      y: homeRef.current.y + (Math.random() - 0.5) * 20,
      angle: Math.random() * Math.PI * 2,
      hasFood: false,
      speed: 1.2 + Math.random() * 0.6,
      foodColorIdx: -1,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initSimulation(canvas);
    const ctx = canvas.getContext('2d');

    const animate = () => {
      if (!isRunning) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const grid = pheromoneGridRef.current;
      if (!grid) { animRef.current = requestAnimationFrame(animate); return; }

      const steps = Math.round(speed);
      for (let step = 0; step < steps; step++) {
        for (let i = 0; i < grid.toFood.length; i++) {
          grid.toFood[i] *= DECAY;
          grid.toHome[i] *= DECAY;
        }

        for (const ant of antsRef.current) {
          const senseAngle = 0.5;
          const senseDist = 12;
          let bestAngle = ant.angle;
          let bestStrength = -1;

          for (let a = -1; a <= 1; a++) {
            const checkAngle = ant.angle + a * senseAngle;
            const sx = ant.x + Math.cos(checkAngle) * senseDist;
            const sy = ant.y + Math.sin(checkAngle) * senseDist;
            const gi = Math.floor(sx / GRID_SIZE);
            const gj = Math.floor(sy / GRID_SIZE);

            if (gi >= 0 && gi < grid.cols && gj >= 0 && gj < grid.rows) {
              const idx = gj * grid.cols + gi;
              const strength = ant.hasFood ? grid.toHome[idx] : grid.toFood[idx];
              if (strength > bestStrength) {
                bestStrength = strength;
                bestAngle = checkAngle;
              }
            }
          }

          if (bestStrength > 0.01) {
            ant.angle += (bestAngle - ant.angle) * 0.3;
          }
          ant.angle += (Math.random() - 0.5) * 0.4;

          ant.x += Math.cos(ant.angle) * ant.speed;
          ant.y += Math.sin(ant.angle) * ant.speed;

          if (ant.x < 2 || ant.x > w - 2) { ant.angle = Math.PI - ant.angle; ant.x = Math.max(2, Math.min(w - 2, ant.x)); }
          if (ant.y < 2 || ant.y > h - 2) { ant.angle = -ant.angle; ant.y = Math.max(2, Math.min(h - 2, ant.y)); }

          const gi = Math.floor(ant.x / GRID_SIZE);
          const gj = Math.floor(ant.y / GRID_SIZE);
          if (gi >= 0 && gi < grid.cols && gj >= 0 && gj < grid.rows) {
            const idx = gj * grid.cols + gi;
            if (ant.hasFood) {
              grid.toFood[idx] = Math.min(1, grid.toFood[idx] + 0.1);
            } else {
              grid.toHome[idx] = Math.min(1, grid.toHome[idx] + 0.1);
            }
          }

          if (!ant.hasFood) {
            for (let fi = 0; fi < foodRef.current.length; fi++) {
              const food = foodRef.current[fi];
              const dx = ant.x - food.x;
              const dy = ant.y - food.y;
              if (dx * dx + dy * dy < 200 && food.amount > 0) {
                ant.hasFood = true;
                ant.foodColorIdx = fi;
                food.amount--;
                ant.angle += Math.PI;
                break;
              }
            }
          }

          if (ant.hasFood) {
            const dx = ant.x - homeRef.current.x;
            const dy = ant.y - homeRef.current.y;
            if (dx * dx + dy * dy < 300) {
              ant.hasFood = false;
              ant.foodColorIdx = -1;
              ant.angle += Math.PI;
            }
          }
        }
      }

      // ─── Draw ───
      ctx.fillStyle = 'rgba(20, 14, 8, 0.1)';
      ctx.fillRect(0, 0, w, h);

      for (let j = 0; j < grid.rows; j++) {
        for (let i = 0; i < grid.cols; i++) {
          const idx = j * grid.cols + i;
          const tf = grid.toFood[idx];
          const th = grid.toHome[idx];

          if (tf > 0.015) {
            ctx.fillStyle = `rgba(100, 180, 50, ${tf * 0.5})`;
            ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
          }
          if (th > 0.015) {
            ctx.fillStyle = `rgba(80, 140, 220, ${th * 0.35})`;
            ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
          }
        }
      }

      const hx = homeRef.current.x;
      const hy = homeRef.current.y;
      ctx.beginPath();
      ctx.ellipse(hx, hy, 18, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(90, 58, 30, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#7a5230';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 25, 12, 0.8)';
      ctx.fill();
      ctx.fillStyle = '#c0a070';
      ctx.font = '9px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('NEST', hx, hy + 24);

      for (const food of foodRef.current) {
        if (food.amount > 0) {
          const ratio = food.amount / food.maxAmount;
          const r = 5 + ratio * 10;
          ctx.beginPath();
          ctx.arc(food.x, food.y, r + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 160, 50, ${ratio * 0.1})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(food.x, food.y, r, 0, Math.PI * 2);
          ctx.fillStyle = food.color + Math.round(80 + ratio * 120).toString(16).padStart(2, '0');
          ctx.fill();
          ctx.strokeStyle = food.color;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = food.color;
          ctx.font = '8px Georgia';
          ctx.textAlign = 'center';
          ctx.fillText('FOOD', food.x, food.y + r + 12);
          ctx.fillText(`${food.amount}`, food.x, food.y + 3);
        }
      }

      for (const ant of antsRef.current) {
        ctx.save();
        ctx.translate(ant.x, ant.y);
        ctx.rotate(ant.angle);

        const bodyColor = ant.hasFood ? '#5a7030' : '#2a1810';
        ctx.fillStyle = bodyColor;

        ctx.beginPath();
        ctx.ellipse(-4, 0, 3, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, 0, 2.5, 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(3.5, 0, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 0.5;
        for (let l = -1; l <= 1; l++) {
          const lx = l * 2;
          ctx.beginPath();
          ctx.moveTo(lx, -1.5);
          ctx.lineTo(lx - 1.5, -3.5);
          ctx.moveTo(lx, 1.5);
          ctx.lineTo(lx - 1.5, 3.5);
          ctx.stroke();
        }

        if (ant.hasFood) {
          const fColor = ant.foodColorIdx >= 0 ? foodRef.current[ant.foodColorIdx]?.color : '#88cc44';
          ctx.fillStyle = fColor || '#88cc44';
          ctx.beginPath();
          ctx.arc(5, -2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(5, -1);
        ctx.quadraticCurveTo(7, -2, 8, -3);
        ctx.moveTo(5, 1);
        ctx.quadraticCurveTo(7, 2, 8, 3);
        ctx.stroke();

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [initSimulation, isRunning, speed]);

  const reset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      initSimulation(canvas);
    }
  };

  return (
    <div className="pheromone-sim">
      <div className="sim-header">
        <h3 className="sim-title">Pheromone Trail Formation</h3>
        <p className="sim-desc">
          Watch how ants discover food and form efficient trails using chemical signals.
        </p>
        <div className="sim-legend-bar">
          <span className="sim-legend">
            <span className="legend-item"><span className="legend-dot green" /> To food</span>
            <span className="legend-item"><span className="legend-dot blue" /> To home</span>
          </span>
          <div className="sim-controls">
            <button className="sim-btn" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button className="sim-btn" onClick={reset}>Reset</button>
            <div className="speed-controls">
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  className={`sim-btn speed-btn ${speed === s ? 'active' : ''}`}
                  onClick={() => setSpeed(s)}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="sim-canvas" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Colony Stats Overlay
   ═══════════════════════════════════════════════════ */

function ColonyStats() {
  return (
    <div className="colony-stats">
      <div className="stat-item">
        <span className="stat-label">Population</span>
        <span className="stat-value">~4,200</span>
      </div>
      <div className="stat-item">
        <span className="stat-dot forager" />
        <span className="stat-label">Foragers</span>
      </div>
      <div className="stat-item">
        <span className="stat-dot nurse" />
        <span className="stat-label">Nurses</span>
      </div>
      <div className="stat-item">
        <span className="stat-dot worker" />
        <span className="stat-label">Workers</span>
      </div>
      <div className="stat-item">
        <span className="stat-dot attendant" />
        <span className="stat-label">Attendants</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Colonies Tab
   ═══════════════════════════════════════════════════ */

export default function ColoniesTab() {
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [hoveredChamber, setHoveredChamber] = useState(null);

  return (
    <div className="colonies-tab">
      <motion.div
        className="colonies-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="colonies-title">
          Colony <span className="title-accent">Architecture</span>
        </h1>
        <p className="colonies-subtitle">
          Explore the underground world of a living ant colony.
          Watch ants carry food, tend brood, and maintain their home.
        </p>
      </motion.div>

      <div className="colony-3d-container">
        <Canvas
          camera={{ position: [0, -3.5, 18], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.9,
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ColonyScene
              onChamberSelect={setSelectedChamber}
              hoveredChamber={hoveredChamber}
              selectedChamber={selectedChamber?.id}
              setHoveredChamber={setHoveredChamber}
            />
          </Suspense>
        </Canvas>

        <ColonyStats />

        <AnimatePresence>
          {selectedChamber && (
            <motion.div
              className="chamber-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <button className="chamber-close" onClick={() => setSelectedChamber(null)}>×</button>
              <h3 className="chamber-name">{selectedChamber.name}</h3>
              <p className="chamber-depth">Depth level {selectedChamber.depth}</p>
              <p className="chamber-desc">{selectedChamber.description}</p>
              <div className="chamber-pop">
                <span className="pop-label">Inhabitants</span>
                <span className="pop-value">{selectedChamber.population}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PheromoneSimulation />
    </div>
  );
}
