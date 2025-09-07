import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GameEngine } from './core/GameEngine.js';
import { CarManager } from './core/CarManager.js';
import { UIManager } from './core/UIManager.js';
import { NetworkManager } from './core/NetworkManager.js';
import { SaveManager } from './core/SaveManager.js';
import { PhysicsEngine } from './core/PhysicsEngine.js';
import { RaceManager } from './core/RaceManager.js';
import { AuctionManager } from './core/AuctionManager.js';
import { SingleplayerManager } from './core/SingleplayerManager.js';
import { CraftingManager } from './core/CraftingManager.js';
import { MissionsManager } from './core/MissionsManager.js';
import { AchievementsManager } from './core/AchievementsManager.js';
import { JunkyardManager } from './core/JunkyardManager.js';
import { MapManager } from './core/MapManager.js';
import { HomeManager } from './core/HomeManager.js';
import { BettingManager } from './core/BettingManager.js';
import { LeaderboardsManager } from './core/LeaderboardsManager.js';
import { CarBuilderManager } from './core/CarBuilderManager.js';
import { WeatherManager } from './core/WeatherManager.js';
import { DamageManager } from './core/DamageManager.js';
import { NPCManager } from './core/NPCManager.js';
import { TimeTrialManager } from './core/TimeTrialManager.js';
import { ChallengesManager } from './core/ChallengesManager.js';
import { ReplayManager } from './core/ReplayManager.js';
import { SettingsManager } from './core/SettingsManager.js';
import { MiniMapManager } from './core/MiniMapManager.js';
import { TuningManager } from './core/TuningManager.js';
import { EventsManager } from './core/EventsManager.js';
import { TelemetryManager } from './core/TelemetryManager.js';
import { DriftManager } from './core/DriftManager.js';
import { DevToolsManager } from './core/DevToolsManager.js';
import { CityShowroomManager } from './core/CityShowroomManager.js';
import { CityEventsManager } from './core/CityEventsManager.js';

class CarGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            alpha: true
        });
        
        this.clock = new THREE.Clock();
        this.isGameRunning = false;
        this.currentPlayer = null;
        this.gameState = {
            cars: new Map(),
            players: new Map(),
            auctions: new Map(),
            races: new Map()
        };

        this.init();
    }

    async init() {
        try {
            this.setupRenderer();
            this.setupScene();
            this.setupLighting();
            this.setupControls();
            this.setupPostProcessing();
            
            // Initialize core systems
            this.networkManager = new NetworkManager();
            this.carManager = new CarManager(this.scene);
            this.uiManager = new UIManager();
            this.saveManager = new SaveManager();
            this.physicsEngine = new PhysicsEngine();
            this.raceManager = new RaceManager(this.scene);
            this.auctionManager = new AuctionManager();
            this.singleplayerManager = new SingleplayerManager(this);
            this.craftingManager = new CraftingManager();
            this.missionsManager = new MissionsManager();
            this.achievementsManager = new AchievementsManager(this.carManager);
            this.junkyardManager = new JunkyardManager(this.scene);
            this.mapManager = new MapManager();
            this.homeManager = new HomeManager();
            this.bettingManager = new BettingManager();
            this.leaderboardsManager = new LeaderboardsManager();
            this.carBuilderManager = new CarBuilderManager(this.scene);
            this.weatherManager = new WeatherManager(this.scene);
            this.damageManager = new DamageManager();
            this.npcManager = new NPCManager(this.scene);
            this.leaderboardsManager = new LeaderboardsManager();
            this.timeTrialManager = new TimeTrialManager(this.raceManager, this.leaderboardsManager);
            this.challengesManager = new ChallengesManager();
            this.replayManager = new ReplayManager();
            this.settingsManager = new SettingsManager();
            this.miniMapManager = new MiniMapManager();
            this.tuningManager = new TuningManager();
            this.eventsManager = new EventsManager();
            this.telemetryManager = new TelemetryManager();
            this.driftManager = new DriftManager();
            this.devToolsManager = new DevToolsManager();
            this.cityShowroomManager = new CityShowroomManager();
            this.cityEventsManager = new CityEventsManager();
            
            // Load game assets
            await this.loadAssets();
            
            // Auto-load starter car pack (non-blocking)
            try {
                this.carManager.loadCarPackFromUrl('src/assets/cars-pack.sample.json');
            } catch (e) {
                console.warn('Starter car pack failed to load:', e);
            }

            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading screen
            document.getElementById('loadingScreen').classList.add('hidden');

            // Attach minimap
            const minimap = document.getElementById('minimap');
            if (minimap) this.miniMapManager.attach(minimap);

            // Attach telemetry HUD
            const hud = document.getElementById('telemetryHUD');
            if (hud) this.telemetryManager.attach(hud);
            
            // Start city events system
            this.cityEventsManager.start();
            
            // Load settings
            this.settingsManager.loadSettings();
            
            // Start game loop
            this.startGameLoop();
            
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to load game. Please refresh the page.');
        }
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }

    setupScene() {
        // Set background
        this.scene.background = new THREE.Color(0x87CEEB);
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a4a4a,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Create showroom environment
        this.createShowroomEnvironment();
    }

    createShowroomEnvironment() {
        // Create showroom building
        const showroomGeometry = new THREE.BoxGeometry(50, 20, 30);
        const showroomMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const showroom = new THREE.Mesh(showroomGeometry, showroomMaterial);
        showroom.position.set(0, 10, 0);
        showroom.castShadow = true;
        showroom.receiveShadow = true;
        this.scene.add(showroom);

        // Create display platforms
        for (let i = 0; i < 6; i++) {
            const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 16);
            const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            
            const angle = (i / 6) * Math.PI * 2;
            platform.position.set(
                Math.cos(angle) * 15,
                0.25,
                Math.sin(angle) * 15
            );
            platform.castShadow = true;
            platform.receiveShadow = true;
            this.scene.add(platform);
        }

        // Add decorative elements
        this.addDecorativeElements();
    }

    addDecorativeElements() {
        // Add some trees around the showroom
        for (let i = 0; i < 8; i++) {
            const tree = this.createTree();
            const angle = (i / 8) * Math.PI * 2;
            tree.position.set(
                Math.cos(angle) * 40,
                0,
                Math.sin(angle) * 40
            );
            this.scene.add(tree);
        }

        // Add lighting poles
        for (let i = 0; i < 4; i++) {
            const pole = this.createLightPole();
            const angle = (i / 4) * Math.PI * 2;
            pole.position.set(
                Math.cos(angle) * 25,
                0,
                Math.sin(angle) * 25
            );
            this.scene.add(pole);
        }
    }

    createTree() {
        const tree = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(3, 8, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 5;
        leaves.castShadow = true;
        tree.add(leaves);
        
        return tree;
    }

    createLightPole() {
        const pole = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.3, 8, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
        poleMesh.position.y = 4;
        poleMesh.castShadow = true;
        pole.add(poleMesh);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffaa,
            emissive: 0xffffaa,
            emissiveIntensity: 0.5
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.y = 8;
        pole.add(lightMesh);
        
        // Add actual light
        const light = new THREE.PointLight(0xffffaa, 1, 20);
        light.position.y = 8;
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        pole.add(light);
        
        return pole;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
        fillLight.position.set(-50, 30, -25);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xff6b6b, 0.2);
        rimLight.position.set(0, 20, -50);
        this.scene.add(rimLight);

        // Store references for weather control
        this._lightingRefs = { ambient: ambientLight, sun: directionalLight, rim: rimLight };
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 100;
        
        // Set initial camera position
        this.camera.position.set(20, 15, 20);
        this.controls.target.set(0, 0, 0);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);
    }

    async loadAssets() {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        // Load car models (placeholder for now - will be replaced with actual models)
        console.log('Loading car models...');
        
        // For now, create placeholder car models
        await this.createPlaceholderCars();
        
        console.log('Assets loaded successfully!');
    }

    async createPlaceholderCars() {
        // Create placeholder car models for different categories
        const carCategories = ['sports', 'luxury', 'supercars', 'normal'];
        
        for (let i = 0; i < carCategories.length; i++) {
            const category = carCategories[i];
            const car = this.createPlaceholderCar(category, i);
            
            // Position cars on display platforms
            const angle = (i / carCategories.length) * Math.PI * 2;
            car.position.set(
                Math.cos(angle) * 15,
                1,
                Math.sin(angle) * 15
            );
            
            this.scene.add(car);
        }
    }

    createPlaceholderCar(category, index) {
        const car = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
        let bodyColor;
        
        switch (category) {
            case 'sports':
                bodyColor = 0xff0000; // Red
                break;
            case 'luxury':
                bodyColor = 0x000000; // Black
                break;
            case 'supercars':
                bodyColor = 0x0000ff; // Blue
                break;
            default:
                bodyColor = 0x808080; // Gray
        }
        
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: bodyColor,
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        car.add(body);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
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
        
        // Add some details
        const detailGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const detailMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        // Headlights
        const headlight1 = new THREE.Mesh(detailGeometry, detailMaterial);
        headlight1.position.set(2, 0.2, 0.5);
        car.add(headlight1);
        
        const headlight2 = new THREE.Mesh(detailGeometry, detailMaterial);
        headlight2.position.set(2, 0.2, -0.5);
        car.add(headlight2);
        
        // Store car data
        car.userData = {
            category: category,
            index: index,
            isPlaceholder: true
        };
        
        return car;
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // UI event listeners
        this.setupUIEventListeners();
        
        // Keyboard controls
        this.setupKeyboardControls();
        
        // Network events
        this.setupNetworkEvents();

        // Game bus events
        this.setupGameEventBus();
    }

    setupGameEventBus() {
        // Map toggle
        window.addEventListener('map:requestToggle', () => {
            this.mapManager.toggle();
        });

        // Crafting
        window.addEventListener('craft:attempt', (e) => {
            const { itemId } = e.detail || {};
            const result = this.craftingManager.craft(itemId);
            if (result.success) {
                this.uiManager.showNotification(`Crafted ${itemId}!`, 'info');
                // Mission progress and rewards placeholder
            } else {
                this.uiManager.showNotification('Missing parts to craft.', 'error');
            }
        });

        // Achievements
        window.addEventListener('achievement:unlocked', (e) => {
            const { title } = e.detail || {};
            this.uiManager.showNotification(`Achievement Unlocked: ${title}`);
        });

        // Car Builder
        window.addEventListener('builder:addBlock', () => {
            this.carBuilderManager.begin();
            const pos = new THREE.Vector3((Math.random()-0.5)*3, 1 + Math.random()*1.5, (Math.random()-0.5)*3);
            const size = new THREE.Vector3(1 + Math.random(), 0.5 + Math.random(), 1 + Math.random());
            this.carBuilderManager.addBlock(pos, size, 0x999999);
            this.uiManager.showNotification('Block added to builder');
        });

        window.addEventListener('builder:removeBlock', () => {
            this.carBuilderManager.removeLastBlock();
        });

        window.addEventListener('builder:finalize', () => {
            const custom = this.carBuilderManager.finalizeAsCar();
            if (custom) {
                this.scene.add(custom);
                this.uiManager.showNotification('Custom car created');
            }
        });

        // Car buying/selling/customization
        window.addEventListener('buyCar', (e) => {
            const { carId } = e.detail || {};
            const carData = this.carManager.getCarData(carId);
            if (!carData) return;
            const player = this.singleplayerManager.playerProfile;
            if (player.money >= carData.price) {
                player.money -= carData.price;
                player.cars.push({ id: carData.id, name: carData.name });
                this.updatePlayerUI();
                this.uiManager.showNotification(`Purchased ${carData.name}`);
                this.achievementsManager.evaluate(player);
            } else {
                this.uiManager.showNotification('Not enough money!', 'error');
            }
        });

        window.addEventListener('sellCar', (e) => {
            const { carId } = e.detail || {};
            const player = this.singleplayerManager.playerProfile;
            const idx = player.cars.findIndex(c => c.id === carId);
            if (idx >= 0) {
                const carData = this.carManager.getCarData(carId);
                const resale = Math.floor((carData?.price || 0) * 0.6);
                player.cars.splice(idx, 1);
                player.money += resale;
                this.updatePlayerUI();
                this.uiManager.showNotification(`Sold car for $${resale.toLocaleString()}`);
            }
        });

        window.addEventListener('customizeCar', (e) => {
            this.uiManager.showNotification('Customization applied');
        });

        // Auction and races
        window.addEventListener('createRace', (e) => {
            const data = e.detail;
            const race = this.raceManager.createRace(data);
            this.uiManager.showNotification('Race created');
        });

        window.addEventListener('joinRace', (e) => {
            const { raceId } = e.detail || {};
            const player = this.singleplayerManager.playerProfile;
            const car = player.cars[0] || { id: 'bmw-m3', name: 'BMW M3' };
            const ok = this.raceManager.joinRace(raceId, player.id, player.name, car);
            if (ok) {
                this.uiManager.showNotification('Joined race');
            } else {
                this.uiManager.showNotification('Failed to join race', 'error');
            }
        });

        // Betting
        window.addEventListener('bet:create', (e) => {
            const { carId } = e.detail || {};
            const player = this.singleplayerManager.playerProfile;
            const owns = player.cars.find(c => c.id === carId);
            if (!owns) {
                this.uiManager.showNotification('You do not own that car', 'error');
                return;
            }
            const betId = this.bettingManager.createBet({ carId, owner: player.id });
            this.uiManager.showNotification(`Bet created (${betId})`);
        });

        // Dev Tools Events
        window.addEventListener('dev-tools:teleport', (e) => {
            const { type, destination, x, y, z } = e.detail;
            if (type === 'city') {
                this.mapManager.teleportToCity(destination);
                this.uiManager.showNotification(`Teleported to ${destination}`);
            } else if (type === 'coordinates') {
                this.camera.position.set(x, y, z);
                this.controls.target.set(x, y, z);
                this.controls.update();
                this.uiManager.showNotification(`Teleported to (${x}, ${y}, ${z})`);
            }
        });

        window.addEventListener('dev-tools:unlock-city', (e) => {
            const { cityName } = e.detail;
            this.mapManager.unlockCity(cityName);
            this.cityShowroomManager.unlockShowroom(cityName);
            this.uiManager.showNotification(`Unlocked ${cityName}!`);
        });

        window.addEventListener('dev-tools:give-money', (e) => {
            const { amount } = e.detail;
            const player = this.singleplayerManager.playerProfile;
            player.money += amount;
            this.updatePlayerUI();
            this.uiManager.showNotification(`Gave $${amount.toLocaleString()}`);
        });

        window.addEventListener('dev-tools:give-car', (e) => {
            const { carId } = e.detail;
            const player = this.singleplayerManager.playerProfile;
            const carData = this.carManager.getCarData(carId);
            if (carData) {
                player.cars.push({ id: carData.id, name: carData.name });
                this.updatePlayerUI();
                this.uiManager.showNotification(`Gave ${carData.name}`);
            }
        });

        window.addEventListener('dev-tools:level-up', (e) => {
            const { type, amount } = e.detail;
            this.settingsManager.increaseLevel(type, amount);
            this.uiManager.showNotification(`Increased ${type} level by ${amount}`);
        });

        // City Events
        window.addEventListener('city-event:started', (e) => {
            const { event } = e.detail;
            this.uiManager.showNotification(`🌍 ${event.name} has started!`, 'info');
        });

        window.addEventListener('city-event:ended', (e) => {
            const { event } = e.detail;
            this.uiManager.showNotification(`🌍 ${event.name} has ended!`, 'info');
        });

        window.addEventListener('city-event:rewards', (e) => {
            const { rewards } = e.detail;
            rewards.forEach(reward => {
                if (reward.type === 'city_unlock') {
                    this.mapManager.unlockCity(reward.value);
                    this.cityShowroomManager.unlockShowroom(reward.value);
                    this.uiManager.showNotification(`🏙️ Unlocked ${reward.value}!`);
                } else {
                    this.uiManager.showNotification(`🎁 Received ${reward.type}!`);
                }
            });
        });

        // Showroom Events
        window.addEventListener('showroom:unlocked', (e) => {
            const { showroom } = e.detail;
            this.uiManager.showNotification(`🏪 ${showroom.name} is now available!`);
        });

        window.addEventListener('showroom:enter', (e) => {
            const { showroom } = e.detail;
            this.uiManager.showNotification(`Welcome to ${showroom.name}!`);
        });

        // Achievement Events
        window.addEventListener('achievement-unlocked', (e) => {
            const { title, description, icon } = e.detail;
            this.uiManager.showNotification(`🏆 Achievement: ${title}`, 'success');
        });

        // Level Up Events
        window.addEventListener('level-updated', (e) => {
            const { type, level } = e.detail;
            this.uiManager.showNotification(`📈 ${type} level increased to ${level}!`);
        });

        // City Feature Events
        window.addEventListener('city:teleport-to-feature', (e) => {
            const { city, feature, position, name } = e.detail;
            this.camera.position.set(position.x, position.y, position.z);
            this.controls.target.set(position.x, position.y, position.z);
            this.controls.update();
            this.uiManager.showNotification(`🏙️ Teleported to ${name} in ${city}`);
        });

        window.addEventListener('dev-tools:city-features', (e) => {
            const { cityName } = e.detail;
            const features = this.mapManager.getAvailableFeatures(cityName);
            if (features.length > 0) {
                const featureList = features.map(f => `- ${f.name} (${f.type})`).join('\n');
                this.uiManager.showNotification(`🏙️ ${cityName} features:\n${featureList}`);
            } else {
                this.uiManager.showNotification(`🏙️ No features available in ${cityName} (city may be locked)`);
            }
        });

        window.addEventListener('dev-tools:teleport-to-feature', (e) => {
            const { cityName, featureType } = e.detail;
            const result = this.mapManager.teleportToFeature(cityName, featureType);
            if (result.success) {
                this.camera.position.set(result.position.x, result.position.y, result.position.z);
                this.controls.target.set(result.position.x, result.position.y, result.position.z);
                this.controls.update();
                this.uiManager.showNotification(result.message);
            } else {
                this.uiManager.showNotification(result.message, 'error');
            }
        });

        window.addEventListener('city-feature:enter', (e) => {
            const { city, feature, featureInfo, visitCount } = e.detail;
            this.uiManager.showNotification(`🏪 Welcome to ${featureInfo.name}! (Visit #${visitCount})`);
        });
    }

    setupUIEventListeners() {
        // Main menu buttons
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('loadGameBtn').addEventListener('click', () => {
            this.loadGame();
        });
        
        // Navigation buttons
        document.getElementById('showroomBtn').addEventListener('click', () => {
            this.uiManager.togglePanel('carShowroom');
        });
        
        document.getElementById('auctionBtn').addEventListener('click', () => {
            this.uiManager.togglePanel('auctionHouse');
        });
        
        document.getElementById('raceBtn').addEventListener('click', () => {
            this.uiManager.togglePanel('racePanel');
        });
        
        document.getElementById('garageBtn').addEventListener('click', () => {
            this.uiManager.togglePanel('garage');
        });
    }

    setupKeyboardControls() {
        this.keys = {};
        
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            if (event.code === this.settingsManager.keybinds.photo) {
                this.replayManager.togglePhotoMode();
            }
            if (event.code === this.settingsManager.keybinds.replay) {
                this.replayManager.saveLastClip();
            }
            if (event.code === 'KeyT') {
                this.driftManager.toggle();
            }
            // Camera perspectives: 1st/2nd/3rd person
            if (event.code === 'Digit1') this.setCameraMode('first');
            if (event.code === 'Digit2') this.setCameraMode('second');
            if (event.code === 'Digit3') this.setCameraMode('third');
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }

    setCameraMode(mode) {
        const target = this.controls.target.clone();
        if (mode === 'first') {
            this.camera.position.copy(target).add(new THREE.Vector3(0, 1.2, 0.1));
        } else if (mode === 'second') {
            this.camera.position.copy(target).add(new THREE.Vector3(0, 3.0, 6.0));
        } else {
            this.camera.position.copy(target).add(new THREE.Vector3(8.0, 6.0, 12.0));
        }
        this.controls.update();
    }

    setupNetworkEvents() {
        // This will be handled by NetworkManager
        console.log('Network events will be set up by NetworkManager');
    }

    startGame() {
        const playerName = prompt('Enter your player name:') || 'Player';
        this.networkManager.connect(playerName);
        document.getElementById('mainMenu').classList.add('hidden');
        this.isGameRunning = true;
    }

    loadGame() {
        this.saveManager.loadGame().then((saveData) => {
            if (saveData) {
                this.currentPlayer = saveData.player;
                this.updatePlayerUI();
                this.startGame();
            } else {
                alert('No save game found!');
            }
        });
    }

    updatePlayerUI() {
        if (this.currentPlayer) {
            document.getElementById('playerName').textContent = this.currentPlayer.name;
            document.getElementById('playerMoney').textContent = `$${this.currentPlayer.money.toLocaleString()}`;
            document.getElementById('playerLevel').textContent = this.currentPlayer.level;
            document.getElementById('playerCars').textContent = this.currentPlayer.cars.length;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    startGameLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const deltaTime = this.clock.getDelta();
            
            // Update controls
            this.controls.update();
            
            // Update game systems
            if (this.isGameRunning) {
                this.update(deltaTime);
            }
            
            // Render
            this.render();
        };
        
        animate();
    }

    update(deltaTime) {
        // Update physics
        this.physicsEngine.update(deltaTime);
        
        // Update car manager
        this.carManager.update(deltaTime);
        
        // Update race manager
        this.raceManager.update(deltaTime);

        // Update NPCs
        this.npcManager.update(deltaTime);

        // Update singleplayer progress and leaderboards
        this.singleplayerManager.update(deltaTime);
        const sp = this.singleplayerManager.playerProfile;
        this.leaderboardsManager.updateEntry('distance', sp.id, sp.name, Math.floor(sp.distanceDriven));
        this.leaderboardsManager.updateEntry('money', sp.id, sp.name, sp.money);
        this.leaderboardsManager.updateEntry('carsOwned', sp.id, sp.name, sp.cars.length);
        
        // Update network manager
        this.networkManager.update(deltaTime);

        // Simple proximity pickup for junkyard scraps
        const raycaster = new THREE.Raycaster();
        const dir = this.controls.target.clone().sub(this.camera.position).normalize();
        raycaster.set(this.camera.position, dir);
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        const hit = intersects.find(i => i.object && i.object.userData && i.object.userData.collectable);
        if (hit && hit.distance < 5) {
            const obj = hit.object;
            obj.userData.collectable = false;
            this.scene.remove(obj);
            this.craftingManager.addScrap('metal-scrap', 1);
            this.uiManager.showNotification('Picked up metal scrap');
        }

        // Update weather/time of day
        if (this.weatherManager && this._lightingRefs) {
            this.weatherManager.update(deltaTime, this._lightingRefs);
        }

        // Update events
        this.eventsManager.update(deltaTime);

        // Record replay frame (lightweight placeholder)
        this.replayManager.record({ t: performance.now() });

        // Render minimap (approx player at camera target)
        if (this.miniMapManager) {
            this.miniMapManager.render({ x: this.controls.target.x, z: this.controls.target.z });
        }

        // Update drift and telemetry (placeholder values)
        const pseudoSpeed = this.controls?.target?.distanceTo ? this.controls.target.distanceTo(this.camera.position) * 2 : 0;
        const pseudoSlip = Math.min(1, Math.abs(Math.sin(performance.now() / 5000)));
        this.driftManager.update(deltaTime, pseudoSlip);
        this.telemetryManager.setDriftScore(this.driftManager.score);
        const weatherType = this.weatherManager?.weather || 'clear';
        const hour = Math.floor(this.weatherManager?.timeOfDay || 12).toString().padStart(2, '0');
        const minute = Math.floor(((this.weatherManager?.timeOfDay || 12) % 1) * 60).toString().padStart(2, '0');
        this.telemetryManager.setWeatherAndTime(weatherType, `${hour}:${minute}`);
        this.telemetryManager.update(pseudoSpeed);
    }

    render() {
        // Use post-processing for better visuals
        this.composer.render();
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 5000);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new CarGame();
    window.game = game;
});
