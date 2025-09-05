import * as THREE from 'three';

export class RaceManager {
    constructor(scene) {
        this.scene = scene;
        this.activeRaces = new Map();
        this.raceTracks = new Map();
        this.raceResults = new Map();
        
        this.initializeTracks();
    }

    initializeTracks() {
        // Create different race tracks
        this.createCityCircuit();
        this.createMountainPass();
        this.createDesertHighway();
        this.createCoastalRoad();
    }

    createCityCircuit() {
        const track = {
            id: 'city-circuit',
            name: 'City Circuit',
            difficulty: 'medium',
            baseTime: 120, // seconds
            laps: 3,
            checkpoints: this.generateCityCheckpoints(),
            scenery: this.createCityScenery(),
            startPosition: new THREE.Vector3(0, 0, 0),
            startRotation: new THREE.Euler(0, 0, 0)
        };
        
        this.raceTracks.set('city-circuit', track);
        this.scene.add(track.scenery);
    }

    createMountainPass() {
        const track = {
            id: 'mountain-pass',
            name: 'Mountain Pass',
            difficulty: 'hard',
            baseTime: 180,
            laps: 5,
            checkpoints: this.generateMountainCheckpoints(),
            scenery: this.createMountainScenery(),
            startPosition: new THREE.Vector3(0, 0, 0),
            startRotation: new THREE.Euler(0, 0, 0)
        };
        
        this.raceTracks.set('mountain-pass', track);
        this.scene.add(track.scenery);
    }

    createDesertHighway() {
        const track = {
            id: 'desert-highway',
            name: 'Desert Highway',
            difficulty: 'easy',
            baseTime: 100,
            laps: 2,
            checkpoints: this.generateDesertCheckpoints(),
            scenery: this.createDesertScenery(),
            startPosition: new THREE.Vector3(0, 0, 0),
            startRotation: new THREE.Euler(0, 0, 0)
        };
        
        this.raceTracks.set('desert-highway', track);
        this.scene.add(track.scenery);
    }

    createCoastalRoad() {
        const track = {
            id: 'coastal-road',
            name: 'Coastal Road',
            difficulty: 'medium',
            baseTime: 140,
            laps: 4,
            checkpoints: this.generateCoastalCheckpoints(),
            scenery: this.createCoastalScenery(),
            startPosition: new THREE.Vector3(0, 0, 0),
            startRotation: new THREE.Euler(0, 0, 0)
        };
        
        this.raceTracks.set('coastal-road', track);
        this.scene.add(track.scenery);
    }

    // Track generation methods
    generateCityCheckpoints() {
        return [
            { position: new THREE.Vector3(0, 0, 0), radius: 5 },
            { position: new THREE.Vector3(50, 0, 0), radius: 5 },
            { position: new THREE.Vector3(50, 0, 50), radius: 5 },
            { position: new THREE.Vector3(0, 0, 50), radius: 5 }
        ];
    }

    generateMountainCheckpoints() {
        return [
            { position: new THREE.Vector3(0, 0, 0), radius: 5 },
            { position: new THREE.Vector3(30, 10, 0), radius: 5 },
            { position: new THREE.Vector3(60, 20, 30), radius: 5 },
            { position: new THREE.Vector3(30, 10, 60), radius: 5 },
            { position: new THREE.Vector3(0, 0, 30), radius: 5 }
        ];
    }

    generateDesertCheckpoints() {
        return [
            { position: new THREE.Vector3(0, 0, 0), radius: 5 },
            { position: new THREE.Vector3(100, 0, 0), radius: 5 },
            { position: new THREE.Vector3(100, 0, 100), radius: 5 },
            { position: new THREE.Vector3(0, 0, 100), radius: 5 }
        ];
    }

    generateCoastalCheckpoints() {
        return [
            { position: new THREE.Vector3(0, 0, 0), radius: 5 },
            { position: new THREE.Vector3(40, 0, 0), radius: 5 },
            { position: new THREE.Vector3(40, 0, 40), radius: 5 },
            { position: new THREE.Vector3(0, 0, 40), radius: 5 }
        ];
    }

    // Scenery creation methods
    createCityScenery() {
        const scenery = new THREE.Group();
        
        // Buildings
        for (let i = 0; i < 20; i++) {
            const building = this.createBuilding();
            building.position.set(
                (Math.random() - 0.5) * 200,
                0,
                (Math.random() - 0.5) * 200
            );
            scenery.add(building);
        }
        
        // Street lights
        for (let i = 0; i < 50; i++) {
            const light = this.createStreetLight();
            light.position.set(
                (Math.random() - 0.5) * 200,
                0,
                (Math.random() - 0.5) * 200
            );
            scenery.add(light);
        }
        
        return scenery;
    }

