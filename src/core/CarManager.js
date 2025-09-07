import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class CarManager {
    constructor(scene) {
        this.scene = scene;
        this.cars = new Map();
        this.carModels = new Map();
        this.loader = new GLTFLoader();
        this.carDatabase = this.initializeCarDatabase();
        this.externalPacks = [];
        this.skinPresets = this.initializeSkinPresets();
        
        this.loadCarModels();
    }

    initializeCarDatabase() {
        return {
            sports: [
                {
                    id: 'ferrari-488',
                    name: 'Ferrari 488 GTB',
                    brand: 'Ferrari',
                    price: 250000,
                    topSpeed: 205,
                    acceleration: 3.0,
                    handling: 95,
                    rarity: 'legendary',
                    category: 'sports',
                    model: 'ferrari-488.glb',
                    description: 'A mid-engined sports car with exceptional performance and Italian styling.',
                    specs: {
                        engine: '3.9L V8 Twin Turbo',
                        power: '661 HP',
                        torque: '561 lb-ft',
                        weight: '1475 kg',
                        drivetrain: 'RWD'
                    }
                },
                {
                    id: 'lamborghini-huracan',
                    name: 'Lamborghini Huracán',
                    brand: 'Lamborghini',
                    price: 200000,
                    topSpeed: 201,
                    acceleration: 3.2,
                    handling: 92,
                    rarity: 'legendary',
                    category: 'sports',
                    model: 'lamborghini-huracan.glb',
                    description: 'A supercar that combines performance with everyday usability.',
                    specs: {
                        engine: '5.2L V10',
                        power: '602 HP',
                        torque: '413 lb-ft',
                        weight: '1422 kg',
                        drivetrain: 'AWD'
                    }
                },
                {
                    id: 'mclaren-720s',
                    name: 'McLaren 720S',
                    brand: 'McLaren',
                    price: 280000,
                    topSpeed: 212,
                    acceleration: 2.8,
                    handling: 98,
                    rarity: 'legendary',
                    category: 'sports',
                    model: 'mclaren-720s.glb',
                    description: 'A track-focused supercar with cutting-edge aerodynamics.',
                    specs: {
                        engine: '4.0L V8 Twin Turbo',
                        power: '710 HP',
                        torque: '568 lb-ft',
                        weight: '1283 kg',
                        drivetrain: 'RWD'
                    }
                }
            ],
            electric: [
                {
                    id: 'tesla-model-s-plaid',
                    name: 'Tesla Model S Plaid',
                    brand: 'Tesla',
                    price: 135000,
                    topSpeed: 200,
                    acceleration: 1.99,
                    handling: 90,
                    rarity: 'legendary',
                    category: 'electric',
                    model: 'tesla-model-s-plaid.glb',
                    description: 'Tri‑motor AWD electric super sedan.',
                    specs: { engine: 'Tri Motor Electric', power: '1020 HP', torque: '1050+ lb-ft', weight: '2162 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'rimac-nevera',
                    name: 'Rimac Nevera',
                    brand: 'Rimac',
                    price: 2200000,
                    topSpeed: 258,
                    acceleration: 1.85,
                    handling: 100,
                    rarity: 'mythic',
                    category: 'electric',
                    model: 'rimac-nevera.glb',
                    description: 'Quad‑motor hyper EV with blistering acceleration.',
                    specs: { engine: 'Quad Motor Electric', power: '1914 HP', torque: '1740 lb-ft', weight: '2150 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'porsche-taycan-turbo-s',
                    name: 'Porsche Taycan Turbo S',
                    brand: 'Porsche',
                    price: 185000,
                    topSpeed: 162,
                    acceleration: 2.6,
                    handling: 95,
                    rarity: 'epic',
                    category: 'electric',
                    model: 'porsche-taycan-turbo-s.glb',
                    description: 'Electric performance with Porsche dynamics.',
                    specs: { engine: 'Dual Motor Electric', power: '750 HP', torque: '774 lb-ft', weight: '2295 kg', drivetrain: 'AWD' }
                }
            ],
            offroad: [
                {
                    id: 'jeep-wrangler-rubicon',
                    name: 'Jeep Wrangler Rubicon',
                    brand: 'Jeep',
                    price: 45000,
                    topSpeed: 112,
                    acceleration: 6.7,
                    handling: 70,
                    rarity: 'common',
                    category: 'offroad',
                    model: 'jeep-wrangler-rubicon.glb',
                    description: 'Iconic 4x4 with locking diffs and solid axles.',
                    specs: { engine: '3.6L V6', power: '285 HP', torque: '260 lb-ft', weight: '1960 kg', drivetrain: '4x4' }
                },
                {
                    id: 'ford-raptor',
                    name: 'Ford F‑150 Raptor',
                    brand: 'Ford',
                    price: 78000,
                    topSpeed: 118,
                    acceleration: 5.5,
                    handling: 75,
                    rarity: 'rare',
                    category: 'offroad',
                    model: 'ford-raptor.glb',
                    description: 'High‑speed desert runner with long‑travel suspension.',
                    specs: { engine: '3.5L V6 Twin Turbo', power: '450 HP', torque: '510 lb-ft', weight: '2495 kg', drivetrain: '4x4' }
                },
                {
                    id: 'land-rover-defender',
                    name: 'Land Rover Defender',
                    brand: 'Land Rover',
                    price: 65000,
                    topSpeed: 119,
                    acceleration: 5.8,
                    handling: 78,
                    rarity: 'rare',
                    category: 'offroad',
                    model: 'land-rover-defender.glb',
                    description: 'Modern off‑roader with terrain response.',
                    specs: { engine: '3.0L I6 Turbo', power: '395 HP', torque: '406 lb-ft', weight: '2240 kg', drivetrain: 'AWD' }
                }
            ],
            rally: [
                {
                    id: 'lancia-delta-integrale',
                    name: 'Lancia Delta Integrale',
                    brand: 'Lancia',
                    price: 70000,
                    topSpeed: 137,
                    acceleration: 5.7,
                    handling: 88,
                    rarity: 'epic',
                    category: 'rally',
                    model: 'lancia-delta-integrale.glb',
                    description: 'Group A rally legend with AWD grip.',
                    specs: { engine: '2.0L I4 Turbo', power: '210 HP', torque: '220 lb-ft', weight: '1320 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'mitsubishi-evo-vi',
                    name: 'Mitsubishi Lancer Evolution VI',
                    brand: 'Mitsubishi',
                    price: 60000,
                    topSpeed: 150,
                    acceleration: 4.6,
                    handling: 90,
                    rarity: 'epic',
                    category: 'rally',
                    model: 'mitsubishi-evo-vi.glb',
                    description: 'Iconic AWD turbo sedan tuned for stages.',
                    specs: { engine: '2.0L I4 Turbo', power: '276 HP', torque: '274 lb-ft', weight: '1360 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'subaru-impreza-22b',
                    name: 'Subaru Impreza 22B',
                    brand: 'Subaru',
                    price: 160000,
                    topSpeed: 155,
                    acceleration: 4.5,
                    handling: 92,
                    rarity: 'legendary',
                    category: 'rally',
                    model: 'subaru-impreza-22b.glb',
                    description: 'Homologation hero with rally pedigree.',
                    specs: { engine: '2.2L H4 Turbo', power: '276 HP', torque: '268 lb-ft', weight: '1270 kg', drivetrain: 'AWD' }
                }
            ],
            classics: [
                {
                    id: 'ford-gt40',
                    name: 'Ford GT40',
                    brand: 'Ford',
                    price: 2000000,
                    topSpeed: 210,
                    acceleration: 3.9,
                    handling: 85,
                    rarity: 'mythic',
                    category: 'classics',
                    model: 'ford-gt40.glb',
                    description: 'Le Mans legend from the 60s.',
                    specs: { engine: '4.7L V8', power: '390 HP', torque: '385 lb-ft', weight: '1200 kg', drivetrain: 'RWD' }
                },
                {
                    id: 'toyota-2000gt',
                    name: 'Toyota 2000GT',
                    brand: 'Toyota',
                    price: 900000,
                    topSpeed: 135,
                    acceleration: 8.4,
                    handling: 80,
                    rarity: 'legendary',
                    category: 'classics',
                    model: 'toyota-2000gt.glb',
                    description: 'Sixties Japanese classic coupe.',
                    specs: { engine: '2.0L I6', power: '150 HP', torque: '130 lb-ft', weight: '1120 kg', drivetrain: 'RWD' }
                },
                {
                    id: 'chevrolet-bel-air-57',
                    name: 'Chevrolet Bel Air (1957)',
                    brand: 'Chevrolet',
                    price: 60000,
                    topSpeed: 120,
                    acceleration: 11.0,
                    handling: 65,
                    rarity: 'rare',
                    category: 'classics',
                    model: 'chevrolet-bel-air-57.glb',
                    description: 'Iconic 50s American cruiser.',
                    specs: { engine: '4.6L V8', power: '220 HP', torque: '300 lb-ft', weight: '1650 kg', drivetrain: 'RWD' }
                }
            ],
            water: [
                {
                    id: 'hydro-sprint',
                    name: 'Hydro Sprint',
                    brand: 'AquaTech',
                    price: 180000,
                    topSpeed: 120,
                    acceleration: 3.5,
                    handling: 85,
                    rarity: 'epic',
                    category: 'water',
                    model: 'hydro-sprint.glb',
                    description: 'High-speed water jet car.',
                    specs: { engine: 'Twin Jet', power: '800 HP', torque: '900 lb-ft', weight: '1100 kg', drivetrain: 'Jet' }
                }
            ],
            air: [
                {
                    id: 'sky-runner',
                    name: 'Sky Runner',
                    brand: 'AeroDrive',
                    price: 450000,
                    topSpeed: 250,
                    acceleration: 2.9,
                    handling: 80,
                    rarity: 'legendary',
                    category: 'air',
                    model: 'sky-runner.glb',
                    description: 'Propeller-assisted flying car.',
                    specs: { engine: 'Hybrid Prop', power: '1000 HP', torque: '700 lb-ft', weight: '1400 kg', drivetrain: 'AWD+Prop' }
                }
            ,
                {
                    id: 'porsche-911-gt3',
                    name: 'Porsche 911 GT3',
                    brand: 'Porsche',
                    price: 170000,
                    topSpeed: 198,
                    acceleration: 3.2,
                    handling: 96,
                    rarity: 'epic',
                    category: 'sports',
                    model: 'porsche-911-gt3.glb',
                    description: 'Track-focused icon with sublime handling.',
                    specs: { engine: '4.0L Flat-6', power: '502 HP', torque: '346 lb-ft', weight: '1435 kg', drivetrain: 'RWD' }
                },
                {
                    id: 'nissan-gtr',
                    name: 'Nissan GT-R',
                    brand: 'Nissan',
                    price: 115000,
                    topSpeed: 196,
                    acceleration: 2.9,
                    handling: 90,
                    rarity: 'epic',
                    category: 'sports',
                    model: 'nissan-gtr.glb',
                    description: 'Godzilla. Twin-turbo AWD legend.',
                    specs: { engine: '3.8L V6 Twin Turbo', power: '565 HP', torque: '467 lb-ft', weight: '1752 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'chevrolet-corvette-c8',
                    name: 'Chevrolet Corvette C8',
                    brand: 'Chevrolet',
                    price: 70000,
                    topSpeed: 194,
                    acceleration: 2.9,
                    handling: 88,
                    rarity: 'rare',
                    category: 'sports',
                    model: 'chevrolet-corvette-c8.glb',
                    description: 'Mid-engine American performance bargain.',
                    specs: { engine: '6.2L V8', power: '495 HP', torque: '470 lb-ft', weight: '1530 kg', drivetrain: 'RWD' }
                }
            ],
            luxury: [
                {
                    id: 'rolls-royce-ghost',
                    name: 'Rolls-Royce Ghost',
                    brand: 'Rolls-Royce',
                    price: 300000,
                    topSpeed: 155,
                    acceleration: 4.8,
                    handling: 75,
                    rarity: 'legendary',
                    category: 'luxury',
                    model: 'rolls-royce-ghost.glb',
                    description: 'The epitome of luxury and refinement.',
                    specs: {
                        engine: '6.6L V12 Twin Turbo',
                        power: '563 HP',
                        torque: '627 lb-ft',
                        weight: '2495 kg',
                        drivetrain: 'RWD'
                    }
                },
                {
                    id: 'bentley-continental',
                    name: 'Bentley Continental GT',
                    brand: 'Bentley',
                    price: 200000,
                    topSpeed: 207,
                    acceleration: 3.6,
                    handling: 85,
                    rarity: 'epic',
                    category: 'luxury',
                    model: 'bentley-continental.glb',
                    description: 'A grand tourer that combines luxury with performance.',
                    specs: {
                        engine: '6.0L W12 Twin Turbo',
                        power: '626 HP',
                        torque: '664 lb-ft',
                        weight: '2244 kg',
                        drivetrain: 'AWD'
                    }
                }
            ,
                {
                    id: 'maybach-s680',
                    name: 'Mercedes-Maybach S680',
                    brand: 'Mercedes-Maybach',
                    price: 230000,
                    topSpeed: 155,
                    acceleration: 4.4,
                    handling: 78,
                    rarity: 'legendary',
                    category: 'luxury',
                    model: 'maybach-s680.glb',
                    description: 'Ultra-luxury flagship with V12 smoothness.',
                    specs: { engine: '6.0L V12 Twin Turbo', power: '621 HP', torque: '738 lb-ft', weight: '2480 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'aston-martin-db11',
                    name: 'Aston Martin DB11',
                    brand: 'Aston Martin',
                    price: 200000,
                    topSpeed: 200,
                    acceleration: 3.7,
                    handling: 86,
                    rarity: 'epic',
                    category: 'luxury',
                    model: 'aston-martin-db11.glb',
                    description: 'Grand touring elegance and performance.',
                    specs: { engine: '5.2L V12 Twin Turbo', power: '630 HP', torque: '516 lb-ft', weight: '1870 kg', drivetrain: 'RWD' }
                }
            ],
            supercars: [
                {
                    id: 'bugatti-chiron',
                    name: 'Bugatti Chiron',
                    brand: 'Bugatti',
                    price: 3000000,
                    topSpeed: 261,
                    acceleration: 2.4,
                    handling: 100,
                    rarity: 'mythic',
                    category: 'supercars',
                    model: 'bugatti-chiron.glb',
                    description: 'The ultimate expression of automotive engineering.',
                    specs: {
                        engine: '8.0L W16 Quad Turbo',
                        power: '1479 HP',
                        torque: '1180 lb-ft',
                        weight: '1995 kg',
                        drivetrain: 'AWD'
                    }
                },
                {
                    id: 'koenigsegg-agera',
                    name: 'Koenigsegg Agera RS',
                    brand: 'Koenigsegg',
                    price: 2500000,
                    topSpeed: 278,
                    acceleration: 2.6,
                    handling: 99,
                    rarity: 'mythic',
                    category: 'supercars',
                    model: 'koenigsegg-agera.glb',
                    description: 'A hypercar that redefines the limits of performance.',
                    specs: {
                        engine: '5.0L V8 Twin Turbo',
                        power: '1160 HP',
                        torque: '944 lb-ft',
                        weight: '1395 kg',
                        drivetrain: 'RWD'
                    }
                }
            ,
                {
                    id: 'porsche-918-spyder',
                    name: 'Porsche 918 Spyder',
                    brand: 'Porsche',
                    price: 1500000,
                    topSpeed: 214,
                    acceleration: 2.5,
                    handling: 98,
                    rarity: 'mythic',
                    category: 'supercars',
                    model: 'porsche-918-spyder.glb',
                    description: 'Hybrid hypercar with astonishing grip.',
                    specs: { engine: '4.6L V8 Hybrid', power: '887 HP', torque: '944 lb-ft', weight: '1675 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'ferrari-laferrari',
                    name: 'Ferrari LaFerrari',
                    brand: 'Ferrari',
                    price: 1400000,
                    topSpeed: 217,
                    acceleration: 2.4,
                    handling: 99,
                    rarity: 'mythic',
                    category: 'supercars',
                    model: 'ferrari-laferrari.glb',
                    description: 'Hybrid V12 masterpiece of Maranello.',
                    specs: { engine: '6.3L V12 Hybrid', power: '950 HP', torque: '715 lb-ft', weight: '1585 kg', drivetrain: 'RWD' }
                }
            ],
            normal: [
                {
                    id: 'bmw-m3',
                    name: 'BMW M3',
                    brand: 'BMW',
                    price: 70000,
                    topSpeed: 180,
                    acceleration: 4.1,
                    handling: 88,
                    rarity: 'rare',
                    category: 'normal',
                    model: 'bmw-m3.glb',
                    description: 'A high-performance sedan with track-ready capabilities.',
                    specs: {
                        engine: '3.0L I6 Twin Turbo',
                        power: '473 HP',
                        torque: '406 lb-ft',
                        weight: '1730 kg',
                        drivetrain: 'RWD'
                    }
                },
                {
                    id: 'audi-rs6',
                    name: 'Audi RS6 Avant',
                    brand: 'Audi',
                    price: 110000,
                    topSpeed: 190,
                    acceleration: 3.6,
                    handling: 90,
                    rarity: 'epic',
                    category: 'normal',
                    model: 'audi-rs6.glb',
                    description: 'A high-performance wagon that combines practicality with speed.',
                    specs: {
                        engine: '4.0L V8 Twin Turbo',
                        power: '591 HP',
                        torque: '590 lb-ft',
                        weight: '2075 kg',
                        drivetrain: 'AWD'
                    }
                },
                {
                    id: 'mercedes-c63',
                    name: 'Mercedes-AMG C63 S',
                    brand: 'Mercedes-Benz',
                    price: 80000,
                    topSpeed: 180,
                    acceleration: 3.9,
                    handling: 87,
                    rarity: 'rare',
                    category: 'normal',
                    model: 'mercedes-c63.glb',
                    description: 'A powerful sedan with AMG performance and luxury.',
                    specs: {
                        engine: '4.0L V8 Twin Turbo',
                        power: '503 HP',
                        torque: '516 lb-ft',
                        weight: '1825 kg',
                        drivetrain: 'RWD'
                    }
                },
                {
                    id: 'honda-civic',
                    name: 'Honda Civic Type R',
                    brand: 'Honda',
                    price: 35000,
                    topSpeed: 169,
                    acceleration: 5.7,
                    handling: 85,
                    rarity: 'common',
                    category: 'normal',
                    model: 'honda-civic.glb',
                    description: 'A hot hatch that delivers exceptional value and performance.',
                    specs: {
                        engine: '2.0L I4 Turbo',
                        power: '306 HP',
                        torque: '295 lb-ft',
                        weight: '1420 kg',
                        drivetrain: 'FWD'
                    }
                },
                {
                    id: 'toyota-supra',
                    name: 'Toyota GR Supra',
                    brand: 'Toyota',
                    price: 50000,
                    topSpeed: 155,
                    acceleration: 4.1,
                    handling: 89,
                    rarity: 'rare',
                    category: 'normal',
                    model: 'toyota-supra.glb',
                    description: 'A sports car that brings back the legendary Supra name.',
                    specs: {
                        engine: '3.0L I6 Twin Turbo',
                        power: '382 HP',
                        torque: '368 lb-ft',
                        weight: '1541 kg',
                        drivetrain: 'RWD'
                    }
                }
                ,
                {
                    id: 'subaru-wrx-sti',
                    name: 'Subaru WRX STI',
                    brand: 'Subaru',
                    price: 40000,
                    topSpeed: 155,
                    acceleration: 5.2,
                    handling: 84,
                    rarity: 'rare',
                    category: 'normal',
                    model: 'subaru-wrx-sti.glb',
                    description: 'Rally-bred AWD performance sedan.',
                    specs: { engine: '2.5L H4 Turbo', power: '310 HP', torque: '290 lb-ft', weight: '1528 kg', drivetrain: 'AWD' }
                },
                {
                    id: 'ford-mustang-gt',
                    name: 'Ford Mustang GT',
                    brand: 'Ford',
                    price: 38000,
                    topSpeed: 155,
                    acceleration: 4.3,
                    handling: 82,
                    rarity: 'common',
                    category: 'normal',
                    model: 'ford-mustang-gt.glb',
                    description: 'Iconic American muscle with V8 soundtrack.',
                    specs: { engine: '5.0L V8', power: '450 HP', torque: '410 lb-ft', weight: '1680 kg', drivetrain: 'RWD' }
                },
                {
                    id: 'volkswagen-golf-r',
                    name: 'Volkswagen Golf R',
                    brand: 'Volkswagen',
                    price: 44000,
                    topSpeed: 155,
                    acceleration: 4.7,
                    handling: 86,
                    rarity: 'rare',
                    category: 'normal',
                    model: 'volkswagen-golf-r.glb',
                    description: 'All-weather hot hatch with DSG punch.',
                    specs: { engine: '2.0L I4 Turbo', power: '315 HP', torque: '295 lb-ft', weight: '1476 kg', drivetrain: 'AWD' }
                }
            ]
        };
    }

    async loadCarModels() {
        // For now, create placeholder models
        // In a real implementation, you would load actual 3D models
        console.log('Loading car models...');
        
        // Create placeholder models for each car
        Object.values(this.carDatabase).flat().forEach(carData => {
            const model = this.createPlaceholderModel(carData);
            this.carModels.set(carData.id, model);
        });
        
        console.log('Car models loaded successfully!');
    }

    initializeSkinPresets() {
        return {
            default: { label: 'Factory', material: { color: 0x808080, metalness: 0.7, roughness: 0.3 } },
            stealth: { label: 'Stealth Matte', material: { color: 0x111111, metalness: 0.2, roughness: 0.9 } },
            neon: { label: 'Neon Pulse', material: { color: 0x00ffff, metalness: 0.9, roughness: 0.2, emissive: 0x00ffff, emissiveIntensity: 0.2 } },
            gold: { label: 'Gold Chrome', material: { color: 0xffd700, metalness: 1.0, roughness: 0.05 } },
            crimson: { label: 'Crimson', material: { color: 0xcc1122, metalness: 0.8, roughness: 0.25 } }
        };
    }

    createPlaceholderModel(carData) {
        const car = new THREE.Group();
        
        // Car body with category-specific styling
        const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
        let bodyColor, bodyMaterial;
        
        switch (carData.category) {
            case 'sports':
                bodyColor = 0xff0000; // Red
                bodyMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: bodyColor,
                    metalness: 0.9,
                    roughness: 0.1,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1
                });
                break;
            case 'luxury':
                bodyColor = 0x000000; // Black
                bodyMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: bodyColor,
                    metalness: 0.8,
                    roughness: 0.2,
                    clearcoat: 1.0
                });
                break;
            case 'supercars':
                bodyColor = 0x0000ff; // Blue
                bodyMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: bodyColor,
                    metalness: 0.95,
                    roughness: 0.05,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.05
                });
                break;
            default:
                bodyColor = 0x808080; // Gray
                bodyMaterial = new THREE.MeshPhysicalMaterial({ 
                    color: bodyColor,
                    metalness: 0.7,
                    roughness: 0.3
                });
        }
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        car.add(body);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const wheelPositions = [
            { x: 1.2, y: -0.5, z: 0.8 },
            { x: -1.2, y: -0.5, z: 0.8 },
            { x: 1.2, y: -0.5, z: -0.8 },
            { x: -1.2, y: -0.5, z: -0.8 }
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            car.add(wheel);
        });
        
        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.2, 8, 6);
        const headlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.3
        });
        
        const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight1.position.set(2, 0.2, 0.5);
        car.add(headlight1);
        
        const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight2.position.set(2, 0.2, -0.5);
        car.add(headlight2);
        
        // Taillights
        const taillightGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        const taillightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.2
        });
        
        const taillight1 = new THREE.Mesh(taillightGeometry, taillightMaterial);
        taillight1.position.set(-2, 0.2, 0.5);
        car.add(taillight1);
        
        const taillight2 = new THREE.Mesh(taillightGeometry, taillightMaterial);
        taillight2.position.set(-2, 0.2, -0.5);
        car.add(taillight2);
        
        // Store car data
        car.userData = {
            carData: carData,
            isPlaceholder: true
        };
        
        return car;
    }

    getCarData(carId) {
        return Object.values(this.carDatabase).flat().find(car => car.id === carId);
    }

    getAllCarData() {
        return this.carDatabase;
    }

    // Car Packs system
    async loadCarPackFromUrl(url) {
        const res = await fetch(url);
        const pack = await res.json();
        this.mergeCarPack(pack);
        // Preload placeholder models for newly added cars
        Object.values(pack).flat().forEach(car => {
            if (!this.carModels.has(car.id)) {
                const model = this.createPlaceholderModel(car);
                this.carModels.set(car.id, model);
            }
        });
        this.externalPacks.push(url);
        return true;
    }

    mergeCarPack(pack) {
        Object.entries(pack).forEach(([category, cars]) => {
            if (!this.carDatabase[category]) this.carDatabase[category] = [];
            const existingIds = new Set(this.carDatabase[category].map(c => c.id));
            cars.forEach(car => {
                if (!existingIds.has(car.id)) this.carDatabase[category].push(car);
            });
        });
    }

    getCarModel(carId) {
        return this.carModels.get(carId);
    }

    createCarInstance(carId, position = new THREE.Vector3(0, 0, 0)) {
        const carData = this.getCarData(carId);
        const model = this.getCarModel(carId);
        
        if (!carData || !model) {
            console.error(`Car not found: ${carId}`);
            return null;
        }
        
        const carInstance = model.clone();
        carInstance.position.copy(position);
        carInstance.userData = {
            ...carInstance.userData,
            instanceId: this.generateInstanceId(),
            carData: carData,
            owner: null,
            isOwned: false
        };
        
        this.cars.set(carInstance.userData.instanceId, carInstance);
        this.scene.add(carInstance);
        
        return carInstance;
    }

    removeCarInstance(instanceId) {
        const car = this.cars.get(instanceId);
        if (car) {
            this.scene.remove(car);
            this.cars.delete(instanceId);
        }
    }

    updateCarInstance(instanceId, updates) {
        const car = this.cars.get(instanceId);
        if (car) {
            Object.assign(car.userData, updates);
        }
    }

    getCarInstance(instanceId) {
        return this.cars.get(instanceId);
    }

    getAllCarInstances() {
        return Array.from(this.cars.values());
    }

    // Car customization
    customizeCar(instanceId, customization) {
        const car = this.cars.get(instanceId);
        if (!car) return false;
        
        // Elemental effects (simple emissive tint)
        if (customization.element) {
            const elementColor = {
                fire: 0xff4500,
                water: 0x00bcd4,
                earth: 0x8d6e63,
                air: 0x90caf9
            }[customization.element] || 0xffffff;
            car.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.emissive = new THREE.Color(elementColor);
                    child.material.emissiveIntensity = 0.1;
                }
            });
            car.userData.element = customization.element;
        }

        // Combat attachments (placeholder geometry)
        if (customization.attachments) {
            const { spikes, guns, bombs } = customization.attachments;
            if (spikes) {
                const spike = new THREE.ConeGeometry(0.1, 0.5, 6);
                const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
                for (let i = -1; i <= 1; i++) {
                    const m = new THREE.Mesh(spike, mat);
                    m.position.set(2.1, -0.2, i * 0.6);
                    m.rotation.z = Math.PI / 2;
                    m.castShadow = true;
                    car.add(m);
                }
            }
            if (guns) {
                const barrel = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
                const mat = new THREE.MeshStandardMaterial({ color: 0x444444 });
                const left = new THREE.Mesh(barrel, mat);
                left.position.set(1.6, 0.2, 0.5);
                left.rotation.z = Math.PI / 2;
                const right = left.clone();
                right.position.z = -0.5;
                car.add(left);
                car.add(right);
            }
            if (bombs) {
                const sphere = new THREE.SphereGeometry(0.2, 12, 10);
                const mat = new THREE.MeshStandardMaterial({ color: 0x222222 });
                const bomb = new THREE.Mesh(sphere, mat);
                bomb.position.set(-1.8, -0.2, 0);
                car.add(bomb);
            }
        }

        // Apply color changes
        if (customization.color) {
            car.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (child.material.color) {
                        child.material.color.setHex(customization.color);
                    }
                }
            });
        }
        // Apply skin preset
        if (customization.skinId && this.skinPresets[customization.skinId]) {
            const preset = this.skinPresets[customization.skinId];
            const materialProps = preset.material || {};
            car.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (materialProps.color !== undefined && child.material.color) child.material.color.setHex(materialProps.color);
                    if (materialProps.metalness !== undefined) child.material.metalness = materialProps.metalness;
                    if (materialProps.roughness !== undefined) child.material.roughness = materialProps.roughness;
                    if (materialProps.emissive !== undefined) child.material.emissive = new THREE.Color(materialProps.emissive);
                    if (materialProps.emissiveIntensity !== undefined) child.material.emissiveIntensity = materialProps.emissiveIntensity;
                    child.material.needsUpdate = true;
                }
            });
            car.userData.activeSkinId = customization.skinId;
        }
        
        // Apply other customizations
        car.userData.customization = {
            ...car.userData.customization,
            ...customization
        };
        
        return true;
    }

    applySkinToCar(instanceId, skinId) {
        return this.customizeCar(instanceId, { skinId });
    }

    // Car performance calculations
    calculatePerformance(carData, customization = {}) {
        let performance = {
            topSpeed: carData.topSpeed,
            acceleration: carData.acceleration,
            handling: carData.handling
        };
        
        // Apply customization bonuses
        if (customization.engineUpgrade) {
            performance.topSpeed *= 1.1;
            performance.acceleration *= 0.9; // Better acceleration
        }
        
        if (customization.suspensionUpgrade) {
            performance.handling *= 1.15;
        }
        
        if (customization.aerodynamicsUpgrade) {
            performance.topSpeed *= 1.05;
            performance.handling *= 1.1;
        }
        
        return performance;
    }

    // Utility methods
    generateInstanceId() {
        return 'car_' + Math.random().toString(36).substr(2, 9);
    }

    formatCarSpecs(carData) {
        return {
            price: this.formatCurrency(carData.price),
            topSpeed: `${carData.topSpeed} mph`,
            acceleration: `${carData.acceleration}s 0-60`,
            handling: `${carData.handling}/100`,
            rarity: carData.rarity.toUpperCase()
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    update(deltaTime) {
        // Update car animations, physics, etc.
        this.cars.forEach(car => {
            // Rotate wheels if car is moving
            if (car.userData.isMoving) {
                car.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'CylinderGeometry') {
                        child.rotation.x += deltaTime * 10;
                    }
                });
            }

            // Neon skin emissive pulse animation
            if (car.userData.activeSkinId === 'neon') {
                const t = Date.now() * 0.003;
                const pulse = 0.15 + 0.1 * (1 + Math.sin(t));
                car.traverse((child) => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissiveIntensity = pulse;
                    }
                });
            }
        });
    }
}
