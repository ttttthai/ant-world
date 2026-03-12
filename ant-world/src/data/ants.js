export const timelineEvents = [
  {
    year: '168 MYA',
    yearNum: -168,
    title: 'Hymenoptera Ancestors',
    description: 'The earliest ancestors of ants belong to the order Hymenoptera, which includes wasps, bees, and sawflies. These ancient insects begin diversifying during the Jurassic period.',
    era: 'Jurassic',
    icon: '🪨',
  },
  {
    year: '130 MYA',
    yearNum: -130,
    title: 'Proto-Ant Wasps',
    description: 'Wasp-like ancestors begin developing social behaviors. Some solitary wasps start nesting in groups, laying the groundwork for eusociality.',
    era: 'Early Cretaceous',
    icon: '🐝',
  },
  {
    year: '100 MYA',
    yearNum: -100,
    title: 'Sphecomyrma — The First True Ant',
    description: 'Discovered in New Jersey amber, Sphecomyrma freyi is one of the oldest known true ants. It has a mix of ant and wasp features — a metapleural gland (unique to ants) but wasp-like mandibles.',
    era: 'Mid-Cretaceous',
    icon: '🐜',
  },
  {
    year: '92 MYA',
    yearNum: -92,
    title: 'Haidomyrmex — Hell Ants',
    description: 'Bizarre "hell ants" with upward-facing mandibles and horn-like appendages. They used a unique snap-trap mechanism to capture prey, unlike any modern ant.',
    era: 'Late Cretaceous',
    icon: '⚔️',
  },
  {
    year: '80 MYA',
    yearNum: -80,
    title: 'Ant Diversification Begins',
    description: 'Ants begin diversifying into multiple lineages. The rise of flowering plants (angiosperms) creates new ecological niches that ants exploit for food and nesting.',
    era: 'Late Cretaceous',
    icon: '🌿',
  },
  {
    year: '66 MYA',
    yearNum: -66,
    title: 'K-Pg Extinction Event',
    description: 'The asteroid impact wipes out 75% of species. Ants survive and thrive in the aftermath, filling ecological niches left by extinct insects.',
    era: 'End Cretaceous',
    icon: '☄️',
  },
  {
    year: '60 MYA',
    yearNum: -60,
    title: 'Explosive Radiation',
    description: 'Post-extinction, ants undergo a massive evolutionary radiation. Most modern subfamilies originate during this period. Ant biomass begins its climb to ecological dominance.',
    era: 'Paleocene',
    icon: '💥',
  },
  {
    year: '50 MYA',
    yearNum: -50,
    title: 'Formicinae & Myrmicinae Rise',
    description: 'The two largest ant subfamilies emerge and diversify. Formicinae develop formic acid defenses. Myrmicinae develop stingers. These groups will become the most species-rich.',
    era: 'Eocene',
    icon: '🧬',
  },
  {
    year: '45 MYA',
    yearNum: -45,
    title: 'Baltic Amber Forests',
    description: 'Thousands of ants are preserved in Baltic amber, giving us an incredible window into Eocene ant diversity. Over 100 ant species found in a single amber deposit.',
    era: 'Eocene',
    icon: '🪲',
  },
  {
    year: '30 MYA',
    yearNum: -30,
    title: 'Fungus Farming Begins',
    description: 'Attine ants in South America begin cultivating fungus gardens — agriculture 30 million years before humans. They develop complex symbioses with specific fungal species.',
    era: 'Oligocene',
    icon: '🍄',
  },
  {
    year: '20 MYA',
    yearNum: -20,
    title: 'Army Ants Emerge',
    description: 'Dorylinae army ants develop their iconic nomadic lifestyle — massive swarm raids, bivouac nesting, and queen dichthadiigyny. They become apex insect predators.',
    era: 'Miocene',
    icon: '⚡',
  },
  {
    year: '15 MYA',
    yearNum: -15,
    title: 'Leafcutter Specialization',
    description: 'Leafcutter ants (Atta & Acromyrmex) evolve from fungus-farming ancestors, developing elaborate leaf-harvesting to feed their fungal gardens — the most complex insect societies.',
    era: 'Miocene',
    icon: '🍃',
  },
  {
    year: '5 MYA',
    yearNum: -5,
    title: 'Modern Ant World',
    description: 'Most modern ant species have evolved. Ants now make up 15-20% of terrestrial animal biomass. Over 22,000 species span every continent except Antarctica.',
    era: 'Pliocene',
    icon: '🌍',
  },
  {
    year: 'Today',
    yearNum: 0,
    title: '22,000+ Species Strong',
    description: 'Ants are one of the most successful organisms on Earth. They farm, wage wars, build megastructures, herd livestock (aphids), and collectively outweigh all wild mammals combined.',
    era: 'Present',
    icon: '👑',
  },
];

