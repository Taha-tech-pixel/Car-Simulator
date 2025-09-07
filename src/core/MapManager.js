export class MapManager {
    constructor() {
        this.markers = [];
        this.visible = false;
        this.currentCity = 'main';
        this.specialCities = {
            main: {
                name: 'Main City',
                description: 'The primary city with standard features',
                position: { x: 0, y: 0, z: 0 },
                unlocked: true,
                environment: 'main',
                features: {
                    showroom: { position: { x: 0, y: 0, z: 0 }, name: 'Main City Showroom' },
                    garage: { position: { x: 20, y: 0, z: 0 }, name: 'Main Garage' },
                    auctionHouse: { position: { x: -20, y: 0, z: 0 }, name: 'Main Auction House' },
                    raceTrack: { position: { x: 0, y: 0, z: 30 }, name: 'Main Race Track' },
                    bettingOffice: { position: { x: 15, y: 0, z: 15 }, name: 'Main Betting Office' },
                    junkyard: { position: { x: -30, y: 0, z: 20 }, name: 'Main Junkyard' },
                    home: { position: { x: 0, y: 0, z: -20 }, name: 'Main Villa' },
                    craftingStation: { position: { x: 25, y: 0, z: -15 }, name: 'Main Crafting Station' },
                    missionsOffice: { position: { x: -15, y: 0, z: -25 }, name: 'Main Missions Office' },
                    leaderboard: { position: { x: 10, y: 0, z: -30 }, name: 'Main Leaderboard' }
                }
            },
            skyCity: {
                name: 'Sky City',
                description: 'A floating city in the clouds',
                position: { x: 0, y: 2000, z: 0 },
                unlocked: false,
                environment: 'sky',
                features: {
                    showroom: { position: { x: 0, y: 2000, z: 0 }, name: 'Sky Aero Showroom' },
                    garage: { position: { x: 20, y: 2000, z: 0 }, name: 'Cloud Garage' },
                    auctionHouse: { position: { x: -20, y: 2000, z: 0 }, name: 'Sky Auction House' },
                    raceTrack: { position: { x: 0, y: 2000, z: 30 }, name: 'Cloud Racing Circuit' },
                    bettingOffice: { position: { x: 15, y: 2000, z: 15 }, name: 'Wind Betting Office' },
                    junkyard: { position: { x: -30, y: 2000, z: 20 }, name: 'Sky Scrap Yard' },
                    home: { position: { x: 0, y: 2000, z: -20 }, name: 'Sky Villa' },
                    craftingStation: { position: { x: 25, y: 2000, z: -15 }, name: 'Aero Crafting Lab' },
                    missionsOffice: { position: { x: -15, y: 2000, z: -25 }, name: 'Sky Missions HQ' },
                    leaderboard: { position: { x: 10, y: 2000, z: -30 }, name: 'Sky Rankings' }
                }
            },
            volcanoCity: {
                name: 'Volcano City',
                description: 'A city built on an active volcano',
                position: { x: 5000, y: 0, z: 0 },
                unlocked: false,
                environment: 'volcano',
                features: {
                    showroom: { position: { x: 5000, y: 0, z: 0 }, name: 'Fire Showroom' },
                    garage: { position: { x: 5020, y: 0, z: 0 }, name: 'Lava Garage' },
                    auctionHouse: { position: { x: 4980, y: 0, z: 0 }, name: 'Volcano Auction House' },
                    raceTrack: { position: { x: 5000, y: 0, z: 30 }, name: 'Lava Racing Track' },
                    bettingOffice: { position: { x: 5015, y: 0, z: 15 }, name: 'Fire Betting Office' },
                    junkyard: { position: { x: 4970, y: 0, z: 20 }, name: 'Volcanic Scrap Yard' },
                    home: { position: { x: 5000, y: 0, z: -20 }, name: 'Volcano Villa' },
                    craftingStation: { position: { x: 5025, y: 0, z: -15 }, name: 'Fire Crafting Forge' },
                    missionsOffice: { position: { x: 4985, y: 0, z: -25 }, name: 'Volcano Missions HQ' },
                    leaderboard: { position: { x: 5010, y: 0, z: -30 }, name: 'Volcano Rankings' }
                }
            },
            undergroundCity: {
                name: 'Underground City',
                description: 'A hidden city beneath the surface',
                position: { x: 0, y: -1000, z: 0 },
                unlocked: false,
                environment: 'underground',
                features: {
                    showroom: { position: { x: 0, y: -1000, z: 0 }, name: 'Mining Showroom' },
                    garage: { position: { x: 20, y: -1000, z: 0 }, name: 'Cave Garage' },
                    auctionHouse: { position: { x: -20, y: -1000, z: 0 }, name: 'Underground Auction House' },
                    raceTrack: { position: { x: 0, y: -1000, z: 30 }, name: 'Tunnel Racing Circuit' },
                    bettingOffice: { position: { x: 15, y: -1000, z: 15 }, name: 'Cave Betting Office' },
                    junkyard: { position: { x: -30, y: -1000, z: 20 }, name: 'Underground Scrap Yard' },
                    home: { position: { x: 0, y: -1000, z: -20 }, name: 'Cave Villa' },
                    craftingStation: { position: { x: 25, y: -1000, z: -15 }, name: 'Mining Crafting Station' },
                    missionsOffice: { position: { x: -15, y: -1000, z: -25 }, name: 'Underground Missions HQ' },
                    leaderboard: { position: { x: 10, y: -1000, z: -30 }, name: 'Underground Rankings' }
                }
            },
            waterCity: {
                name: 'Water City',
                description: 'A city floating on the ocean',
                position: { x: -5000, y: 0, z: 0 },
                unlocked: false,
                environment: 'water',
                features: {
                    showroom: { position: { x: -5000, y: 0, z: 0 }, name: 'Marine Showroom' },
                    garage: { position: { x: -4980, y: 0, z: 0 }, name: 'Harbor Garage' },
                    auctionHouse: { position: { x: -5020, y: 0, z: 0 }, name: 'Ocean Auction House' },
                    raceTrack: { position: { x: -5000, y: 0, z: 30 }, name: 'Water Racing Circuit' },
                    bettingOffice: { position: { x: -4985, y: 0, z: 15 }, name: 'Wave Betting Office' },
                    junkyard: { position: { x: -5030, y: 0, z: 20 }, name: 'Ocean Scrap Yard' },
                    home: { position: { x: -5000, y: 0, z: -20 }, name: 'Water Villa' },
                    craftingStation: { position: { x: -4975, y: 0, z: -15 }, name: 'Marine Crafting Dock' },
                    missionsOffice: { position: { x: -5015, y: 0, z: -25 }, name: 'Water Missions HQ' },
                    leaderboard: { position: { x: -4990, y: 0, z: -30 }, name: 'Water Rankings' }
                }
            }
        };
        
        this.cityEvents = {
            active: false,
            lastEvent: 0,
            eventCooldown: 3600000 // 1 hour
        };
    }

    toggle() {
        this.visible = !this.visible;
        window.dispatchEvent(new CustomEvent('map:toggle', { detail: { visible: this.visible } }));
    }

    addMarker(marker) {
        this.markers.push(marker);
    }
    
    // Special city management
    unlockCity(cityName) {
        if (this.specialCities[cityName]) {
            this.specialCities[cityName].unlocked = true;
            window.dispatchEvent(new CustomEvent('city:unlocked', { 
                detail: { city: this.specialCities[cityName] } 
            }));
        }
    }
    
    teleportToCity(cityName) {
        if (this.specialCities[cityName] && this.specialCities[cityName].unlocked) {
            this.currentCity = cityName;
            window.dispatchEvent(new CustomEvent('city:teleport', { 
                detail: { 
                    city: this.specialCities[cityName],
                    position: this.specialCities[cityName].position
                } 
            }));
            return true;
        }
        return false;
    }
    
    getCurrentCity() {
        return this.currentCity;
    }
    
    getCityInfo(cityName) {
        return this.specialCities[cityName] || null;
    }
    
    // Random city events
    checkForCityEvent() {
        const now = Date.now();
        if (now - this.cityEvents.lastEvent >= this.cityEvents.eventCooldown) {
            this.triggerCityEvent();
        }
    }
    
    triggerCityEvent() {
        const cities = Object.keys(this.specialCities).filter(city => 
            !this.specialCities[city].unlocked
        );
        
        if (cities.length > 0) {
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            this.unlockCity(randomCity);
            this.cityEvents.lastEvent = Date.now();
            
            // Show event notification
            window.dispatchEvent(new CustomEvent('city:event', {
                detail: {
                    city: this.specialCities[randomCity],
                    message: `A mysterious portal has opened to ${this.specialCities[randomCity].name}!`
                }
            }));
        }
    }
    
    // City environment setup
    setupCityEnvironment(cityName) {
        const city = this.specialCities[cityName];
        if (!city) return;
        
        switch (city.environment) {
            case 'sky':
                return this.setupSkyEnvironment();
            case 'volcano':
                return this.setupVolcanoEnvironment();
            case 'underground':
                return this.setupUndergroundEnvironment();
            case 'water':
                return this.setupWaterEnvironment();
            default:
                return this.setupMainEnvironment();
        }
    }
    
    setupSkyEnvironment() {
        return {
            skybox: 'cloudy_sky',
            lighting: {
                ambient: 0x87CEEB,
                directional: { color: 0xFFFFFF, intensity: 1.2 },
                fog: { color: 0x87CEEB, near: 100, far: 2000 }
            },
            weather: 'clear',
            particles: ['clouds', 'birds'],
            soundscape: 'wind_ambient',
            gravity: 0.3 // Reduced gravity in sky
        };
    }
    
    setupVolcanoEnvironment() {
        return {
            skybox: 'volcanic_sky',
            lighting: {
                ambient: 0xFF4500,
                directional: { color: 0xFF6347, intensity: 0.8 },
                point: { color: 0xFF0000, intensity: 2.0, position: { x: 0, y: 100, z: 0 } },
                fog: { color: 0x8B0000, near: 50, far: 800 }
            },
            weather: 'ash_rain',
            particles: ['lava_splashes', 'ash', 'smoke'],
            soundscape: 'volcano_ambient',
            temperature: 45, // Hot environment
            effects: ['heat_distortion', 'lava_glow']
        };
    }
    
    setupUndergroundEnvironment() {
        return {
            skybox: 'cave_ceiling',
            lighting: {
                ambient: 0x2F2F2F,
                directional: { color: 0x8B4513, intensity: 0.3 },
                point: { color: 0xFFD700, intensity: 1.5, position: { x: 0, y: 200, z: 0 } },
                fog: { color: 0x1C1C1C, near: 20, far: 500 }
            },
            weather: 'dripping',
            particles: ['dust', 'cave_drips'],
            soundscape: 'cave_echo',
            temperature: 15, // Cool environment
            effects: ['cave_echo', 'mineral_glow']
        };
    }
    
    setupWaterEnvironment() {
        return {
            skybox: 'ocean_sky',
            lighting: {
                ambient: 0x4682B4,
                directional: { color: 0x87CEEB, intensity: 1.0 },
                fog: { color: 0x4682B4, near: 100, far: 1500 }
            },
            weather: 'ocean_breeze',
            particles: ['water_splash', 'seagulls', 'waves'],
            soundscape: 'ocean_waves',
            temperature: 22, // Moderate temperature
            effects: ['water_reflection', 'wave_animation'],
            waterLevel: 0
        };
    }
    
    setupMainEnvironment() {
        return {
            skybox: 'default_sky',
            lighting: {
                ambient: 0x404040,
                directional: { color: 0xFFFFFF, intensity: 1.0 },
                fog: { color: 0x808080, near: 100, far: 1000 }
            },
            weather: 'clear',
            particles: [],
            soundscape: 'city_ambient',
            temperature: 20
        };
    }
    
    // City features management
    getCityFeatures(cityName) {
        const city = this.specialCities[cityName];
        return city ? city.features : null;
    }
    
    getFeaturePosition(cityName, featureType) {
        const features = this.getCityFeatures(cityName);
        return features ? features[featureType]?.position : null;
    }
    
    getFeatureName(cityName, featureType) {
        const features = this.getCityFeatures(cityName);
        return features ? features[featureType]?.name : null;
    }
    
    getAllCityFeatures() {
        const allFeatures = {};
        Object.keys(this.specialCities).forEach(cityName => {
            allFeatures[cityName] = this.specialCities[cityName].features;
        });
        return allFeatures;
    }
    
    // Teleport to specific feature in a city
    teleportToFeature(cityName, featureType) {
        const feature = this.getCityFeatures(cityName)?.[featureType];
        if (!feature) {
            return { success: false, message: 'Feature not found' };
        }
        
        if (!this.specialCities[cityName]?.unlocked) {
            return { success: false, message: 'City not unlocked' };
        }
        
        this.currentCity = cityName;
        window.dispatchEvent(new CustomEvent('city:teleport-to-feature', {
            detail: {
                city: cityName,
                feature: featureType,
                position: feature.position,
                name: feature.name
            }
        }));
        
        return { 
            success: true, 
            message: `Teleported to ${feature.name} in ${this.specialCities[cityName].name}`,
            position: feature.position
        };
    }
    
    // Get all available features for a city
    getAvailableFeatures(cityName) {
        const city = this.specialCities[cityName];
        if (!city || !city.unlocked) {
            return [];
        }
        
        return Object.keys(city.features).map(featureType => ({
            type: featureType,
            name: city.features[featureType].name,
            position: city.features[featureType].position,
            description: `${city.features[featureType].name} in ${city.name}`
        }));
    }
    
    // Check if a feature is available in a city
    isFeatureAvailable(cityName, featureType) {
        const city = this.specialCities[cityName];
        return city && city.unlocked && city.features[featureType];
    }
    
    // Get feature information
    getFeatureInfo(cityName, featureType) {
        const feature = this.getCityFeatures(cityName)?.[featureType];
        if (!feature) return null;
        
        return {
            name: feature.name,
            position: feature.position,
            city: cityName,
            type: featureType,
            available: this.isFeatureAvailable(cityName, featureType)
        };
    }
}


