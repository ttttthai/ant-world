import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSpeciesConfig } from './speciesConfig';
import { chitinNormalMap, chitinRoughnessMap, chitinAOMap, getChitinColorMap } from './textures';
import {
  headGeo, thoraxGeo, abdomenGeo, petioleGeo,
  sphereGeo, hiResSphereGeo, cylinderGeo, taperGeo,
  coneGeo, planeGeo, torusGeo, spineGeo, flatSpineGeo,
} from './geometries';

/**
 * Game-quality photorealistic procedural 3D ant model.
 *
 * Key features:
 * - Organic LatheGeometry body shapes (not spheres)
 * - 512px procedural normal maps for chitin micro-detail
 * - Per-species color variation maps
 * - InstancedMesh setae (300 hairs at 3 draw calls)
 * - Iridescent chitin with subsurface scattering hints
 * - Compound eye facets with iridescence
 * - Full anatomical detail: spiracles, tergites, mandible serration, tarsal claws
 */

/* ─── InstancedMesh Setae (hair-like spines) ─── */
function InstancedSetae({ count, scaleX, scaleY, scaleZ, matProps, bodyColor }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Setae are lighter than body — golden/amber like real ant hairs
  const setaeColor = useMemo(() => {
    const base = new THREE.Color(bodyColor || '#886644');
    base.offsetHSL(0.03, -0.12, 0.3);
    return '#' + base.getHexString();
  }, [bodyColor]);

  // Darker base color for setae roots
  const setaeRootColor = useMemo(() => {
    const base = new THREE.Color(bodyColor || '#886644');
    base.offsetHSL(0.01, -0.05, 0.1);
    return '#' + base.getHexString();
  }, [bodyColor]);

  useEffect(() => {
    if (!meshRef.current) return;
    // Use golden ratio for more natural distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const theta = goldenAngle * i + (Math.random() - 0.5) * 0.4;
      const phi = 0.1 + t * 0.78 + (Math.random() - 0.5) * 0.12;

      const x = Math.sin(phi) * Math.cos(theta) * scaleX * 0.98;
      const y = Math.cos(phi) * scaleY * 0.98;
      const z = Math.sin(phi) * Math.sin(theta) * scaleZ * 0.98;

      dummy.position.set(x, y, z);
      dummy.lookAt(x * 3, y * 3, z * 3);
      dummy.rotateX(Math.PI / 2);
      // Natural backward-swept angle like real setae
      dummy.rotateX(-0.2 + (Math.random() - 0.5) * 0.6);
      dummy.rotateZ((Math.random() - 0.5) * 0.4);

      // Variable hair sizes — some long guard hairs, many shorter ones
      const isGuardHair = Math.random() > 0.85;
      const length = isGuardHair
        ? 0.02 + Math.random() * 0.02
        : 0.008 + Math.random() * 0.014;
      const thickness = isGuardHair
        ? 0.0009 + Math.random() * 0.0004
        : 0.0005 + Math.random() * 0.0004;
      dummy.scale.set(thickness, length, thickness);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, scaleX, scaleY, scaleZ, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[spineGeo, null, count]} frustumCulled={false}>
      <meshPhysicalMaterial
        color={setaeColor}
        emissive={setaeRootColor}
        emissiveIntensity={0.03}
        roughness={0.65}
        metalness={0.02}
        transparent
        opacity={0.82}
        clearcoat={0.3}
        clearcoatRoughness={0.4}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
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
      />
    </mesh>
  );
}