export const species = [
  {
    id: 'leafcutter',
    name: 'Leafcutter Ant',
    scientificName: 'Atta cephalotes',
    subfamily: 'Myrmicinae',
    size: '2-14mm',
    color: '#8B4513',
    habitat: 'Tropical forests of Central & South America',
    diet: 'Fungus (grown on harvested leaves)',
    colonySize: '1-8 million',
    lifespan: 'Workers: 1-2 years, Queen: 20+ years',
    superpower: 'Agriculture',
    description: 'The original farmers. Leafcutter ants harvest fresh vegetation not to eat, but to cultivate fungus gardens deep underground. Their colonies feature sophisticated caste systems with workers of different sizes for cutting, carrying, gardening, and defense.',
    funFact: 'A single leafcutter colony can strip a tree bare overnight. Their underground nests can be 30 meters wide with thousands of chambers.',
    traits: { strength: 95, speed: 60, intelligence: 90, aggression: 40, social: 100 },

    // Basic Identification
    genus: 'Atta',
    distribution: 'Central & South America, southern Mexico to northern Argentina',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '1-5 mg (minors) to 30-60 mg (majors)',
    morphology: 'Polymorphic with distinct castes: minima, minor, media, major, and soldier',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'moderate',

    // Strength & Performance
    carryingCapacity: '50x',
    biteForce: 'strong',
    runningSpeed: 'moderate',
    climbingAbility: 'excellent',
    cooperativeTransport: 'advanced',

    // Reproduction
    eggLayingRate: '3,000-5,000/day',
    colonyGrowthSpeed: 'moderate',
    matingBehavior: 'Nuptial flights; queen carries fungus pellet to start new garden',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'very complex',
    workerCastes: 'minima (gardeners), minor (foragers), media (generalists), major (defenders)',
    nestComplexity: 'very complex',

    // Social Intelligence
    communicationMethod: 'Complex pheromone trails with stridulation vibrations for leaf quality signaling',
    collectiveDecisionMaking: 'advanced',
    foragingStrategy: 'Trail-based mass recruitment with scouts selecting optimal leaf sources',
    navigationAbility: 'excellent',
    taskSpecialization: 'very high',

    // Survival & Resilience
    temperatureTolerance: 'moderate',
    floodSurvival: 'moderate',
    foodAdaptability: 'specialist',
    predatorResistance: 'good',
    colonyHygiene: 'exceptional',

    // Defense & Aggression
    defenseMechanism: 'Mandible bite, soldier caste with enlarged heads, alarm pheromones',
    raidBehavior: 'none',
    territorialBehavior: 'moderate',

    // Ecological Role
    soilEngineering: 'major',
    seedDispersal: 'minor',
    symbioticRelationships: 'Obligate mutualism with Leucoagaricus fungus; co-evolved antibiotic-producing Pseudonocardia bacteria',
    invasivePotential: 'low',

    // Interesting Behavioral Traits
    farmingAbility: 'Fungus farming — the most advanced insect agriculture, cultivated for 30+ million years',
    engineeringAbility: 'Massive underground nests up to 30m wide with thousands of chambers and ventilation shafts',
    collectiveProblemSolving: 'advanced',
    warStrategy: 'Defensive only; soldiers guard trails and nest entrances',
    disasterSurvival: 'Deep nest retreat; colony extends several meters underground',
  },
  {
    id: 'bullet',
    name: 'Bullet Ant',
    scientificName: 'Paraponera clavata',
    subfamily: 'Paraponerinae',
    size: '18-30mm',
    color: '#2F1B14',
    habitat: 'Rainforests of Central & South America',
    diet: 'Nectar, small arthropods',
    colonySize: '1,000-3,000',
    lifespan: 'Workers: 1 year, Queen: unknown',
    superpower: 'Most painful sting',
    description: 'Named for their sting that feels like being shot. The bullet ant possesses the most painful insect sting in the world, rated 4+ on the Schmidt Pain Index. Despite their fearsome reputation, they are relatively docile unless provoked.',
    funFact: 'The Sateré-Mawé tribe uses bullet ant stings in warrior initiation rites — boys must wear gloves filled with stinging ants for 10 minutes.',
    traits: { strength: 85, speed: 50, intelligence: 60, aggression: 70, social: 40 },

    // Basic Identification
    genus: 'Paraponera',
    distribution: 'Nicaragua to Paraguay, lowland tropical rainforests',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '200-300 mg',
    morphology: 'Monomorphic, robust build with thick legs and large pedicel',
    mandibleType: 'Crushing',
    exoskeletonStrength: 'very strong',

    // Strength & Performance
    carryingCapacity: '20x',
    biteForce: 'very strong',
    runningSpeed: 'slow',
    climbingAbility: 'good',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '50-100/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Nuptial flights from tree canopy; queens found solitary colonies',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers with minimal size variation',
    nestComplexity: 'moderate',

    // Social Intelligence
    communicationMethod: 'Pheromone trails and stridulatory alarm signals',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Individual foraging on tree canopy; workers forage alone or in small groups',
    navigationAbility: 'good',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'moderate',
    foodAdaptability: 'moderate',
    predatorResistance: 'excellent',
    colonyHygiene: 'good',

    // Defense & Aggression
    defenseMechanism: 'Poneratoxin venom sting (Schmidt Pain Index 4+), warning stridulation before stinging',
    raidBehavior: 'none',
    territorialBehavior: 'moderate',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'none',
    symbioticRelationships: 'None known; occasional mutualism with treehoppers for honeydew',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Simple nests at base of trees with shallow chambers',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Individual combat relying on powerful venom sting',
    disasterSurvival: 'Arboreal retreat; workers climb to canopy during flooding',
  },
  {
    id: 'weaver',
    name: 'Weaver Ant',
    scientificName: 'Oecophylla smaragdina',
    subfamily: 'Formicinae',
    size: '5-10mm',
    color: '#C17817',
    habitat: 'Tropical forests of Asia, Africa & Australia',
    diet: 'Insects, honeydew from scale insects',
    colonySize: '100,000-500,000',
    lifespan: 'Workers: 1-2 months, Queen: 8+ years',
    superpower: 'Living architecture',
    description: 'Master builders that create nests from living leaves. Worker ants form chains to pull leaves together while others use silk-producing larvae as living glue guns to bind the leaves. Their arboreal nests can span entire trees.',
    funFact: 'Weaver ants have been used as biological pest control in Chinese orchards for over 1,700 years — one of the oldest known biocontrol methods.',
    traits: { strength: 70, speed: 75, intelligence: 85, aggression: 80, social: 95 },

    // Basic Identification
    genus: 'Oecophylla',
    distribution: 'Tropical Asia, northern Australia, sub-Saharan Africa',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '5-10 mg (minor) to 15-20 mg (major)',
    morphology: 'Dimorphic; major workers with elongated bodies built for bridging and pulling',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'moderate',

    // Strength & Performance
    carryingCapacity: '100x',
    biteForce: 'strong',
    runningSpeed: 'fast',
    climbingAbility: 'excellent',
    cooperativeTransport: 'exceptional',

    // Reproduction
    eggLayingRate: '1,000-2,000/day',
    colonyGrowthSpeed: 'fast',
    matingBehavior: 'Nuptial flights; founding queens may cooperate initially then fight',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'complex',
    workerCastes: 'Major workers (foraging, defense, leaf pulling), minor workers (larval care, silk weaving)',
    nestComplexity: 'complex',

    // Social Intelligence
    communicationMethod: 'Pheromone recruitment with tactile chain signaling for cooperative tasks',
    collectiveDecisionMaking: 'advanced',
    foragingStrategy: 'Territorial patrol with aggressive prey capture; living chains to bridge gaps',
    navigationAbility: 'excellent',
    taskSpecialization: 'high',

    // Survival & Resilience
    temperatureTolerance: 'moderate',
    floodSurvival: 'good',
    foodAdaptability: 'moderate',
    predatorResistance: 'good',
    colonyHygiene: 'good',

    // Defense & Aggression
    defenseMechanism: 'Painful bite with formic acid application; coordinated swarming defense',
    raidBehavior: 'occasional',
    territorialBehavior: 'very high',

    // Ecological Role
    soilEngineering: 'none',
    seedDispersal: 'minor',
    symbioticRelationships: 'Mutualism with honeydew-producing hemipterans; used as biocontrol agents by humans',
    invasivePotential: 'low',

    // Interesting Behavioral Traits
    farmingAbility: 'Tends scale insects and aphids for honeydew',
    engineeringAbility: 'Silk leaf nests constructed using larvae as living looms; nests span entire tree canopies',
    collectiveProblemSolving: 'exceptional',
    warStrategy: 'Aggressive territorial raids on neighboring colonies; coordinated swarming attacks',
    disasterSurvival: 'Arboreal nesting protects from ground-level floods; colony spans multiple nest sites',
  },
  {
    id: 'armadillo',
    name: 'Armadillo Ant',
    scientificName: 'Tatuidris tatusia',
    subfamily: 'Agroecomyrmecinae',
    size: '3-4mm',
    color: '#8B6347',
    habitat: 'Leaf litter of tropical forests in Central & South America',
    diet: 'Unknown — likely soft-bodied soil arthropods',
    colonySize: 'Unknown, likely very small',
    lifespan: 'Unknown',
    superpower: 'Living fossil',
    description: 'One of the rarest and most enigmatic ant subfamilies. Tatuidris is named after the armadillo for its heavily sculptured, armored exoskeleton. These cryptic ants live deep in tropical leaf litter and are so rarely encountered that almost nothing is known about their biology.',
    funFact: 'Tatuidris was only described in 1999 and placed in its own subfamily. Its armored body and strange morphology make it one of the most unusual ants alive today.',
    traits: { strength: 45, speed: 20, intelligence: 30, aggression: 20, social: 35 },

    // Basic Identification
    genus: 'Tatuidris',
    distribution: 'Central and South America — from southern Mexico to Ecuador',
    primaryHabitat: 'tropical leaf litter',

    // Physical Characteristics
    workerWeight: '2-4 mg',
    morphology: 'Monomorphic; heavily sculptured and armored exoskeleton with thick cuticle',
    mandibleType: 'Short triangular',
    exoskeletonStrength: 'very strong',

    // Strength & Performance
    carryingCapacity: '10x',
    biteForce: 'moderate',
    runningSpeed: 'slow',
    climbingAbility: 'moderate',
    cooperativeTransport: 'unknown',

    // Reproduction
    eggLayingRate: 'unknown',
    colonyGrowthSpeed: 'unknown',
    matingBehavior: 'Unknown — no nuptial flights observed',

    // Colony Structure
    queenType: 'unknown',
    divisionOfLabor: 'unknown',
    workerCastes: 'Monomorphic workers only',
    nestComplexity: 'unknown',

    // Social Intelligence
    communicationMethod: 'Unknown — likely chemical',
    collectiveDecisionMaking: 'unknown',
    foragingStrategy: 'Cryptic soil foraging in deep leaf litter',
    navigationAbility: 'unknown',
    taskSpecialization: 'unknown',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'unknown',
    foodAdaptability: 'specialist',
    predatorResistance: 'excellent (armored)',
    colonyHygiene: 'unknown',

    // Defense & Aggression
    defenseMechanism: 'Heavily armored exoskeleton; curls body defensively',
    raidBehavior: 'none',
    territorialBehavior: 'unknown',

    // Ecological Role
    soilEngineering: 'unknown',
    seedDispersal: 'none',
    symbioticRelationships: 'None known; represents an ancient isolated lineage',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Unknown — nests deep in leaf litter and soil',
    collectiveProblemSolving: 'unknown',
    warStrategy: 'None known — relies on armored defense',
    disasterSurvival: 'Armored body provides physical protection; cryptic lifestyle avoids detection',
  },
  {
    id: 'heteroponera',
    name: 'Heteroponera Ant',
    scientificName: 'Heteroponera relicta',
    subfamily: 'Heteroponerinae',
    size: '4-7mm',
    color: '#5C4033',
    habitat: 'Temperate forests of Australia and South America',
    diet: 'Small arthropods and soft-bodied invertebrates',
    colonySize: '50-500',
    lifespan: 'Workers: 1-2 years, Queen: 5-10 years',
    superpower: 'Gondwanan relic',
    description: 'A living link to the ancient supercontinent Gondwana. Heteroponerinae ants are found in both Australia and South America, separated by millions of years of continental drift. These small, cryptic predators hunt through leaf litter in temperate forests.',
    funFact: 'The split distribution of Heteroponera across Australia and South America mirrors the breakup of Gondwana, making them one of the best examples of vicariance biogeography in ants.',
    traits: { strength: 50, speed: 40, intelligence: 45, aggression: 45, social: 40 },

    // Basic Identification
    genus: 'Heteroponera',
    distribution: 'Australia, New Zealand, and southern South America (Chile, Argentina)',
    primaryHabitat: 'temperate forest',

    // Physical Characteristics
    workerWeight: '3-8 mg',
    morphology: 'Monomorphic; compact body with distinctive petiole shape and stout mandibles',
    mandibleType: 'Triangular',
    exoskeletonStrength: 'moderate',

    // Strength & Performance
    carryingCapacity: '15x',
    biteForce: 'moderate',
    runningSpeed: 'moderate',
    climbingAbility: 'good',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '5-20/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Short-range mating flights; queen founds colony in soil or rotting wood',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers only',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Chemical signals; short-range pheromone recruitment',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Solitary hunting through leaf litter; ambush predators of small arthropods',
    navigationAbility: 'moderate',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'moderate',
    floodSurvival: 'moderate',
    foodAdaptability: 'moderate',
    predatorResistance: 'moderate',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Sting with mild venom; retreats into nest crevices',
    raidBehavior: 'none',
    territorialBehavior: 'low',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'none',
    symbioticRelationships: 'None known; important predator of small soil invertebrates',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Simple nests in soil, under stones, or in rotting wood',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Avoidance-based; small colonies relocate rather than fight',
    disasterSurvival: 'Cryptic nesting in protected microhabitats; cold-tolerant for temperate climates',
  },
  {
    id: 'army',
    name: 'Army Ant',
    scientificName: 'Eciton burchellii',
    subfamily: 'Dorylinae',
    size: '3-12mm',
    color: '#654321',
    habitat: 'Tropical rainforests of Central & South America',
    diet: 'Other insects, small vertebrates',
    colonySize: '200,000-700,000',
    lifespan: 'Workers: 1 year, Queen: 10+ years',
    superpower: 'Swarm intelligence raids',
    description: 'Nomadic predators that form massive raiding columns of hundreds of thousands. Army ants don\'t build permanent nests — instead, workers link their bodies together to form a living "bivouac" around the queen and brood.',
    funFact: 'Army ant swarm raids can be 20 meters wide and capture over 30,000 prey items per day. Other species including antbirds follow the swarms to catch fleeing insects.',
    traits: { strength: 75, speed: 85, intelligence: 80, aggression: 100, social: 95 },

    // Basic Identification
    genus: 'Eciton',
    distribution: 'Central & South America, from southern Mexico to northern Argentina',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '1-5 mg (minor) to 30-100 mg (soldier)',
    morphology: 'Polymorphic with extreme dimorphism; soldiers have massive hooked mandibles, workers are blind',
    mandibleType: 'Hook',
    exoskeletonStrength: 'moderate',

    // Strength & Performance
    carryingCapacity: '30x',
    biteForce: 'very strong',
    runningSpeed: 'fast',
    climbingAbility: 'good',
    cooperativeTransport: 'exceptional',

    // Reproduction
    eggLayingRate: '100,000-300,000/month (in statary phase)',
    colonyGrowthSpeed: 'fast',
    matingBehavior: 'Foreign males enter bivouac; queen mates inside colony, never flies after founding',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'very complex',
    workerCastes: 'Minor workers (prey processing), media (raiding column), major soldiers (column flanks, mandible hooks)',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Trail pheromones for swarm coordination; tactile communication in blind workers',
    collectiveDecisionMaking: 'exceptional',
    foragingStrategy: 'Massive swarm raids in fan-shaped columns; nomadic with alternating statary and nomadic phases',
    navigationAbility: 'moderate',
    taskSpecialization: 'very high',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'poor',
    foodAdaptability: 'specialist',
    predatorResistance: 'excellent',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Mass swarming with hooked mandibles; soldier caste with fish-hook jaws used as sutures by indigenous peoples',
    raidBehavior: 'constant',
    territorialBehavior: 'low',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'none',
    symbioticRelationships: 'Obligate army ant followers (antbirds, parasitic flies, beetles) depend on raids to flush prey',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Living bivouac nests — workers link bodies to form walls, chambers, and temperature-regulated brood spaces',
    collectiveProblemSolving: 'exceptional',
    warStrategy: 'Overwhelming swarm raids of 200,000+ workers sweeping 20m-wide front; consume all prey in path',
    disasterSurvival: 'Nomadic lifestyle allows relocation; bivouac restructuring adapts to conditions',
  },
  {
    id: 'apomyrma',
    name: 'Apomyrma Ant',
    scientificName: 'Apomyrma stygia',
    subfamily: 'Apomyrminae',
    size: '2-3mm',
    color: '#C4956A',
    habitat: 'Deep subterranean soils of West Africa',
    diet: 'Unknown — possibly ant brood raider',
    colonySize: 'Unknown, likely very small',
    lifespan: 'Unknown',
    superpower: 'Subterranean ghost',
    description: 'One of the most mysterious ants in existence. Apomyrma stygia lives entirely underground in the soils of West Africa and is so rarely collected that almost nothing is known about its natural history. Its name "stygia" refers to the River Styx — the underworld.',
    funFact: 'Apomyrma stygia has been collected fewer than a dozen times since its discovery. It is completely blind, pale, and may raid the brood of other ant species deep underground.',
    traits: { strength: 25, speed: 20, intelligence: 25, aggression: 30, social: 30 },

    // Basic Identification
    genus: 'Apomyrma',
    distribution: 'West Africa — Ivory Coast, Ghana, Cameroon',
    primaryHabitat: 'deep subterranean soil',

    // Physical Characteristics
    workerWeight: '1-2 mg',
    morphology: 'Monomorphic; pale, eyeless, with cylindrical body adapted for subterranean life',
    mandibleType: 'Short triangular',
    exoskeletonStrength: 'thin',

    // Strength & Performance
    carryingCapacity: 'unknown',
    biteForce: 'weak',
    runningSpeed: 'slow',
    climbingAbility: 'poor',
    cooperativeTransport: 'unknown',

    // Reproduction
    eggLayingRate: 'unknown',
    colonyGrowthSpeed: 'unknown',
    matingBehavior: 'Unknown — no mating flights observed; likely mates underground',

    // Colony Structure
    queenType: 'unknown',
    divisionOfLabor: 'unknown',
    workerCastes: 'Monomorphic workers only',
    nestComplexity: 'unknown',

    // Social Intelligence
    communicationMethod: 'Unknown — likely chemical and tactile',
    collectiveDecisionMaking: 'unknown',
    foragingStrategy: 'Subterranean foraging; possibly raids brood of other ant species',
    navigationAbility: 'unknown',
    taskSpecialization: 'unknown',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'unknown',
    foodAdaptability: 'specialist',
    predatorResistance: 'unknown',
    colonyHygiene: 'unknown',

    // Defense & Aggression
    defenseMechanism: 'Unknown; cryptic subterranean lifestyle avoids most predators',
    raidBehavior: 'possibly — may raid other ant brood',
    territorialBehavior: 'unknown',

    // Ecological Role
    soilEngineering: 'unknown',
    seedDispersal: 'none',
    symbioticRelationships: 'None known; one of the least studied ant genera',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Unknown — nests entirely subterranean',
    collectiveProblemSolving: 'unknown',
    warStrategy: 'None known — avoidance-based cryptic lifestyle',
    disasterSurvival: 'Deep subterranean lifestyle provides protection from surface disturbances',
  },
  {
    id: 'trap-jaw',
    name: 'Trap-Jaw Ant',
    scientificName: 'Odontomachus bauri',
    subfamily: 'Ponerinae',
    size: '8-15mm',
    color: '#5C4033',
    habitat: 'Tropical & subtropical regions worldwide',
    diet: 'Insects, small arthropods',
    colonySize: '200-1,000',
    lifespan: 'Workers: 1-2 years, Queen: 10+ years',
    superpower: 'Fastest strike in nature',
    description: 'Possesses the fastest self-powered predatory strike in the animal kingdom. Their mandibles snap shut at 126-230 km/h in just 0.13 milliseconds. They can also use this strike to launch themselves into the air to escape threats.',
    funFact: 'Trap-jaw ants can use their mandible strike against the ground to catapult themselves 8-40 cm into the air — a biological ejection seat.',
    traits: { strength: 80, speed: 100, intelligence: 70, aggression: 75, social: 50 },

    // Basic Identification
    genus: 'Odontomachus',
    distribution: 'Pantropical; Central & South America, southern US, Southeast Asia, Australia',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '10-20 mg',
    morphology: 'Monomorphic; elongated head with linear trigger-hair mandibles set at 180 degrees',
    mandibleType: 'Trap-jaw',
    exoskeletonStrength: 'strong',

    // Strength & Performance
    carryingCapacity: '20x',
    biteForce: 'extreme',
    runningSpeed: 'fast',
    climbingAbility: 'good',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '50-150/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Nuptial flights; some species reproduce via gamergates (mated workers)',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers; some colonies use gamergates instead of queens',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Short-range pheromone signals; tactile mandible-flick threat displays',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Solitary ambush hunting; workers wait motionless with mandibles open at 180 degrees',
    navigationAbility: 'good',
    taskSpecialization: 'moderate',

    // Survival & Resilience
    temperatureTolerance: 'moderate',
    floodSurvival: 'moderate',
    foodAdaptability: 'moderate',
    predatorResistance: 'good',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Mandible strike at 126-230 km/h; mandible-propelled jumping escape; venomous sting',
    raidBehavior: 'none',
    territorialBehavior: 'moderate',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'moderate',
    symbioticRelationships: 'Key seed disperser for some myrmecochorous plants; predator of small arthropods',
    invasivePotential: 'low',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Simple nests in soil or rotting wood with few chambers',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Mandible catapult escape — strikes ground to launch body 8-40 cm into the air to flee threats',
    disasterSurvival: 'Mandible-propelled ballistic escape allows rapid threat evasion',
  },
  {
    id: 'argentine',
    name: 'Argentine Ant',
    scientificName: 'Linepithema humile',
    subfamily: 'Dolichoderinae',
    size: '1.6-2.8mm',
    color: '#6B4226',
    habitat: 'Native to South America, now invasive worldwide',
    diet: 'Honeydew, sweet substances, insects',
    colonySize: 'Supercolonies of millions to billions',
    lifespan: 'Workers: 1 year, Queen: 10+ years',
    superpower: 'Supercolony networking',
    description: 'Argentine ants form the largest known animal cooperative structures on Earth. Multiple queens and interconnected nests create supercolonies spanning thousands of kilometers. They have displaced native ant species across six continents through sheer numbers and cooperation.',
    funFact: 'A single Argentine ant supercolony stretches over 6,000 km along the Mediterranean coast, containing billions of workers that all recognize each other as nestmates.',
    traits: { strength: 30, speed: 65, intelligence: 85, aggression: 60, social: 100 },

    // Basic Identification
    genus: 'Linepithema',
    distribution: 'Native to Parana River basin, South America; invasive across Mediterranean, California, Japan, Australia, South Africa',
    primaryHabitat: 'urban',

    // Physical Characteristics
    workerWeight: '0.5-1 mg',
    morphology: 'Monomorphic; small, uniform workers with light brown coloring and smooth cuticle',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'weak',

    // Strength & Performance
    carryingCapacity: '10x',
    biteForce: 'weak',
    runningSpeed: 'fast',
    climbingAbility: 'excellent',
    cooperativeTransport: 'advanced',

    // Reproduction
    eggLayingRate: '500-1,000/day (per queen; multiple queens per colony)',
    colonyGrowthSpeed: 'very fast',
    matingBehavior: 'Intranidal mating (within nest); queens rarely fly, budding is primary dispersal',

    // Colony Structure
    queenType: 'polygyne',
    divisionOfLabor: 'moderate',
    workerCastes: 'Monomorphic workers with task allocation based on age and location',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Trail pheromones with low intercolonial aggression enabling supercolony formation',
    collectiveDecisionMaking: 'advanced',
    foragingStrategy: 'Dense trail networks with mass recruitment; exploitative competition through rapid monopolization',
    navigationAbility: 'good',
    taskSpecialization: 'moderate',

    // Survival & Resilience
    temperatureTolerance: 'wide',
    floodSurvival: 'moderate',
    foodAdaptability: 'extreme generalist',
    predatorResistance: 'poor',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Chemical deterrent secretions; overwhelm competitors through numerical superiority',
    raidBehavior: 'frequent',
    territorialBehavior: 'very high',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'minor',
    symbioticRelationships: 'Intense mutualism with honeydew-producing aphids and scale insects; displaces native ant communities',
    invasivePotential: 'extreme',

    // Interesting Behavioral Traits
    farmingAbility: 'Intensive aphid tending; protects and relocates aphid colonies to maximize honeydew production',
    engineeringAbility: 'Shallow interconnected nests with multiple entrances; supercolony networks spanning thousands of kilometers',
    collectiveProblemSolving: 'advanced',
    warStrategy: 'Numerical superiority and attrition warfare; no intracolonial aggression within supercolonies enables massive unified forces',
    disasterSurvival: 'Colony budding and polygyny ensure rapid recovery; supercolony redundancy prevents total collapse',
  },
  {
    id: 'acacia',
    name: 'Acacia Ant',
    scientificName: 'Pseudomyrmex ferrugineus',
    subfamily: 'Pseudomyrmecinae',
    size: '3-5mm',
    color: '#C49A3C',
    habitat: 'Central American dry forests, living inside acacia thorns',
    diet: 'Beltian bodies and nectar from host acacia trees',
    colonySize: '5,000-30,000',
    lifespan: 'Workers: 6 months, Queen: 5+ years',
    superpower: 'Symbiotic guardian',
    description: 'One of nature\'s most famous mutualists. Acacia ants live inside the swollen thorns of bullhorn acacia trees, receiving food and shelter in exchange for fierce defense. They attack any herbivore that touches the tree and even prune competing vegetation nearby.',
    funFact: 'Acacia ants are so protective that they will swarm and sting large mammals like cows and giraffes that try to browse on their host tree.',
    traits: { strength: 45, speed: 80, intelligence: 70, aggression: 90, social: 70 },

    // Basic Identification
    genus: 'Pseudomyrmex',
    distribution: 'Central America, from southern Mexico to Costa Rica',
    primaryHabitat: 'forest',

    // Physical Characteristics
    workerWeight: '1-3 mg',
    morphology: 'Monomorphic; slender elongated body with large eyes adapted for arboreal life',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'weak',

    // Strength & Performance
    carryingCapacity: '10x',
    biteForce: 'moderate',
    runningSpeed: 'very fast',
    climbingAbility: 'excellent',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '100-200/day',
    colonyGrowthSpeed: 'moderate',
    matingBehavior: 'Nuptial flights; founding queen colonizes empty acacia thorn',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers performing all tasks including patrol, defense, and pruning',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Alarm pheromones trigger rapid mass defense; tactile patrolling of host plant',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Continuous patrol of host tree surface; harvest Beltian bodies and extrafloral nectar',
    navigationAbility: 'good',
    taskSpecialization: 'moderate',

    // Survival & Resilience
    temperatureTolerance: 'moderate',
    floodSurvival: 'good',
    foodAdaptability: 'specialist',
    predatorResistance: 'moderate',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Painful sting; rapid mass swarming on any organism touching host tree',
    raidBehavior: 'none',
    territorialBehavior: 'very high',

    // Ecological Role
    soilEngineering: 'none',
    seedDispersal: 'none',
    symbioticRelationships: 'Obligate mutualism with bullhorn acacia: ants receive food (Beltian bodies, nectar) and shelter (hollow thorns); tree receives herbivore defense and competing plant removal',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None; entirely dependent on host acacia for food',
    engineeringAbility: 'Hollows out acacia thorns for nesting; prunes vegetation around host tree to eliminate competition',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Rapid swarming defense — attacks any herbivore from insects to large mammals that contacts the host tree',
    disasterSurvival: 'Arboreal nesting inside thorns provides shelter; colony fate tied to host tree survival',
  },
  {
    id: 'giant-hunting',
    name: 'Giant Hunting Ant',
    scientificName: 'Ectatomma tuberculatum',
    subfamily: 'Ectatomminae',
    size: '8-12mm',
    color: '#5B2A0C',
    habitat: 'Tropical forests of Central & South America',
    diet: 'Insects, fruit, nectar',
    colonySize: '200-2,000',
    lifespan: 'Workers: 1-2 years, Queen: 5+ years',
    superpower: 'Solitary hunter',
    description: 'A robust predatory ant that hunts alone rather than in swarms. Giant hunting ants are skilled individual foragers with excellent vision. They have a distinctive tuberculate (bumpy) body texture that gives them a rugged, armored appearance.',
    funFact: 'Unlike most ants, Ectatomma workers often hunt solo and can subdue prey nearly their own size using a combination of powerful mandibles and a venomous sting.',
    traits: { strength: 80, speed: 65, intelligence: 75, aggression: 70, social: 35 },

    // Basic Identification
    genus: 'Ectatomma',
    distribution: 'Central & South America, from Mexico to northern Argentina',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '15-30 mg',
    morphology: 'Monomorphic; robust tuberculate (bumpy) exoskeleton with well-developed eyes',
    mandibleType: 'Crushing',
    exoskeletonStrength: 'very strong',

    // Strength & Performance
    carryingCapacity: '20x',
    biteForce: 'strong',
    runningSpeed: 'moderate',
    climbingAbility: 'good',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '20-50/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Nuptial flights; some species have gamergates (reproductive workers)',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers with individual foraging specialization',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Short-range pheromone signals; visual orientation important for solitary foraging',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Solitary hunting; individual workers visually locate and subdue prey alone',
    navigationAbility: 'excellent',
    taskSpecialization: 'moderate',

    // Survival & Resilience
    temperatureTolerance: 'moderate',
    floodSurvival: 'moderate',
    foodAdaptability: 'generalist',
    predatorResistance: 'good',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Venomous sting combined with powerful mandible grip; armored exoskeleton deters predators',
    raidBehavior: 'none',
    territorialBehavior: 'moderate',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'moderate',
    symbioticRelationships: 'Generalist predator helping control arthropod populations; visits extrafloral nectaries',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None; occasionally tends hemipterans for honeydew',
    engineeringAbility: 'Simple shallow nests in soil with few chambers; some species nest in arboreal cavities',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Individual combat — solitary workers subdue prey nearly their own size with sting and mandibles',
    disasterSurvival: 'Shallow nest relocation; robust exoskeleton provides individual protection',
  },
  {
    id: 'bulldog',
    name: 'Bulldog Ant',
    scientificName: 'Myrmecia pyriformis',
    subfamily: 'Myrmeciinae',
    size: '15-40mm',
    color: '#2B1414',
    habitat: 'Forests and bushland of Australia',
    diet: 'Insects, nectar, honeydew',
    colonySize: '1,000-5,000',
    lifespan: 'Workers: 1-2 years, Queen: 15+ years',
    superpower: 'Jumping attack',
    description: 'Among the largest and most primitive living ants. Bulldog ants have exceptional vision, can jump several centimeters, and deliver one of the most painful ant stings. They are solitary hunters that rely on individual prowess rather than coordinated swarms.',
    funFact: 'Bulldog ants can leap 3-5 cm using their powerful legs, and their sting has caused confirmed human fatalities due to anaphylactic shock — making them one of the few ants truly dangerous to people.',
    traits: { strength: 90, speed: 85, intelligence: 65, aggression: 95, social: 25 },

    // Basic Identification
    genus: 'Myrmecia',
    distribution: 'Australia (endemic); one species in New Caledonia',
    primaryHabitat: 'forest',

    // Physical Characteristics
    workerWeight: '50-150 mg',
    morphology: 'Monomorphic; large body with elongated mandibles, prominent eyes, and powerful jumping legs',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'very strong',

    // Strength & Performance
    carryingCapacity: '30x',
    biteForce: 'very strong',
    runningSpeed: 'very fast',
    climbingAbility: 'excellent',
    cooperativeTransport: 'none',

    // Reproduction
    eggLayingRate: '50-100/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Nuptial flights; founding queens hunt independently to raise first brood',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers; all workers capable of solitary hunting and colony defense',
    nestComplexity: 'moderate',

    // Social Intelligence
    communicationMethod: 'Visual navigation primary; limited pheromone trail use; individual memory-based foraging',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Solitary visual hunting; workers independently locate and capture live prey',
    navigationAbility: 'excellent',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'wide',
    floodSurvival: 'moderate',
    foodAdaptability: 'moderate',
    predatorResistance: 'excellent',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Powerful venomous sting (can cause anaphylaxis in humans), jumping attacks, large mandible bite',
    raidBehavior: 'none',
    territorialBehavior: 'high',

    // Ecological Role
    soilEngineering: 'moderate',
    seedDispersal: 'minor',
    symbioticRelationships: 'Key predator of ground-dwelling arthropods; some species pollinate native flowers during nectar foraging',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None; purely predatory with supplemental nectar feeding',
    engineeringAbility: 'Underground nests with moderate complexity; some species build mound nests',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Individual combat using jumping attacks, powerful sting, and large mandibles; among the most primitive and aggressive ant lineages',
    disasterSurvival: 'Underground nesting provides shelter; individual resilience compensates for small colony size',
  },
  {
    id: 'dracula',
    name: 'Dracula Ant',
    scientificName: 'Mystrium camillae',
    subfamily: 'Amblyoponinae',
    size: '4-8mm',
    color: '#9B6B3A',
    habitat: 'Tropical forests of Madagascar & Southeast Asia',
    diet: 'Centipedes, other soil arthropods',
    colonySize: '50-1,000',
    lifespan: 'Workers: 1-2 years, Queen: unknown',
    superpower: 'Fastest animal movement',
    description: 'Named for their habit of feeding on the blood (hemolymph) of their own larvae — a practice called non-destructive cannibalism. The larvae survive and serve as a living food bank for the colony. Their mandible snap is the fastest known animal movement.',
    funFact: 'Dracula ant mandibles can snap shut at 90 m/s (200 mph), accelerating 5,000 times faster than gravity — the fastest animal movement ever recorded, surpassing even the mantis shrimp.',
    traits: { strength: 55, speed: 95, intelligence: 50, aggression: 60, social: 45 },

    // Basic Identification
    genus: 'Mystrium',
    distribution: 'Madagascar, Southeast Asia (Malaysia, Borneo), tropical Africa',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '5-15 mg',
    morphology: 'Monomorphic; stout body with uniquely shaped mandibles capable of spring-loaded snap closure',
    mandibleType: 'Snap',
    exoskeletonStrength: 'moderate',

    // Strength & Performance
    carryingCapacity: '15x',
    biteForce: 'extreme',
    runningSpeed: 'slow',
    climbingAbility: 'moderate',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '10-30/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Nuptial flights poorly documented; queens found colony in soil cavities',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers; all workers perform similar tasks',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Short-range chemical signals; primarily tactile communication in dark subterranean nests',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Subterranean group hunting of centipedes and other soil arthropods',
    navigationAbility: 'poor',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'poor',
    foodAdaptability: 'specialist',
    predatorResistance: 'moderate',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Mandible snap strike at 90 m/s (fastest animal movement); venomous sting',
    raidBehavior: 'none',
    territorialBehavior: 'low',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'none',
    symbioticRelationships: 'Non-destructive larval hemolymph feeding (adults puncture larval cuticle to drink hemolymph)',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None; practices non-destructive cannibalism — adults feed on larval hemolymph without killing larvae',
    engineeringAbility: 'Simple nests in rotting wood and soil; cryptic subterranean lifestyle',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Snap-mandible strike used for prey capture and defense; fastest known animal appendage movement',
    disasterSurvival: 'Subterranean nesting provides buffered microhabitat; small colony size limits resource needs',
  },
  {
    id: 'discothyrea',
    name: 'Discothyrea Ant',
    scientificName: 'Discothyrea testacea',
    subfamily: 'Proceratiinae',
    size: '1.5-2.5mm',
    color: '#8B6E4E',
    habitat: 'Leaf litter and soil of tropical & subtropical forests',
    diet: 'Arthropod eggs, especially spider eggs',
    colonySize: '50-200',
    lifespan: 'Workers: 1-2 years, Queen: unknown',
    superpower: 'Egg specialist predator',
    description: 'A tiny, cryptic ant that specializes in feeding on the eggs of other arthropods, particularly spiders. Discothyrea ants have reduced eyes and live in small colonies hidden deep within leaf litter and rotting wood, rarely venturing to the surface.',
    funFact: 'Discothyrea ants have such reduced eyes that they are nearly blind, relying almost entirely on chemical senses to navigate the dark world of leaf litter and soil.',
    traits: { strength: 20, speed: 25, intelligence: 40, aggression: 20, social: 30 },

    // Basic Identification
    genus: 'Discothyrea',
    distribution: 'Pantropical; tropical and subtropical forests of Africa, Asia, Americas, Australia',
    primaryHabitat: 'subterranean',

    // Physical Characteristics
    workerWeight: '0.2-0.5 mg',
    morphology: 'Monomorphic; tiny with reduced eyes (often single ommatidium), compact body, short antennae with clubbed tip',
    mandibleType: 'Crushing',
    exoskeletonStrength: 'weak',

    // Strength & Performance
    carryingCapacity: '5x',
    biteForce: 'weak',
    runningSpeed: 'slow',
    climbingAbility: 'poor',
    cooperativeTransport: 'none',

    // Reproduction
    eggLayingRate: '5-10/day',
    colonyGrowthSpeed: 'very slow',
    matingBehavior: 'Poorly known; likely intranidal mating with wingless or short-winged queens',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic tiny workers; minimal task differentiation',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Chemical signals in close contact; extremely short-range communication in confined spaces',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Cryptic searching through leaf litter and soil interstices for arthropod eggs',
    navigationAbility: 'poor',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'poor',
    foodAdaptability: 'specialist',
    predatorResistance: 'poor',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Cryptic behavior; avoids detection rather than active defense',
    raidBehavior: 'none',
    territorialBehavior: 'low',

    // Ecological Role
    soilEngineering: 'none',
    seedDispersal: 'none',
    symbioticRelationships: 'Specialist predator of spider eggs and other arthropod eggs in leaf litter microhabitat',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Minimal nest construction; occupies existing cavities in leaf litter and rotting wood',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Avoidance and crypsis; relies on small size and hidden lifestyle to avoid conflict',
    disasterSurvival: 'Deep leaf litter and soil provide buffered microhabitat; tiny size allows exploitation of minute spaces',
  },
  {
    id: 'leptanilla',
    name: 'Ghost Ant',
    scientificName: 'Leptanilla japonica',
    subfamily: 'Leptanillinae',
    size: '0.8-1.5mm',
    color: '#E8D8C0',
    habitat: 'Deep subterranean soil layers, found in Japan',
    diet: 'Geophilomorph centipedes',
    colonySize: '100-500',
    lifespan: 'Workers: unknown, Queen: unknown',
    superpower: 'Phantom of the underground',
    description: 'Among the smallest and most mysterious ants on Earth. Leptanilla are completely blind, pale, and live their entire lives underground. They are so rarely encountered that most species are known from only a handful of specimens.',
    funFact: 'Leptanilla queens feed on the hemolymph of their own larvae through specialized organs — a behavior so rare it was only confirmed through careful laboratory observation.',
    traits: { strength: 10, speed: 20, intelligence: 30, aggression: 15, social: 50 },

    // Basic Identification
    genus: 'Leptanilla',
    distribution: 'Mediterranean, Middle East, Japan, Southeast Asia; rarely collected worldwide',
    primaryHabitat: 'subterranean',

    // Physical Characteristics
    workerWeight: '0.05-0.2 mg',
    morphology: 'Monomorphic; extremely tiny, pale, completely eyeless with elongated body and short legs',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'weak',

    // Strength & Performance
    carryingCapacity: '5x',
    biteForce: 'weak',
    runningSpeed: 'slow',
    climbingAbility: 'poor',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '5-15/day',
    colonyGrowthSpeed: 'very slow',
    matingBehavior: 'Males are blind and wingless; mating occurs underground within or near nest',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic blind workers; all perform similar tasks in darkness',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Exclusively chemical and tactile communication in total darkness',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Group hunting of geophilomorph centipedes in deep soil; cooperative prey capture',
    navigationAbility: 'poor',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'poor',
    foodAdaptability: 'specialist',
    predatorResistance: 'poor',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Stinger present; primary defense is deep subterranean concealment',
    raidBehavior: 'none',
    territorialBehavior: 'low',

    // Ecological Role
    soilEngineering: 'none',
    seedDispersal: 'none',
    symbioticRelationships: 'Queen feeds on larval hemolymph through specialized exudatoria organs on larvae (queen larval hemolymph feeding)',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None; queen feeds on own larvae hemolymph via specialized larval feeding organs',
    engineeringAbility: 'Minimal; occupies deep soil interstices and natural cavities',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Cooperative centipede hunting — workers subdue prey many times their size through group effort',
    disasterSurvival: 'Deep subterranean lifestyle (several meters below surface) provides extreme environmental buffering',
  },
  {
    id: 'sri-lankan-relict',
    name: 'Sri Lankan Relict Ant',
    scientificName: 'Aneuretus simoni',
    subfamily: 'Aneuretinae',
    size: '2-3mm',
    color: '#C4A84E',
    habitat: 'Rainforests of Sri Lanka',
    diet: 'Small insects, honeydew',
    colonySize: '500-2,000',
    lifespan: 'Workers: unknown, Queen: unknown',
    superpower: 'Living fossil',
    description: 'The sole surviving species of the subfamily Aneuretinae, making it a true living fossil. Once found across the globe in the Eocene epoch, this lineage has been reduced to a single critically endangered species in the wet forests of Sri Lanka.',
    funFact: 'Aneuretus simoni is considered one of the rarest ants in the world. Its closest relatives are known only from 40-million-year-old fossils, making it a "living fossil" of immense scientific value.',
    traits: { strength: 25, speed: 35, intelligence: 40, aggression: 25, social: 55 },

    // Basic Identification
    genus: 'Aneuretus',
    distribution: 'Endemic to wet zone rainforests of southwestern Sri Lanka',
    primaryHabitat: 'tropical forest',

    // Physical Characteristics
    workerWeight: '0.5-1.5 mg',
    morphology: 'Monomorphic; small with primitive waist structure (single petiole with distinct post-petiole); wasp-like features',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'weak',

    // Strength & Performance
    carryingCapacity: '10x',
    biteForce: 'weak',
    runningSpeed: 'moderate',
    climbingAbility: 'moderate',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: '20-50/day',
    colonyGrowthSpeed: 'slow',
    matingBehavior: 'Nuptial flights during monsoon season; queens found colony in soil or rotting wood',

    // Colony Structure
    queenType: 'monogyne',
    divisionOfLabor: 'simple',
    workerCastes: 'Monomorphic workers with primitive social organization',
    nestComplexity: 'simple',

    // Social Intelligence
    communicationMethod: 'Basic pheromone trails; primitive chemical communication compared to derived ant lineages',
    collectiveDecisionMaking: 'basic',
    foragingStrategy: 'Small group foraging on leaf litter surface; generalist scavenging',
    navigationAbility: 'moderate',
    taskSpecialization: 'low',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'poor',
    foodAdaptability: 'moderate',
    predatorResistance: 'poor',
    colonyHygiene: 'moderate',

    // Defense & Aggression
    defenseMechanism: 'Vestigial sting; relies on crypsis and flight rather than active defense',
    raidBehavior: 'none',
    territorialBehavior: 'low',

    // Ecological Role
    soilEngineering: 'minor',
    seedDispersal: 'minor',
    symbioticRelationships: 'No specialized symbioses known; generalist leaf litter predator and scavenger',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None',
    engineeringAbility: 'Simple nests in soil and rotting wood; minimal structural elaboration',
    collectiveProblemSolving: 'basic',
    warStrategy: 'Avoidance; small colonies retreat from threats rather than engage',
    disasterSurvival: 'Critically endangered — habitat restricted to a few forest fragments; extremely vulnerable to deforestation',
  },
  {
    id: 'martialis',
    name: 'Martialis Ant',
    scientificName: 'Martialis heureka',
    subfamily: 'Martialinae',
    size: '2-3mm',
    color: '#D4B896',
    habitat: 'Subterranean soils of Amazon rainforest, Brazil',
    diet: 'Unknown, likely soft-bodied soil arthropods',
    colonySize: 'Unknown (only single specimens found)',
    lifespan: 'Unknown',
    superpower: 'Oldest living ant lineage',
    description: 'Discovered in 2003, Martialis heureka ("ant from Mars") is the most basal living ant lineage, branching off before all other living ants. It is pale, blind, and lives underground. Only a few specimens have ever been collected.',
    funFact: 'When Martialis heureka was discovered, its name literally translates to "ant from Mars, eureka!" because it was so unlike any known ant that scientists compared it to finding life on another planet.',
    traits: { strength: 15, speed: 20, intelligence: 25, aggression: 10, social: 30 },

    // Basic Identification
    genus: 'Martialis',
    distribution: 'Amazon rainforest, Manaus region, Brazil (known from a single locality)',
    primaryHabitat: 'subterranean',

    // Physical Characteristics
    workerWeight: '0.5-1 mg (estimated)',
    morphology: 'Monomorphic; pale, eyeless, elongated mandibles with two teeth; unique among all living ants',
    mandibleType: 'Cutting',
    exoskeletonStrength: 'weak',

    // Strength & Performance
    carryingCapacity: '5x',
    biteForce: 'weak',
    runningSpeed: 'slow',
    climbingAbility: 'poor',
    cooperativeTransport: 'basic',

    // Reproduction
    eggLayingRate: 'Unknown',
    colonyGrowthSpeed: 'unknown',
    matingBehavior: 'Unknown; males and queens undescribed; presumably subterranean mating',

    // Colony Structure
    queenType: 'unknown',
    divisionOfLabor: 'unknown',
    workerCastes: 'Only workers collected; caste system unknown',
    nestComplexity: 'unknown',

    // Social Intelligence
    communicationMethod: 'Presumably chemical and tactile in total darkness; details unknown',
    collectiveDecisionMaking: 'unknown',
    foragingStrategy: 'Unknown; likely subterranean predation of soft-bodied soil arthropods',
    navigationAbility: 'poor',
    taskSpecialization: 'unknown',

    // Survival & Resilience
    temperatureTolerance: 'narrow',
    floodSurvival: 'unknown',
    foodAdaptability: 'specialist',
    predatorResistance: 'poor',
    colonyHygiene: 'unknown',

    // Defense & Aggression
    defenseMechanism: 'Unknown; likely relies on subterranean concealment',
    raidBehavior: 'none',
    territorialBehavior: 'unknown',

    // Ecological Role
    soilEngineering: 'unknown',
    seedDispersal: 'none',
    symbioticRelationships: 'None known; represents the most basal living ant lineage, diverging before all other extant ants',
    invasivePotential: 'none',

    // Interesting Behavioral Traits
    farmingAbility: 'None known',
    engineeringAbility: 'Unknown; presumably simple subterranean nests in deep soil',
    collectiveProblemSolving: 'unknown',
    warStrategy: 'Unknown; extreme rarity prevents behavioral study',
    disasterSurvival: 'Deep subterranean lifestyle may buffer against surface disturbances; extremely rare and vulnerable',
  },
];

