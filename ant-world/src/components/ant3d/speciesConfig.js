/**
 * Per-species 3D model configuration
 * Controls proportions, colors, materials, and special features for each procedural ant
 */

const BASE = {
  headScale: [1, 0.9, 1],
  thoraxScale: [1.2, 0.85, 0.9],
  abdomenScale: [1.1, 1, 1],
  mandibleLength: 0.18,
  mandibleAngle: 0.5,
  mandibleThickness: 0.04,
  legLength: 0.55,
  legThickness: 0.025,
  antennaLength: 0.4,
  overallScale: 1,
  bodyColor: '#6B5010',
  legColor: '#4F3A0C',
  eyeColor: '#0a0a0a',
  // GLB model shape — [width, height, length] deformation to match real species
  // width: lateral bulk, height: dorsal-ventral, length: head-to-abdomen
  modelScale: [1, 1, 1],
  // PBR — waxy chitin exoskeleton (tuned from real macro photos)
  roughness: 0.45,
  metalness: 0.03,
  emissiveIntensity: 0.02,
  clearcoat: 0.45,
  clearcoatRoughness: 0.2,
  sheen: 0.4,
  sheenRoughness: 0.4,
  sheenColor: '#443322',
  ior: 1.52,
  transmission: 0,
  thickness: 0,
  // Iridescence — chitin thin-film interference
  iridescence: 0.1,
  iridescenceIOR: 1.35,
  // Specular — real chitin is moderately reflective
  specularIntensity: 0.55,
  specularColor: '#886644',
  sssTransmission: 0,
  sssThickness: 0.5,
  sssAttenuationColor: '#804020',
  extras: [],
};

function cfg(overrides) {
  return { ...BASE, ...overrides };
}

