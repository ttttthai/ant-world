import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getSpeciesConfig } from './speciesConfig';

/**
 * High-fidelity 3D ant using downloaded Sketchfab GLB model.
 * Each species gets distinct appearance via:
 * - Strong color tinting (75%) from species bodyColor
 * - Non-uniform scaling from head/thorax/abdomen scale configs
 * - Unique PBR material properties (glossy, matte, translucent, metallic)
 * - Iridescence, sheen, and clearcoat variations
 *
 * Model: "ANT" by ani katkar (CC BY 4.0) via Sketchfab
 */

const MODEL_PATH = import.meta.env.BASE_URL + 'models/ant.glb';

// Preload the model
useGLTF.preload(MODEL_PATH);

export default function AntModelGLB({ speciesId, autoRotate = true, variant = 'detail' }) {
  const groupRef = useRef();
  const config = useMemo(() => getSpeciesConfig(speciesId), [speciesId]);
  const { scene } = useGLTF(MODEL_PATH);

  // Clone scene so each species instance gets its own materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    const bodyColor = new THREE.Color(config.bodyColor);
    const legColor = new THREE.Color(config.legColor);
    const isTranslucent = config.extras?.includes('translucent-body');

    clone.traverse((child) => {
      if (child.isMesh) {
        const oldMat = child.material.clone();
        const mat = new THREE.MeshPhysicalMaterial();

        // Preserve the model's original textures
        if (oldMat.map) mat.map = oldMat.map;
        if (oldMat.normalMap) mat.normalMap = oldMat.normalMap;
        if (oldMat.roughnessMap) mat.roughnessMap = oldMat.roughnessMap;
        if (oldMat.metalnessMap) mat.metalnessMap = oldMat.metalnessMap;
        if (oldMat.aoMap) mat.aoMap = oldMat.aoMap;
        if (oldMat.emissiveMap) mat.emissiveMap = oldMat.emissiveMap;

        // Strong species color tint — 75% species color to make each distinct
        if (oldMat.map) {
          mat.color.set('#ffffff').lerp(bodyColor, 0.75);
        } else {
          mat.color.copy(bodyColor);
        }

        // PBR chitin properties — these vary widely per species
        mat.roughness = config.roughness;
        mat.metalness = config.metalness;
        mat.clearcoat = config.clearcoat;
        mat.clearcoatRoughness = config.clearcoatRoughness;
        mat.sheen = config.sheen;
        mat.sheenRoughness = config.sheenRoughness;
        mat.sheenColor = new THREE.Color(config.sheenColor);
        mat.ior = config.ior;
        mat.envMapIntensity = 0.8;

        // Translucent species (apomyrma, leptanilla, martialis)
        if (isTranslucent) {
          mat.transmission = config.transmission || 0.4;
          mat.thickness = config.thickness || 2.0;
          mat.transparent = true;
          mat.opacity = 0.85;
          mat.attenuationColor = new THREE.Color(config.sssAttenuationColor || '#804020');
          mat.attenuationDistance = 0.5;
        }

        // Iridescence — varies from 0.05 (bullet) to 0.2 (bulldog)
        mat.iridescence = config.iridescence || 0.1;
        mat.iridescenceIOR = config.iridescenceIOR || 1.35;
        mat.iridescenceThicknessRange = [100, 400];

        // Specular — varies from matte to mirror-like
        mat.specularIntensity = config.specularIntensity || 0.55;
        mat.specularColor = new THREE.Color(config.specularColor || '#886644');

        // Emissive warmth scaled to body brightness
        mat.emissive = bodyColor.clone();
        mat.emissiveIntensity = config.emissiveIntensity || 0.02;

        mat.needsUpdate = true;
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene, config]);

  // Auto-rotation
  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  // Compute bounding box to center and normalize, then apply species-specific scaling
  const { normalizedScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 0.7 / maxDim * config.overallScale;

    return {
      normalizedScale: s,
      offset: center.multiplyScalar(-1),
    };
  }, [clonedScene, config.overallScale]);

  // Species-specific shape deformation [width, height, length]
  const ms = config.modelScale || [1, 1, 1];

  return (
    <group
      ref={groupRef}
      scale={[
        normalizedScale * ms[0],
        normalizedScale * ms[1],
        normalizedScale * ms[2],
      ]}
      position={[0, -0.1, 0]}
    >
      <primitive object={clonedScene} position={[offset.x, offset.y, offset.z]} />
    </group>
  );
}
