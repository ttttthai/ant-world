import * as THREE from 'three';

/**
 * Ultra-high-detail anatomically correct LatheGeometry body parts.
 * 64-segment revolution with organic post-deformation for photorealism.
 */

const SEGMENTS = 64;

function profileToVectors(points) {
  return points.map(([r, y]) => new THREE.Vector2(r, y));
}

/* ─── Head Geometry ─── */
export function createHeadGeometry() {
  const profile = profileToVectors([
    [0, -0.52],
    [0.15, -0.48],
    [0.28, -0.42],
    [0.38, -0.32],
    [0.45, -0.18],
    [0.5, -0.04],
    [0.49, 0.08],
    [0.46, 0.18],
    [0.42, 0.28],
    [0.35, 0.36],
    [0.25, 0.43],
    [0.14, 0.48],
    [0, 0.52],
  ]);
  const geo = new THREE.LatheGeometry(profile, SEGMENTS);

  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);

    // Flatten dorsal
    if (y > 0) y *= 0.82;
    // Widen anterior
    if (z > 0) { x *= 1.1; z *= 1.15; }
    // Subtle lateral flattening
    x *= 0.95;
    // Organic micro-deformation
    const angle = Math.atan2(z, x);
    const wobble = Math.sin(angle * 5 + y * 8) * 0.008;
    x += wobble;
    z += wobble * 0.5;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/* ─── Thorax (Mesosoma) Geometry ─── */
export function createThoraxGeometry() {
  const profile = profileToVectors([
    [0, -0.62],
    [0.14, -0.56],
    [0.26, -0.48],
    [0.34, -0.36],
    [0.40, -0.2],
    [0.38, -0.05],
    [0.36, 0.08],
    [0.42, 0.2],   // pronotum hump
    [0.44, 0.3],   // peak
    [0.40, 0.4],
    [0.32, 0.48],
    [0.20, 0.54],
    [0.10, 0.58],
    [0, 0.62],
  ]);
  const geo = new THREE.LatheGeometry(profile, SEGMENTS);

  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);

    // Flatten ventral
    if (y < -0.15) y *= 0.8;
    // Pronotum hump enhancement
    const humpFactor = Math.exp(-((y - 0.28) ** 2) / 0.035);
    x *= (1 + humpFactor * 0.15);
    z *= (1 + humpFactor * 0.15);
    // Mesonotum constriction
    const constrictY = -0.05;
    const constrictFactor = Math.exp(-((y - constrictY) ** 2) / 0.02);
    x *= (1 - constrictFactor * 0.08);
    z *= (1 - constrictFactor * 0.08);
    // Organic micro-wobble
    const angle = Math.atan2(z, x);
    const wobble = Math.sin(angle * 6 + y * 10) * 0.005;
    x += wobble;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/* ─── Abdomen (Gaster) Geometry ─── */
export function createAbdomenGeometry() {
  const profile = profileToVectors([
    [0, -0.68],
    [0.12, -0.62],
    [0.22, -0.54],
    [0.34, -0.42],
    [0.44, -0.26],
    [0.50, -0.08],
    [0.50, 0.08],
    [0.46, 0.22],
    [0.38, 0.35],
    [0.28, 0.46],
    [0.18, 0.54],
    [0.10, 0.60],
    [0.04, 0.65],
    [0, 0.68],
  ]);
  const geo = new THREE.LatheGeometry(profile, SEGMENTS);

  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    // Flatten ventral
    if (y < 0) y *= 0.86;
    // Slight lateral flattening for realism
    x *= 0.96;
    // Tergite segment bumps — creates visible segment divisions
    const segFreq = 3.5;
    const segBump = Math.sin(z * segFreq * Math.PI) * 0.012;
    const dist = Math.sqrt(x * x + y * y);
    x += (x / (dist + 0.001)) * segBump;
    y += (y / (dist + 0.001)) * segBump;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/* ─── Petiole (Waist Node) Geometry ─── */
export function createPetioleGeometry() {
  const profile = profileToVectors([
    [0, -0.42],
    [0.12, -0.32],
    [0.22, -0.2],
    [0.32, -0.05],
    [0.40, 0.08],
    [0.42, 0.14],
    [0.38, 0.22],
    [0.28, 0.3],
    [0.16, 0.36],
    [0, 0.42],
  ]);
  const geo = new THREE.LatheGeometry(profile, 40);
  geo.computeVertexNormals();
  return geo;
}

/* ─── Shared Geometry Singletons ─── */
export const headGeo = createHeadGeometry();
export const thoraxGeo = createThoraxGeometry();
export const abdomenGeo = createAbdomenGeometry();
export const petioleGeo = createPetioleGeometry();

// Higher-detail primitives for visible parts
export const sphereGeo = new THREE.SphereGeometry(1, 40, 28);
export const hiResSphereGeo = new THREE.SphereGeometry(1, 56, 42);
export const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 20);
export const taperGeo = new THREE.CylinderGeometry(0.6, 1, 1, 16);
export const coneGeo = new THREE.ConeGeometry(1, 1, 16);
export const planeGeo = new THREE.PlaneGeometry(1, 1, 4, 4);
export const torusGeo = new THREE.TorusGeometry(1, 0.15, 12, 32);
export const spineGeo = new THREE.ConeGeometry(1, 1, 6);
export const flatSpineGeo = new THREE.ConeGeometry(1, 1, 4);
