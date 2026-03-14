import * as THREE from 'three';

/**
 * Ultra-realistic procedural texture generators for photorealistic chitin rendering.
 * Uses multi-octave value noise for organic micro-sculpture patterns.
 * All textures are 1024px canvas-based for maximum surface detail.
 */

const TEX_SIZE = 1024;

/* ─── Value Noise (smooth Perlin-like) ─── */
function hash(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // Smoothstep
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + sx * (b - a) + sy * (c - a) + sx * sy * (d - b - c + a);
}

function fbm(x, y, octaves = 6) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.1;
  }
  return val;
}

/* ─── Voronoi (for chitin micro-sculpture / cell pattern) ─── */
function voronoi(x, y, scale = 12) {
  const sx = x * scale, sy = y * scale;
  const ix = Math.floor(sx), iy = Math.floor(sy);
  let minDist = 999;
  let secondDist = 999;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const cx = ix + dx + hash(ix + dx, iy + dy);
      const cy = iy + dy + hash(iy + dy + 37, ix + dx + 13);
      const dist = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
      if (dist < minDist) { secondDist = minDist; minDist = dist; }
      else if (dist < secondDist) { secondDist = dist; }
    }
  }
  return { min: minDist, edge: secondDist - minDist };
}

/* ─── Heightfield Generator (multi-octave FBM + voronoi cells) ─── */
function generateHeightfield(size) {
  const data = new Float32Array(size * size);
  const invSize = 1.0 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x * invSize, v = y * invSize;

      // Multi-octave fractal brownian motion — organic noise
      const noise = fbm(u * 16, v * 16, 6);

      // Voronoi — chitin micro-sculpture hexagonal cells
      const vor = voronoi(u, v, 18);
      const cellEdge = Math.max(0, 1 - vor.edge * 8) * 0.25; // ridge at cell edges
      const cellDepth = vor.min * 0.15; // subtle depth inside cells

      // Fine chitin grain
      const grain = fbm(u * 48, v * 48, 3) * 0.08;

      // Pit marks (scattered circular depressions)
      const pit1 = smoothNoise(u * 24 + 3.7, v * 22 + 1.2) > 0.78 ? -0.3 : 0;
      const pit2 = smoothNoise(u * 36 + 7.1, v * 34 + 5.3) > 0.85 ? -0.18 : 0;

      // Striation lines — directional micro-ridges
      const striation = Math.sin(u * 80 + fbm(u * 8, v * 8, 3) * 4) * 0.04;

      data[y * size + x] = 0.5 + noise * 0.3 + cellEdge + cellDepth + grain + pit1 + pit2 + striation;
    }
  }
  return data;
}

/* ─── Procedural Normal Map (1024px) ─── */
export function createChitinNormalMap(size = TEX_SIZE) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const heightfield = generateHeightfield(size);
  const strength = 3.5; // strong normal detail

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const left = heightfield[y * size + ((x - 1 + size) % size)];
      const right = heightfield[y * size + ((x + 1) % size)];
      const top = heightfield[((y - 1 + size) % size) * size + x];
      const bottom = heightfield[((y + 1) % size) * size + x];

      let nx = (left - right) * strength;
      let ny = (top - bottom) * strength;
      let nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len; ny /= len; nz /= len;

      imageData.data[idx * 4] = Math.round(nx * 127.5 + 127.5);
      imageData.data[idx * 4 + 1] = Math.round(ny * 127.5 + 127.5);
      imageData.data[idx * 4 + 2] = Math.round(nz * 127.5 + 127.5);
      imageData.data[idx * 4 + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = 8;
  return tex;
}