export const speciesConfigs = {
  // Leafcutter: stocky, wide head, spiny thorax, reddish-brown
  leafcutter: cfg({
    headScale: [1, 0.9, 1],
    thoraxScale: [1.2, 0.8, 0.9],
    abdomenScale: [1.1, 0.95, 1],
    mandibleLength: 0.22,
    mandibleAngle: 0.6,
    mandibleThickness: 0.05,
    overallScale: 0.95,
    modelScale: [1.1, 0.95, 1.0],  // slightly wider, compact
    bodyColor: '#8B4513',
    legColor: '#5E2E0A',
    sheenColor: '#6B3410',
    extras: ['leaf'],
  }),

  // Bullet: massive, bulky, very dark glossy black
  bullet: cfg({
    headScale: [1.15, 1, 1.1],
    thoraxScale: [1.3, 0.95, 1],
    abdomenScale: [1.3, 1.15, 1.2],
    mandibleLength: 0.2,
    mandibleAngle: 0.4,
    mandibleThickness: 0.06,
    legLength: 0.6,
    legThickness: 0.03,
    overallScale: 1.25,
    modelScale: [1.2, 1.15, 1.1],  // thick bulky body
    bodyColor: '#1a0e06',
    legColor: '#0e0804',
    roughness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    sheen: 0.15,
    sheenColor: '#1a1008',
    iridescence: 0.05,
    sssAttenuationColor: '#301008',
    extras: ['stinger'],
  }),

  // Weaver: slender, elongated, bright orange-amber, long legs
  weaver: cfg({
    headScale: [0.95, 0.85, 0.95],
    thoraxScale: [1.3, 0.75, 0.85],
    abdomenScale: [1.05, 0.9, 0.95],
    mandibleLength: 0.16,
    mandibleAngle: 0.5,
    legLength: 0.7,
    legThickness: 0.02,
    antennaLength: 0.5,
    overallScale: 0.9,
    modelScale: [0.85, 0.9, 1.2],  // slender and elongated
    bodyColor: '#D4871C',
    legColor: '#AA6510',
    roughness: 0.3,
    clearcoat: 0.7,
    clearcoatRoughness: 0.15,
    sheenColor: '#E89A22',
    iridescence: 0.2,
    specularIntensity: 0.9,
    specularColor: '#CC8822',
    sssAttenuationColor: '#604010',
  }),

  // Armadillo: compact, armored, thick exoskeleton, brownish
  armadillo: cfg({
    headScale: [0.95, 0.9, 0.95],
    thoraxScale: [1.15, 0.85, 0.9],
    abdomenScale: [1.1, 1.0, 1.05],
    mandibleLength: 0.12,
    mandibleAngle: 0.35,
    mandibleThickness: 0.04,
    legLength: 0.4,
    legThickness: 0.028,
    overallScale: 0.7,
    modelScale: [1.15, 1.1, 0.85],  // wide, compact, short
    bodyColor: '#7A5A3A',
    legColor: '#5A4028',
    roughness: 0.45,
    metalness: 0.2,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
    extras: ['armored'],
  }),

  // Heteroponera: medium, dark brown, compact
  heteroponera: cfg({
    headScale: [0.95, 0.88, 0.92],
    thoraxScale: [1.15, 0.82, 0.88],
    abdomenScale: [1.05, 0.95, 1.0],
    mandibleLength: 0.16,
    mandibleAngle: 0.45,
    mandibleThickness: 0.04,
    legLength: 0.48,
    legThickness: 0.024,
    antennaLength: 0.38,
    overallScale: 0.75,
    modelScale: [1.0, 0.95, 0.95],
    bodyColor: '#4A3020',
    legColor: '#2E1A10',
    roughness: 0.4,
    extras: ['stinger'],
  }),

  // Army: elongated, narrow body, dark brown, huge curved mandibles
  army: cfg({
    headScale: [1.1, 0.95, 1.05],
    thoraxScale: [1.4, 0.8, 0.85],
    abdomenScale: [1.2, 0.95, 1],
    mandibleLength: 0.3,
    mandibleAngle: 0.7,
    mandibleThickness: 0.04,
    legLength: 0.65,
    legThickness: 0.025,
    overallScale: 0.85,
    modelScale: [0.88, 0.92, 1.25],  // narrow and elongated
    bodyColor: '#3A2008',
    legColor: '#241406',
    roughness: 0.32,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
    extras: ['hooked-mandibles'],
  }),

  // Apomyrma: tiny, pale amber, translucent, blind
  apomyrma: cfg({
    headScale: [0.8, 0.75, 0.8],
    thoraxScale: [0.95, 0.68, 0.72],
    abdomenScale: [0.88, 0.78, 0.82],
    mandibleLength: 0.08,
    mandibleAngle: 0.3,
    mandibleThickness: 0.018,
    legLength: 0.32,
    legThickness: 0.014,
    antennaLength: 0.28,
    overallScale: 0.4,
    modelScale: [0.85, 0.8, 0.9],  // tiny and delicate
    bodyColor: '#D4B888',
    legColor: '#C0A070',
    roughness: 0.25,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
    emissiveIntensity: 0.06,
    transmission: 0.55,
    thickness: 2.5,
    ior: 1.4,
    extras: ['blind', 'translucent-body'],
  }),

  // Trap-jaw: medium dark, distinctive elongated head for mandibles
  'trap-jaw': cfg({
    headScale: [1.1, 0.95, 1.05],
    thoraxScale: [1.2, 0.85, 0.9],
    abdomenScale: [1.05, 0.95, 1],
    mandibleLength: 0.55,
    mandibleAngle: 1.3,
    mandibleThickness: 0.03,
    legLength: 0.55,
    overallScale: 0.9,
    modelScale: [0.95, 1.0, 1.15],  // elongated head area
    bodyColor: '#2A1C12',
    legColor: '#1A100A',
    roughness: 0.3,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    extras: ['long-mandibles'],
  }),

  // Argentine: small, uniform light brown, slim
  argentine: cfg({
    headScale: [0.85, 0.8, 0.85],
    thoraxScale: [1.0, 0.7, 0.8],
    abdomenScale: [0.95, 0.85, 0.9],
    mandibleLength: 0.1,
    mandibleAngle: 0.35,
    mandibleThickness: 0.025,
    legLength: 0.4,
    legThickness: 0.018,
    antennaLength: 0.38,
    overallScale: 0.6,
    modelScale: [0.88, 0.85, 1.05],  // small and slim
    bodyColor: '#5C3A1E',
    legColor: '#3E2410',
    roughness: 0.42,
  }),

  // Acacia: slender, golden-amber, very long legs
  acacia: cfg({
    headScale: [0.85, 0.8, 0.85],
    thoraxScale: [1.3, 0.65, 0.75],
    abdomenScale: [0.9, 0.8, 0.85],
    mandibleLength: 0.15,
    mandibleAngle: 0.45,
    mandibleThickness: 0.03,
    legLength: 0.75,
    legThickness: 0.018,
    antennaLength: 0.5,
    overallScale: 0.8,
    modelScale: [0.82, 0.88, 1.18],  // very slender, elongated
    bodyColor: '#C49030',
    legColor: '#9A7020',
    roughness: 0.3,
    sheenColor: '#D4A840',
    specularIntensity: 0.8,
    extras: ['stinger'],
  }),

  // Giant Hunting: large, robust, very dark with metallic sheen
  'giant-hunting': cfg({
    headScale: [1.1, 1.0, 1.05],
    thoraxScale: [1.3, 0.9, 0.95],
    abdomenScale: [1.2, 1.05, 1.1],
    mandibleLength: 0.22,
    mandibleAngle: 0.55,
    mandibleThickness: 0.06,
    legLength: 0.6,
    legThickness: 0.032,
    antennaLength: 0.42,
    overallScale: 1.1,
    modelScale: [1.12, 1.1, 1.05],  // robust and large
    bodyColor: '#1A0A02',
    legColor: '#100602',
    roughness: 0.28,
    metalness: 0.18,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
    iridescence: 0.15,
    extras: ['stinger'],
  }),

  // Bulldog: largest, very wide head, jet black, extremely glossy
  bulldog: cfg({
    headScale: [1.3, 1.1, 1.2],
    thoraxScale: [1.35, 0.95, 1.05],
    abdomenScale: [1.3, 1.15, 1.2],
    mandibleLength: 0.45,
    mandibleAngle: 1.0,
    mandibleThickness: 0.05,
    legLength: 0.7,
    legThickness: 0.035,
    antennaLength: 0.45,
    overallScale: 1.4,
    modelScale: [1.25, 1.1, 1.0],  // very wide, big head dominance
    bodyColor: '#120808',
    legColor: '#0A0404',
    roughness: 0.22,
    metalness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    iridescence: 0.25,
    specularIntensity: 1.2,
    sssAttenuationColor: '#200808',
    extras: ['large-eyes', 'stinger', 'long-mandibles'],
  }),

  // Dracula: medium, reddish-brown, distinct coloring
  dracula: cfg({
    headScale: [1.0, 0.9, 0.95],
    thoraxScale: [1.15, 0.8, 0.85],
    abdomenScale: [1.05, 0.9, 0.95],
    mandibleLength: 0.2,
    mandibleAngle: 0.4,
    mandibleThickness: 0.035,
    legLength: 0.5,
    legThickness: 0.025,
    antennaLength: 0.35,
    overallScale: 0.85,
    modelScale: [1.0, 0.95, 1.05],
    bodyColor: '#8A5A28',
    legColor: '#6A4018',
    roughness: 0.38,
    extras: ['snap-mandibles'],
  }),

  // Discothyrea: tiny, round, warm brown
  discothyrea: cfg({
    headScale: [0.8, 0.75, 0.8],
    thoraxScale: [0.95, 0.7, 0.75],
    abdomenScale: [0.9, 0.8, 0.85],
    mandibleLength: 0.08,
    mandibleAngle: 0.3,
    mandibleThickness: 0.02,
    legLength: 0.35,
    legThickness: 0.015,
    antennaLength: 0.3,
    overallScale: 0.5,
    modelScale: [1.05, 1.0, 0.85],  // compact, rounded
    bodyColor: '#7A5C3C',
    legColor: '#5A4028',
    roughness: 0.48,
    extras: ['small-eyes'],
  }),

  // Leptanilla (Ghost Ant): tiniest, pale cream, translucent
  leptanilla: cfg({
    headScale: [0.75, 0.7, 0.75],
    thoraxScale: [0.9, 0.6, 0.7],
    abdomenScale: [0.85, 0.75, 0.8],
    mandibleLength: 0.08,
    mandibleAngle: 0.3,
    mandibleThickness: 0.015,
    legLength: 0.3,
    legThickness: 0.012,
    antennaLength: 0.28,
    overallScale: 0.35,
    modelScale: [0.8, 0.75, 0.95],  // tiny, delicate, elongated
    bodyColor: '#E8D8C0',
    legColor: '#D0C0A8',
    roughness: 0.25,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
    emissiveIntensity: 0.08,
    transmission: 0.6,
    thickness: 2.5,
    ior: 1.4,
    extras: ['blind', 'translucent-body'],
  }),

  // Sri Lankan Relict: amber-golden, medium-small
  'sri-lankan-relict': cfg({
    headScale: [0.9, 0.85, 0.88],
    thoraxScale: [1.05, 0.75, 0.82],
    abdomenScale: [0.95, 0.85, 0.9],
    mandibleLength: 0.13,
    mandibleAngle: 0.4,
    mandibleThickness: 0.03,
    legLength: 0.42,
    legThickness: 0.02,
    antennaLength: 0.36,
    overallScale: 0.6,
    modelScale: [0.95, 0.9, 1.0],
    bodyColor: '#B09030',
    legColor: '#8A7020',
    roughness: 0.4,
    sheenColor: '#D4B04E',
    specularIntensity: 0.7,
  }),

  // Martialis (Mars Ant): pale, blind, translucent, elongated mandibles
  martialis: cfg({
    headScale: [0.85, 0.8, 0.85],
    thoraxScale: [1.0, 0.7, 0.78],
    abdomenScale: [0.9, 0.8, 0.85],
    mandibleLength: 0.25,
    mandibleAngle: 0.6,
    mandibleThickness: 0.025,
    legLength: 0.38,
    legThickness: 0.016,
    antennaLength: 0.32,
    overallScale: 0.55,
    modelScale: [0.85, 0.82, 1.1],  // slender, elongated
    bodyColor: '#CCA878',
    legColor: '#B09060',
    roughness: 0.3,
    clearcoat: 0.45,
    clearcoatRoughness: 0.3,
    emissiveIntensity: 0.05,
    transmission: 0.35,
    thickness: 2.0,
    ior: 1.4,
    extras: ['blind', 'elongated-mandibles'],
  }),

  /* ─── Prehistoric / Extinct Species (for Origin timeline) ─── */

  'hymenoptera-ancestor': cfg({
    headScale: [0.85, 0.8, 0.85],
    thoraxScale: [1.5, 0.7, 0.8],
    abdomenScale: [1.4, 1.1, 1.1],
    overallScale: 0.8,
    modelScale: [0.9, 0.95, 1.15],
    bodyColor: '#4a3820',
    legColor: '#3a2a14',
    roughness: 0.45,
    extras: [],
  }),

  'proto-ant-wasp': cfg({
    headScale: [0.9, 0.85, 0.9],
    thoraxScale: [1.4, 0.75, 0.85],
    abdomenScale: [1.3, 1.05, 1.05],
    overallScale: 0.75,
    modelScale: [0.85, 0.9, 1.2],
    bodyColor: '#5a4020',
    legColor: '#403018',
    roughness: 0.4,
    clearcoat: 0.6,
    extras: ['stinger'],
  }),

  'sphecomyrma': cfg({
    headScale: [1.0, 0.9, 0.95],
    thoraxScale: [1.3, 0.8, 0.9],
    abdomenScale: [1.15, 0.95, 1.0],
    overallScale: 0.7,
    modelScale: [1.0, 0.95, 1.05],
    bodyColor: '#6a4a25',
    legColor: '#4a3218',
    roughness: 0.4,
    clearcoat: 0.65,
    extras: ['stinger'],
  }),

  'haidomyrmex': cfg({
    headScale: [1.2, 1.0, 1.1],
    thoraxScale: [1.2, 0.85, 0.9],
    abdomenScale: [1.1, 0.95, 1.0],
    overallScale: 0.8,
    modelScale: [1.1, 1.05, 1.0],
    bodyColor: '#3a2010',
    legColor: '#2a1408',
    roughness: 0.35,
    metalness: 0.15,
    clearcoat: 0.85,
    extras: ['hooked-mandibles', 'stinger'],
  }),

  'cretaceous-ant': cfg({
    headScale: [0.95, 0.88, 0.92],
    thoraxScale: [1.2, 0.8, 0.88],
    abdomenScale: [1.1, 0.95, 1.0],
    overallScale: 0.7,
    modelScale: [0.95, 0.92, 1.0],
    bodyColor: '#5a3818',
    legColor: '#3e2610',
    roughness: 0.4,
    extras: ['stinger'],
  }),

  'paleocene-ant': cfg({
    headScale: [0.9, 0.85, 0.9],
    thoraxScale: [1.15, 0.8, 0.85],
    abdomenScale: [1.05, 0.9, 0.95],
    overallScale: 0.65,
    modelScale: [0.92, 0.9, 1.0],
    bodyColor: '#4a3218',
    legColor: '#321e0e',
    roughness: 0.42,
    extras: [],
  }),

  'amber-ant': cfg({
    headScale: [0.9, 0.85, 0.9],
    thoraxScale: [1.1, 0.78, 0.82],
    abdomenScale: [1.0, 0.88, 0.92],
    overallScale: 0.6,
    modelScale: [0.9, 0.88, 1.0],
    bodyColor: '#8a6a38',
    legColor: '#6a4e28',
    roughness: 0.3,
    clearcoat: 0.8,
    transmission: 0.15,
    thickness: 1.5,
    ior: 1.5,
    extras: [],
  }),
};

// Default fallback
export function getSpeciesConfig(speciesId) {
  return speciesConfigs[speciesId] || BASE;
}