/* ─── Compound Eye (faceted hemisphere with iridescence) ─── */
function CompoundEye({ position, scale, eyeMat }) {
  const facets = useMemo(() => {
    const f = [];
    // More facet rings for realistic compound eye
    for (let ring = 0; ring < 5; ring++) {
      const count = ring === 0 ? 1 : ring * 6;
      const r = ring * 0.22;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + ring * 0.25;
        const zPush = Math.max(0, 0.75 - ring * 0.06);
        f.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
          z: zPush + 0.12,
          s: 0.16 - ring * 0.018,
        });
      }
    }
    return f;
  }, []);

  return (
    <group position={position}>
      {/* Base eye sphere */}
      <mesh geometry={hiResSphereGeo} scale={scale}>
        <meshPhysicalMaterial {...eyeMat} />
      </mesh>
      {/* Individual ommatidia facets */}
      {facets.map((f, i) => (
        <mesh
          key={i}
          geometry={sphereGeo}
          position={[f.x * scale[0], f.y * scale[1], f.z * scale[2]]}
          scale={[scale[0] * f.s, scale[1] * f.s, scale[2] * f.s * 0.5]}
        >
          <meshPhysicalMaterial
            {...eyeMat}
            roughness={0.04}
            clearcoat={1.0}
            clearcoatRoughness={0.003}
            iridescence={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Single Leg ─── */
function Leg({ side, pairIndex, length, thickness, matProps }) {
  const xSign = side === 'left' ? -1 : 1;
  const zOffset = (pairIndex - 1) * 0.18;
  const hipAngle = 0.6 + pairIndex * 0.15;
  const kneeAngle = -0.8;

  return (
    <group position={[xSign * 0.12, -0.04, zOffset]}>
      {/* Coxa */}
      <mesh geometry={sphereGeo} scale={[thickness * 1.3, thickness * 1.1, thickness * 1.3]}>
        <meshPhysicalMaterial {...matProps} />
      </mesh>

      <group rotation={[0, 0, xSign * hipAngle]}>
        {/* Femur */}
        <mesh geometry={cylinderGeo} position={[0, -length * 0.3, 0]} scale={[thickness, length * 0.5, thickness]}>
          <meshPhysicalMaterial {...matProps} />
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
          <mesh geometry={cylinderGeo} position={[0, -length * 0.3, 0]} scale={[thickness * 0.7, length * 0.55, thickness * 0.7]}>
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          {/* Tibial spurs */}
          <mesh geometry={spineGeo} position={[xSign * thickness * 0.6, -length * 0.12, 0]} rotation={[0, 0, xSign * -0.5]} scale={[thickness * 0.35, length * 0.14, thickness * 0.35]}>
            <meshPhysicalMaterial {...matProps} metalness={0.25} clearcoat={1.0} clearcoatRoughness={0.02} />
          </mesh>
          <mesh geometry={spineGeo} position={[-xSign * thickness * 0.4, -length * 0.18, 0]} rotation={[0, 0, -xSign * -0.4]} scale={[thickness * 0.25, length * 0.1, thickness * 0.25]}>
            <meshPhysicalMaterial {...matProps} metalness={0.25} clearcoat={1.0} />
          </mesh>
          {/* Tibia setae */}
          {[0.15, 0.25, 0.35, 0.45].map((t, j) => (
            <mesh key={j} geometry={spineGeo}
              position={[thickness * 0.5 * (j % 2 ? 1 : -1), -length * t, thickness * 0.3 * (j % 2 ? 1 : -1)]}
              rotation={[(j % 2 ? 0.4 : -0.4), 0, (j % 2 ? 0.3 : -0.3)]}
              scale={[thickness * 0.12, length * 0.05, thickness * 0.12]}
            >
              <meshPhysicalMaterial color={matProps.color} roughness={0.6} />
            </mesh>
          ))}

          {/* Tarsus */}
          <group position={[0, -length * 0.55, 0]} rotation={[0, 0, xSign * 0.4]}>
            <mesh geometry={taperGeo} position={[0, -length * 0.06, 0]} scale={[thickness * 0.45, length * 0.1, thickness * 0.45]}>
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            <mesh geometry={taperGeo} position={[0, -length * 0.12, 0]} scale={[thickness * 0.35, length * 0.08, thickness * 0.35]}>
              <meshPhysicalMaterial {...matProps} />
            </mesh>
            {/* Pretarsus with claws */}
            <group position={[0, -length * 0.17, 0]}>
              <mesh geometry={spineGeo} position={[thickness * 0.15, -length * 0.03, 0]} rotation={[0.3, 0, xSign * 0.3]} scale={[thickness * 0.15, length * 0.06, thickness * 0.12]}>
                <meshPhysicalMaterial {...matProps} metalness={0.3} clearcoat={1.0} clearcoatRoughness={0.02} />
              </mesh>
              <mesh geometry={spineGeo} position={[-thickness * 0.15, -length * 0.03, 0]} rotation={[0.3, 0, -xSign * 0.3]} scale={[thickness * 0.15, length * 0.06, thickness * 0.12]}>
                <meshPhysicalMaterial {...matProps} metalness={0.3} clearcoat={1.0} clearcoatRoughness={0.02} />
              </mesh>
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

/* ─── Antenna ─── */
function Antenna({ side, length, matProps }) {
  const xSign = side === 'left' ? -1 : 1;
  const thickness = 0.012;

  return (
    <group position={[xSign * 0.06, 0.08, 0.12]} rotation={[0.3, xSign * 0.3, xSign * 0.4]}>
      {/* Scape */}
      <mesh geometry={cylinderGeo} position={[0, length * 0.2, 0]} scale={[thickness, length * 0.35, thickness]}>
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      <mesh geometry={torusGeo} position={[0, length * 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness * 1.5, thickness * 1.5, thickness]}>
        <meshPhysicalMaterial {...matProps} clearcoat={1.0} />
      </mesh>
      {/* Pedicel + Funiculus */}
      <group position={[0, length * 0.38, 0]} rotation={[0.4, 0, xSign * 0.25]}>
        <mesh geometry={cylinderGeo} position={[0, length * 0.18, 0]} scale={[thickness * 0.85, length * 0.3, thickness * 0.85]}>
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        <group position={[0, length * 0.32, 0]} rotation={[0.3, 0, xSign * 0.15]}>
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

/* ─── Mandible ─── */
function Mandible({ side, length, angle, thickness, matProps, hooked }) {
  const xSign = side === 'left' ? -1 : 1;
  const mandMat = { ...matProps, metalness: Math.max(matProps.metalness || 0, 0.3), clearcoat: 1.0, clearcoatRoughness: 0.05 };
  const toothCount = Math.max(4, Math.floor(length * 14));

  return (
    <group position={[xSign * 0.05, -0.04, 0.12]} rotation={[0.2, xSign * angle, 0]}>
      <mesh geometry={hooked ? taperGeo : cylinderGeo} position={[0, 0, length * 0.5]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness, length, thickness * 0.8]}>
        <meshPhysicalMaterial {...mandMat} />
      </mesh>
      <mesh geometry={cylinderGeo} position={[0, thickness * 0.3, length * 0.45]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness * 0.3, length * 0.7, thickness * 0.15]}>
        <meshPhysicalMaterial {...mandMat} />
      </mesh>
      {Array.from({ length: toothCount }, (_, i) => {
        const t = (i + 1) / (toothCount + 1);
        const toothSize = 1 - t * 0.4;
        return (
          <mesh key={i} geometry={spineGeo}
            position={[xSign * thickness * 0.5, 0, length * t]}
            rotation={[0, xSign * -0.3, 0]}
            scale={[thickness * 0.3 * toothSize, thickness * 0.7 * toothSize, thickness * 0.2 * toothSize]}>
            <meshPhysicalMaterial {...mandMat} />
          </mesh>
        );
      })}
      <mesh geometry={coneGeo} position={[0, 0, length * 0.98]} rotation={[Math.PI / 2, 0, 0]} scale={[thickness * 0.45, length * 0.15, thickness * 0.35]}>
        <meshPhysicalMaterial {...mandMat} metalness={0.35} />
      </mesh>
    </group>
  );
}

/* ─── Spiracle ─── */
function Spiracle({ position }) {
  return (
    <group position={position}>
      <mesh geometry={sphereGeo} scale={[0.008, 0.006, 0.004]}>
        <meshPhysicalMaterial color="#1a0e04" roughness={0.8} metalness={0} />
      </mesh>
      <mesh geometry={torusGeo} rotation={[0, Math.PI / 2, 0]} scale={[0.007, 0.007, 0.005]}>
        <meshPhysicalMaterial color="#2a1a0a" roughness={0.5} metalness={0.15} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Main Ant Model ─── */
export default function AntModel({ speciesId, autoRotate = true, variant = 'detail' }) {
  const groupRef = useRef();
  const config = useMemo(() => getSpeciesConfig(speciesId), [speciesId]);
  const isCard = variant === 'card';

  // Per-species color variation map
  const colorMap = useMemo(() => getChitinColorMap(config.bodyColor), [config.bodyColor]);

  // Photorealistic chitin — waxy organic exoskeleton with micro-sculpture
  const bodyMat = useMemo(() => ({
    map: colorMap,
    normalMap: chitinNormalMap,
    normalScale: new THREE.Vector2(1.4, 1.4),
    roughnessMap: chitinRoughnessMap,
    aoMap: chitinAOMap,
    aoMapIntensity: 0.6,
    roughness: config.roughness,
    metalness: config.metalness,
    emissive: config.bodyColor,
    emissiveIntensity: config.emissiveIntensity + 0.015,
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
    sheen: config.sheen,
    sheenRoughness: config.sheenRoughness,
    sheenColor: config.sheenColor,
    ior: config.ior,
    envMapIntensity: 0.65,
    iridescence: config.iridescence || 0.1,
    iridescenceIOR: config.iridescenceIOR || 1.3,
    iridescenceThicknessRange: [100, 400],
    specularIntensity: config.specularIntensity || 0.5,
    specularColor: config.specularColor || '#886644',
  }), [config, colorMap]);

  const legMat = useMemo(() => ({
    ...bodyMat,
    map: getChitinColorMap(config.legColor),
    emissive: config.legColor,
    normalScale: new THREE.Vector2(0.8, 0.8),
    clearcoat: Math.min((config.clearcoat || 0.35) + 0.15, 1.0),
    clearcoatRoughness: 0.15,
    transmission: 0,
  }), [bodyMat, config.legColor, config.clearcoat]);

  const translucentMat = useMemo(() => ({
    ...bodyMat,
    transmission: config.transmission || 0.4,
    thickness: config.thickness || 2.0,
    transparent: true,
    opacity: 0.85,
  }), [bodyMat, config]);

  const eyeMat = useMemo(() => ({
    color: config.eyeColor,
    roughness: 0.08,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    envMapIntensity: 1.2,
    iridescence: 0.55,
    iridescenceIOR: 1.7,
    iridescenceThicknessRange: [150, 450],
    specularIntensity: 1.2,
    specularColor: '#334455',
    sheen: 0.3,
    sheenColor: '#112233',
    sheenRoughness: 0.2,
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

  // Setae counts — dense like macro photography reveals
  const headSetae = isCard ? 80 : 200;
  const thoraxSetae = isCard ? 100 : 260;
  const abdomenSetae = isCard ? 90 : 220;

  return (
    <group ref={groupRef} scale={config.overallScale} position={[0, -0.15, 0]}>
      {/* ─── Head ─── */}
      <group position={[0, 0.05, 0.28]}>
        <mesh geometry={headGeo} scale={[0.14 * hs[0], 0.13 * hs[1], 0.14 * hs[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...mainMat} />
        </mesh>
        <InstancedSetae count={headSetae} scaleX={0.14 * hs[0]} scaleY={0.13 * hs[1]} scaleZ={0.14 * hs[2]} matProps={mainMat} bodyColor={config.bodyColor} />

        {/* Compound Eyes */}
        <CompoundEye position={[0.08, 0.03, 0.06]} scale={[0.038, 0.032, 0.032]} eyeMat={eyeMat} />
        <CompoundEye position={[-0.08, 0.03, 0.06]} scale={[0.038, 0.032, 0.032]} eyeMat={eyeMat} />

        {/* Clypeus */}
        <mesh geometry={sphereGeo} position={[0, -0.02, 0.13]} scale={[0.08 * hs[0], 0.03, 0.04]}>
          <meshPhysicalMaterial {...mainMat} metalness={(mainMat.metalness || 0) + 0.12} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Frons */}
        <mesh geometry={sphereGeo} position={[0, 0.06, 0.11]} scale={[0.06 * hs[0], 0.025, 0.03]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={0.9} />
        </mesh>

        {/* Vertex ridges */}
        <mesh geometry={torusGeo} position={[0, 0.1 * hs[1], 0.03]} rotation={[0.6, 0, 0]} scale={[0.06 * hs[0], 0.003, 0.08 * hs[2]]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.02} />
        </mesh>

        {/* Mandibles */}
        <Mandible side="left" length={config.mandibleLength} angle={config.mandibleAngle} thickness={config.mandibleThickness} matProps={legMat} hooked={hasHookedMandibles} />
        <Mandible side="right" length={config.mandibleLength} angle={config.mandibleAngle} thickness={config.mandibleThickness} matProps={legMat} hooked={hasHookedMandibles} />

        {/* Antennae */}
        <Antenna side="left" length={config.antennaLength} matProps={legMat} />
        <Antenna side="right" length={config.antennaLength} matProps={legMat} />

        {/* Leaf (Leafcutter) */}
        {hasLeaf && (
          <group position={[0, 0.12, 0.18]} rotation={[0.3, 0.2, 0.5]}>
            <mesh geometry={planeGeo} scale={[0.18, 0.14, 1]}>
              <meshPhysicalMaterial color="#3a7020" roughness={0.65} clearcoat={0.4} clearcoatRoughness={0.35} transmission={0.15} thickness={0.5} ior={1.5} side={THREE.DoubleSide} transparent opacity={0.9} />
            </mesh>
            <mesh geometry={cylinderGeo} position={[0, 0, 0.001]} scale={[0.003, 0.12, 0.001]}>
              <meshBasicMaterial color="#2a5515" />
            </mesh>
          </group>
        )}
      </group>

      {/* ─── Head-Neck Ridge ─── */}
      <ChitinRidge position={[0, 0.02, 0.22]} radius={0.06} matProps={mainMat} bodyColor={config.bodyColor} />

      {/* ─── Neck ─── */}
      <mesh geometry={cylinderGeo} position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} scale={[0.05, 0.08, 0.05]}>
        <meshPhysicalMaterial {...mainMat} />
      </mesh>

      {/* ─── Neck-Thorax Ridge ─── */}
      <ChitinRidge position={[0, 0.01, 0.12]} radius={0.065} matProps={mainMat} bodyColor={config.bodyColor} />

      {/* ─── Thorax ─── */}
      <group position={[0, 0.02, 0]}>
        <mesh geometry={thoraxGeo} scale={[0.13 * ts[0], 0.16 * ts[2], 0.11 * ts[1]]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...mainMat} />
        </mesh>
        <InstancedSetae count={thoraxSetae} scaleX={0.13 * ts[0]} scaleY={0.11 * ts[1]} scaleZ={0.16 * ts[2]} matProps={mainMat} bodyColor={config.bodyColor} />

        {/* Pronotum plate */}
        <mesh geometry={sphereGeo} position={[0, 0.11 * ts[1] * 0.9, 0.08]} scale={[0.1 * ts[0], 0.015, 0.06]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>
        {/* Mesonotum plate */}
        <mesh geometry={sphereGeo} position={[0, 0.11 * ts[1] * 0.85, -0.02]} scale={[0.08 * ts[0], 0.012, 0.05]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>
        {/* Pronotum ridge */}
        <mesh geometry={torusGeo} position={[0, 0.11 * ts[1] * 0.85, 0.05]} rotation={[0.3, 0, 0]} scale={[0.1 * ts[0], 0.003, 0.12 * ts[2]]}>
          <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Spiracles */}
        <Spiracle position={[0.13 * ts[0] * 0.9, 0, 0.05]} />
        <Spiracle position={[-0.13 * ts[0] * 0.9, 0, 0.05]} />
        <Spiracle position={[0.13 * ts[0] * 0.85, 0, -0.05]} />
        <Spiracle position={[-0.13 * ts[0] * 0.85, 0, -0.05]} />

        {/* Metapleural gland */}
        <mesh geometry={sphereGeo} position={[0.12 * ts[0], -0.04, -0.08]} scale={[0.012, 0.008, 0.008]}>
          <meshPhysicalMaterial color="#2a1508" roughness={0.3} metalness={0.2} clearcoat={0.8} />
        </mesh>
        <mesh geometry={sphereGeo} position={[-0.12 * ts[0], -0.04, -0.08]} scale={[0.012, 0.008, 0.008]}>
          <meshPhysicalMaterial color="#2a1508" roughness={0.3} metalness={0.2} clearcoat={0.8} />
        </mesh>

        {/* Legs */}
        {[0, 1, 2].map(pair => (
          <Leg key={`l-${pair}`} side="left" pairIndex={pair} length={config.legLength} thickness={config.legThickness} matProps={legMat} />
        ))}
        {[0, 1, 2].map(pair => (
          <Leg key={`r-${pair}`} side="right" pairIndex={pair} length={config.legLength} thickness={config.legThickness} matProps={legMat} />
        ))}
      </group>

      {/* ─── Thorax-Petiole Ridge ─── */}
      <ChitinRidge position={[0, -0.005, -0.14]} radius={0.04} matProps={mainMat} bodyColor={config.bodyColor} />

      {/* ─── Petiole ─── */}
      <mesh geometry={petioleGeo} position={[0, -0.01, -0.18]} scale={[0.04, 0.04, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
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
      <ChitinRidge position={[0, -0.015, -0.24]} radius={0.055} matProps={mainMat} bodyColor={config.bodyColor} />

      {/* ─── Abdomen ─── */}
      <group position={[0, -0.02, -0.35]}>
        <mesh geometry={abdomenGeo} scale={[0.16 * as[0], 0.2 * as[2], 0.14 * as[1]]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial {...mainMat} />
        </mesh>
        <InstancedSetae count={abdomenSetae} scaleX={0.16 * as[0]} scaleY={0.14 * as[1]} scaleZ={0.2 * as[2]} matProps={mainMat} bodyColor={config.bodyColor} />

        {/* Tergite segment plates */}
        {[0.25, 0.42, 0.58, 0.74].map((t, i) => (
          <group key={i}>
            <mesh geometry={torusGeo} position={[0, 0, -0.2 * as[2] * (t * 2 - 1)]} rotation={[Math.PI / 2, 0, 0]}
              scale={[0.155 * as[0] * (1 - t * 0.25), 0.004, 0.135 * as[1] * (1 - t * 0.25)]}>
              <meshPhysicalMaterial {...mainMat} clearcoat={1.0} clearcoatRoughness={0.03} />
            </mesh>
            <mesh geometry={sphereGeo} position={[0, 0.01, -0.2 * as[2] * (t * 2 - 1)]}
              scale={[0.15 * as[0] * (1 - t * 0.22), 0.005, 0.02]}>
              <meshPhysicalMaterial {...mainMat} clearcoat={0.9} />
            </mesh>
          </group>
        ))}

        {/* Spiracles */}
        <Spiracle position={[0.15 * as[0], 0, 0.05]} />
        <Spiracle position={[-0.15 * as[0], 0, 0.05]} />
        <Spiracle position={[0.14 * as[0], 0, -0.06]} />
        <Spiracle position={[-0.14 * as[0], 0, -0.06]} />

        {/* Pygidium */}
        <mesh geometry={sphereGeo} position={[0, -0.005, -0.19 * as[2]]} scale={[0.065 * as[0], 0.045 * as[1], 0.025]}>
          <meshPhysicalMaterial {...mainMat} metalness={(mainMat.metalness || 0) + 0.12} clearcoat={1.0} clearcoatRoughness={0.03} />
        </mesh>

        {/* Ventral sternites */}
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
              <meshPhysicalMaterial color={config.legColor} roughness={0.15} metalness={0.35} clearcoat={1.0} clearcoatRoughness={0.02} />
            </mesh>
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