/* ─── Procedural Color Variation Map (1024px) ─── */
export function createChitinColorMap(baseColorHex, size = TEX_SIZE) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const heightfield = generateHeightfield(size);
  const color = new THREE.Color(baseColorHex);
  const baseR = color.r * 255, baseG = color.g * 255, baseB = color.b * 255;
  const invSize = 1.0 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const h = heightfield[idx];
      const u = x * invSize, v = y * invSize;

      // Large-scale warm/cool shift — mimics uneven pigmentation
      const warmShift = fbm(u * 6, v * 6, 3) * 18 - 9;

      // Crease darkening
      const darkening = h < 0.35 ? 0.65 + h * 0.6 : 1.0;

      // Ridge highlight — specular-like brightening at peaks
      const lightening = h > 0.7 ? (h - 0.7) * 80 : 0;

      // Micro-speckle — organic dirtiness
      const speckle = (smoothNoise(x * 0.3, y * 0.3) - 0.5) * 16;

      // Color temperature shift — cooler in creases, warmer on ridges
      const tempR = h < 0.35 ? -5 : (h > 0.65 ? 8 : 0);
      const tempB = h < 0.35 ? 6 : (h > 0.65 ? -5 : 0);

      // Subtle greenish iridescence hint in some areas
      const iriG = fbm(u * 12 + 5, v * 12 + 3, 2) > 0.6 ? 4 : 0;

      const r = Math.max(0, Math.min(255, baseR * darkening + lightening + warmShift + speckle + tempR));
      const g = Math.max(0, Math.min(255, baseG * darkening + lightening * 0.85 + speckle + iriG));
      const b = Math.max(0, Math.min(255, baseB * darkening + lightening * 0.5 - warmShift * 0.3 + speckle + tempB));

      imageData.data[idx * 4] = Math.round(r);
      imageData.data[idx * 4 + 1] = Math.round(g);
      imageData.data[idx * 4 + 2] = Math.round(b);
      imageData.data[idx * 4 + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = 8;
  return tex;
}

/* ─── Procedural Roughness Map (1024px) ─── */
export function createRoughnessMap(size = TEX_SIZE) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const invSize = 1.0 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const u = x * invSize, v = y * invSize;

      // Base roughness with organic variation
      const base = 115 + fbm(u * 10, v * 10, 4) * 50 - 25;

      // Smooth polished patches (like real chitin wear patterns)
      const smoothPatch = fbm(u * 5 + 2.3, v * 5 + 7.1, 3) > 0.62 ? -35 : 0;

      // Rough grain in creases
      const rough = smoothNoise(u * 30, v * 30) > 0.8 ? 20 : 0;

      // Fine grain
      const grain = (smoothNoise(x * 0.5, y * 0.5) - 0.5) * 18;

      const val = Math.max(0, Math.min(255, base + smoothPatch + rough + grain));
      imageData.data[i * 4] = val;
      imageData.data[i * 4 + 1] = val;
      imageData.data[i * 4 + 2] = val;
      imageData.data[i * 4 + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 8;
  return tex;
}

/* ─── AO Map (pre-baked ambient occlusion approximation) ─── */
export function createAOMap(size = TEX_SIZE) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const heightfield = generateHeightfield(size);
  const invSize = 1.0 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const h = heightfield[idx];
      const u = x * invSize, v = y * invSize;

      // Crevices are darker (lower AO)
      let ao = 180;
      if (h < 0.4) ao = 100 + h * 200;
      else if (h > 0.65) ao = 220;

      // Joint areas — slightly darker
      const jointDark = fbm(u * 4, v * 4, 2) > 0.65 ? -20 : 0;

      const val = Math.max(0, Math.min(255, ao + jointDark));
      imageData.data[idx * 4] = val;
      imageData.data[idx * 4 + 1] = val;
      imageData.data[idx * 4 + 2] = val;
      imageData.data[idx * 4 + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 8;
  return tex;
}

// Pre-generate shared texture instances
export const chitinNormalMap = createChitinNormalMap();
export const chitinRoughnessMap = createRoughnessMap();
export const chitinAOMap = createAOMap();

// Cache for per-species color maps
const colorMapCache = new Map();
export function getChitinColorMap(colorHex) {
  if (!colorMapCache.has(colorHex)) {
    colorMapCache.set(colorHex, createChitinColorMap(colorHex));
  }
  return colorMapCache.get(colorHex);
}