export const phylogeneticTree = {
  nodes: [
    { id: 0,  parentId: null, position: [0, -1, -10],    color: '#c19a6b', radius: 0.5,  dead: false }, // Hymenoptera Ancestors
    { id: 1,  parentId: 0,    position: [0, 0, -7.5],    color: '#c19a6b', radius: 0.45, dead: false }, // Proto-Ant Wasps
    { id: 2,  parentId: 1,    position: [0, 0.8, -5],    color: '#d4a650', radius: 0.55, dead: false }, // Sphecomyrma
    { id: 3,  parentId: 2,    position: [-3, 1.8, -4],   color: '#8b4a2a', radius: 0.35, dead: true  }, // Hell Ants (extinct)
    { id: 4,  parentId: 2,    position: [0.5, 1.5, -3],  color: '#c19a6b', radius: 0.45, dead: false }, // Ant Diversification
    { id: 5,  parentId: 4,    position: [0.5, 1.2, -1.5],color: '#e05530', radius: 0.55, dead: false }, // K-Pg Extinction
    { id: 6,  parentId: 5,    position: [0, 2, 0.5],     color: '#6cc610', radius: 0.6,  dead: false }, // Explosive Radiation
    { id: 7,  parentId: 6,    position: [-3, 3, 2.5],    color: '#6cc610', radius: 0.45, dead: false }, // Formicinae & Myrmicinae
    { id: 8,  parentId: 7,    position: [-4, 3.8, 3.5],  color: '#d4a650', radius: 0.35, dead: false }, // Baltic Amber
    { id: 9,  parentId: 6,    position: [3, 3.2, 3],     color: '#6cc610', radius: 0.4,  dead: false }, // Fungus Farming
    { id: 10, parentId: 6,    position: [0.5, 3.5, 4],   color: '#6cc610', radius: 0.4,  dead: false }, // Army Ants
    { id: 11, parentId: 9,    position: [4.5, 4.2, 5],   color: '#6cc610', radius: 0.38, dead: false }, // Leafcutter
    { id: 12, parentId: 6,    position: [-1, 3.8, 5.5],  color: '#6cc610', radius: 0.45, dead: false }, // Modern Ant World
    { id: 13, parentId: 12,   position: [0, 4.5, 7.5],   color: '#6cc610', radius: 0.55, dead: false }, // Today
  ],
};