    createMountainScenery() {
        const scenery = new THREE.Group();
        
        // Mountains
        for (let i = 0; i < 10; i++) {
            const mountain = this.createMountain();
            mountain.position.set(
                (Math.random() - 0.5) * 300,
                0,
                (Math.random() - 0.5) * 300
            );
            scenery.add(mountain);
        }
        
        // Trees
        for (let i = 0; i < 100; i++) {
            const tree = this.createTree();
            tree.position.set(
                (Math.random() - 0.5) * 200,
                0,
                (Math.random() - 0.5) * 200
            );
            scenery.add(tree);
        }
        
        return scenery;
    }

    createDesertScenery() {
        const scenery = new THREE.Group();
        
        // Sand dunes
        for (let i = 0; i < 15; i++) {
            const dune = this.createSandDune();
            dune.position.set(
                (Math.random() - 0.5) * 400,
                0,
                (Math.random() - 0.5) * 400
            );
            scenery.add(dune);
        }
        
        // Cacti
        for (let i = 0; i < 50; i++) {
            const cactus = this.createCactus();
            cactus.position.set(
                (Math.random() - 0.5) * 300,
                0,
                (Math.random() - 0.5) * 300
            );
            scenery.add(cactus);
        }
        
        return scenery;
    }

    createCoastalScenery() {
        const scenery = new THREE.Group();
        
        // Ocean
        const oceanGeometry = new THREE.PlaneGeometry(500, 500);
        const oceanMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x0066cc,
            transparent: true,
            opacity: 0.8
        });
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.set(0, -1, 0);
        scenery.add(ocean);
        
        // Palm trees
        for (let i = 0; i < 30; i++) {
            const palmTree = this.createPalmTree();
            palmTree.position.set(
                (Math.random() - 0.5) * 200,
                0,
                (Math.random() - 0.5) * 200
            );
            scenery.add(palmTree);
        }
        
        return scenery;
    }

    // Scenery object creation
    createBuilding() {
        const building = new THREE.Group();
        
        const height = Math.random() * 20 + 10;
        const geometry = new THREE.BoxGeometry(8, height, 8);
        const material = new THREE.MeshLambertMaterial({ 
            color: Math.random() * 0x666666 + 0x333333 
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = height / 2;
        mesh.castShadow = true;
        building.add(mesh);
        
        return building;
    }

    createStreetLight() {
        const light = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.3, 8, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 4;
        pole.castShadow = true;
        light.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffaa,
            emissive: 0xffffaa,
            emissiveIntensity: 0.5
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.y = 8;
        light.add(lightMesh);
        
        // Point light
        const pointLight = new THREE.PointLight(0xffffaa, 1, 20);
        pointLight.position.y = 8;
        pointLight.castShadow = true;
        light.add(pointLight);
        
        return light;
    }

    createMountain() {
        const mountain = new THREE.Group();
        
        const geometry = new THREE.ConeGeometry(20, 30, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 15;
        mesh.castShadow = true;
        mountain.add(mesh);
        
        return mountain;
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

    createSandDune() {
        const dune = new THREE.Group();
        
        const geometry = new THREE.SphereGeometry(15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        const material = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 7.5;
        mesh.castShadow = true;
        dune.add(mesh);
        
        return dune;
    }

    createCactus() {
        const cactus = new THREE.Group();
        
        const geometry = new THREE.CylinderGeometry(1, 1.5, 8, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 4;
        mesh.castShadow = true;
        cactus.add(mesh);
        
        return cactus;
    }

    createPalmTree() {
        const palm = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 6, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 3;
        trunk.castShadow = true;
        palm.add(trunk);
        
        // Leaves
        for (let i = 0; i < 6; i++) {
            const leafGeometry = new THREE.ConeGeometry(0.2, 4, 4);
            const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.y = 6;
            leaf.rotation.z = (i / 6) * Math.PI * 2;
            leaf.castShadow = true;
            palm.add(leaf);
        }
        
        return palm;
    }

    // Race management
    createRace(raceData) {
        const race = {
            id: this.generateRaceId(),
            track: raceData.track,
            maxParticipants: raceData.maxParticipants || 8,
            laps: raceData.laps || 3,
            participants: [],
            status: 'waiting', // waiting, starting, racing, finished
            startTime: null,
            endTime: null,
            results: []
        };
        
        this.activeRaces.set(race.id, race);
        return race;
    }

    joinRace(raceId, playerId, playerName, car) {
        const race = this.activeRaces.get(raceId);
        if (!race || race.status !== 'waiting') {
            return false;
        }
        
        if (race.participants.length >= race.maxParticipants) {
            return false;
        }
        
        const participant = {
            playerId,
            playerName,
            car,
            position: race.participants.length + 1,
            currentLap: 0,
            currentCheckpoint: 0,
            lapTimes: [],
            bestLap: 0,
            totalTime: 0,
            finished: false
        };
        
        race.participants.push(participant);
        return true;
    }

    startRace(raceId) {
        const race = this.activeRaces.get(raceId);
        if (!race || race.participants.length < 2) {
            return false;
        }
        
        race.status = 'starting';
        race.startTime = Date.now();
        
        // Start countdown
        setTimeout(() => {
            race.status = 'racing';
            this.emit('raceStarted', race);
        }, 3000); // 3 second countdown
        
        return true;
    }

    updateRace(raceId, deltaTime) {
        const race = this.activeRaces.get(raceId);
        if (!race || race.status !== 'racing') {
            return;
        }
        
        // Update race progress
        race.participants.forEach(participant => {
            if (!participant.finished) {
                participant.totalTime += deltaTime;
            }
        });
        
        // Check for race completion
        const finishedParticipants = race.participants.filter(p => p.finished);
        if (finishedParticipants.length === race.participants.length) {
            this.finishRace(raceId);
        }
    }

    finishRace(raceId) {
        const race = this.activeRaces.get(raceId);
        if (!race) return;
        
        race.status = 'finished';
        race.endTime = Date.now();
        
        // Sort participants by total time
        race.participants.sort((a, b) => a.totalTime - b.totalTime);
        
        // Update positions
        race.participants.forEach((participant, index) => {
            participant.position = index + 1;
        });
        
        this.raceResults.set(raceId, race);
        this.emit('raceFinished', race);
    }

    // Checkpoint system
    checkCheckpoint(raceId, playerId, checkpointIndex) {
        const race = this.activeRaces.get(raceId);
        if (!race) return false;
        
        const participant = race.participants.find(p => p.playerId === playerId);
        if (!participant) return false;
        
        const track = this.raceTracks.get(race.track);
        if (!track) return false;
        
        // Check if this is the next checkpoint
        if (checkpointIndex === participant.currentCheckpoint) {
            participant.currentCheckpoint++;
            
            // Check if lap is completed
            if (participant.currentCheckpoint >= track.checkpoints.length) {
                participant.currentLap++;
                participant.currentCheckpoint = 0;
                
                // Record lap time
                const lapTime = Date.now() - (participant.lastLapStart || race.startTime);
                participant.lapTimes.push(lapTime);
                
                if (participant.bestLap === 0 || lapTime < participant.bestLap) {
                    participant.bestLap = lapTime;
                }
                
                participant.lastLapStart = Date.now();
                
                // Check if race is finished
                if (participant.currentLap >= race.laps) {
                    participant.finished = true;
                    participant.totalTime = Date.now() - race.startTime;
                }
            }
            
            return true;
        }
        
        return false;
    }

    // Utility methods
    generateRaceId() {
        return 'race_' + Math.random().toString(36).substr(2, 9);
    }

    getRace(raceId) {
        return this.activeRaces.get(raceId);
    }

    getAllRaces() {
        return Array.from(this.activeRaces.values());
    }

    getTrack(trackId) {
        return this.raceTracks.get(trackId);
    }

    getAllTracks() {
        return Array.from(this.raceTracks.values());
    }

    getRaceResults(raceId) {
        return this.raceResults.get(raceId);
    }

    // Event system
    emit(event, data) {
        window.dispatchEvent(new CustomEvent(`race:${event}`, { detail: data }));
    }

    // Update method for game loop
    update(deltaTime) {
        // Update all active races
        for (const [raceId, race] of this.activeRaces) {
            this.updateRace(raceId, deltaTime);
        }
    }

    // Cleanup
    destroy() {
        this.activeRaces.clear();
        this.raceTracks.clear();
        this.raceResults.clear();
    }
}