export const colonyStructure = {
  chambers: [
    { id: 'entrance', name: 'Entrance', depth: 0, x: 50, y: 5, radius: 8, description: 'Guarded by soldier ants. Multiple entrances allow ventilation and emergency evacuation.', population: 'Soldiers, scouts' },
    { id: 'food-storage', name: 'Food Storage', depth: 1, x: 30, y: 20, radius: 12, description: 'Seeds, insect parts, and honeydew stored in dry chambers. Temperature and humidity carefully regulated.', population: '~500 workers' },
    { id: 'nursery-eggs', name: 'Egg Chamber', depth: 2, x: 65, y: 30, radius: 10, description: 'Eggs are kept at optimal humidity. Nurse ants constantly groom and relocate eggs for temperature regulation.', population: 'Nurses, eggs' },
    { id: 'nursery-larvae', name: 'Larva Nursery', depth: 2, x: 40, y: 40, radius: 11, description: 'Growing larvae are fed regurgitated food and sorted by age. Workers move them to follow temperature gradients.', population: 'Nurses, larvae' },
    { id: 'nursery-pupae', name: 'Pupae Chamber', depth: 2, x: 75, y: 45, radius: 9, description: 'Pupae develop in cocoons. The chamber is kept warmer than nurseries to speed metamorphosis.', population: 'Pupae, attendants' },
    { id: 'queen-chamber', name: "Queen's Chamber", depth: 3, x: 50, y: 60, radius: 14, description: 'The heart of the colony. The queen is constantly groomed, fed, and guarded. She can lay up to 1,500 eggs per day.', population: 'Queen, attendants' },
    { id: 'fungus-garden', name: 'Fungus Garden', depth: 2, x: 20, y: 50, radius: 13, description: 'Leafcutter colonies maintain elaborate fungus gardens. Workers carefully tend the fungal cultivar, weeding out parasites.', population: '~2,000 gardeners' },
    { id: 'waste', name: 'Waste Chamber', depth: 3, x: 85, y: 65, radius: 10, description: 'Dead ants, waste, and contaminated material are deposited far from living areas. Specialized workers handle waste exclusively.', population: 'Waste workers' },
    { id: 'winter', name: 'Deep Chambers', depth: 4, x: 50, y: 80, radius: 15, description: 'Deepest chambers maintain stable temperatures year-round. The colony retreats here during extreme weather. Can be 5+ meters deep.', population: 'Varies seasonally' },
  ],
  tunnels: [
    { from: 'entrance', to: 'food-storage' },
    { from: 'entrance', to: 'nursery-eggs' },
    { from: 'food-storage', to: 'nursery-larvae' },
    { from: 'food-storage', to: 'fungus-garden' },
    { from: 'nursery-eggs', to: 'nursery-larvae' },
    { from: 'nursery-larvae', to: 'nursery-pupae' },
    { from: 'nursery-larvae', to: 'queen-chamber' },
    { from: 'nursery-pupae', to: 'queen-chamber' },
    { from: 'queen-chamber', to: 'winter' },
    { from: 'queen-chamber', to: 'waste' },
    { from: 'fungus-garden', to: 'queen-chamber' },
    { from: 'waste', to: 'winter' },
  ],
};
