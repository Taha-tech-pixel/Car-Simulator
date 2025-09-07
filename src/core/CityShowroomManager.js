export class CityShowroomManager {
    constructor() {
        this.showrooms = {
            main: {
                name: 'Main City Showroom',
                description: 'The primary showroom with standard vehicles',
                location: { x: 0, y: 0, z: 0 },
                cars: ['sports', 'luxury', 'supercars', 'normal'],
                unlocked: true
            },
            skyCity: {
                name: 'Sky City Aero Showroom',
                description: 'Exclusive flying vehicles and sky cars',
                location: { x: 0, y: 2000, z: 0 },
                cars: ['skyCity'],
                unlocked: false,
                specialFeatures: ['flight_simulator', 'cloud_testing']
            },
            volcanoCity: {
                name: 'Volcano City Fire Showroom',
                description: 'Heat-resistant vehicles for extreme environments',
                location: { x: 5000, y: 0, z: 0 },
                cars: ['volcanoCity'],
                unlocked: false,
                specialFeatures: ['lava_testing', 'heat_chamber']
            },
            undergroundCity: {
                name: 'Underground City Mining Showroom',
                description: 'Specialized vehicles for underground exploration',
                location: { x: 0, y: -1000, z: 0 },
                cars: ['undergroundCity'],
                unlocked: false,
                specialFeatures: ['tunnel_simulator', 'crystal_display']
            },
            waterCity: {
                name: 'Water City Marine Showroom',
                description: 'Amphibious and water vehicles',
                location: { x: -5000, y: 0, z: 0 },
                cars: ['waterCity'],
                unlocked: false,
                specialFeatures: ['water_testing', 'underwater_viewing']
            }
        };
        
        this.currentShowroom = 'main';
        this.visitorCount = new Map();
        
        // City features for all cities
        this.cityFeatures = {
            main: {
                showroom: { name: 'Main City Showroom', description: 'Standard vehicle showroom' },
                garage: { name: 'Main Garage', description: 'Vehicle storage and customization' },
                auctionHouse: { name: 'Main Auction House', description: 'Buy and sell vehicles' },
                raceTrack: { name: 'Main Race Track', description: 'Racing competitions' },
                bettingOffice: { name: 'Main Betting Office', description: 'Place bets on races' },
                junkyard: { name: 'Main Junkyard', description: 'Find scrap and parts' },
                home: { name: 'Main Villa', description: 'Player residence' },
                craftingStation: { name: 'Main Crafting Station', description: 'Craft items and upgrades' },
                missionsOffice: { name: 'Main Missions Office', description: 'Accept missions' },
                leaderboard: { name: 'Main Leaderboard', description: 'View rankings' }
            },
            skyCity: {
                showroom: { name: 'Sky Aero Showroom', description: 'Flying vehicle showroom' },
                garage: { name: 'Cloud Garage', description: 'Sky vehicle storage' },
                auctionHouse: { name: 'Sky Auction House', description: 'Aero vehicle auctions' },
                raceTrack: { name: 'Cloud Racing Circuit', description: 'Sky racing competitions' },
                bettingOffice: { name: 'Wind Betting Office', description: 'Sky race betting' },
                junkyard: { name: 'Sky Scrap Yard', description: 'Aero parts and scrap' },
                home: { name: 'Sky Villa', description: 'Floating residence' },
                craftingStation: { name: 'Aero Crafting Lab', description: 'Sky vehicle crafting' },
                missionsOffice: { name: 'Sky Missions HQ', description: 'Aerial missions' },
                leaderboard: { name: 'Sky Rankings', description: 'Sky city leaderboard' }
            },
            volcanoCity: {
                showroom: { name: 'Fire Showroom', description: 'Heat-resistant vehicle showroom' },
                garage: { name: 'Lava Garage', description: 'Volcano vehicle storage' },
                auctionHouse: { name: 'Volcano Auction House', description: 'Fire vehicle auctions' },
                raceTrack: { name: 'Lava Racing Track', description: 'Volcano racing' },
                bettingOffice: { name: 'Fire Betting Office', description: 'Volcano race betting' },
                junkyard: { name: 'Volcanic Scrap Yard', description: 'Fire-resistant parts' },
                home: { name: 'Volcano Villa', description: 'Volcanic residence' },
                craftingStation: { name: 'Fire Crafting Forge', description: 'Volcano vehicle crafting' },
                missionsOffice: { name: 'Volcano Missions HQ', description: 'Volcanic missions' },
                leaderboard: { name: 'Volcano Rankings', description: 'Volcano city leaderboard' }
            },
            undergroundCity: {
                showroom: { name: 'Mining Showroom', description: 'Underground vehicle showroom' },
                garage: { name: 'Cave Garage', description: 'Underground vehicle storage' },
                auctionHouse: { name: 'Underground Auction House', description: 'Cave vehicle auctions' },
                raceTrack: { name: 'Tunnel Racing Circuit', description: 'Underground racing' },
                bettingOffice: { name: 'Cave Betting Office', description: 'Underground race betting' },
                junkyard: { name: 'Underground Scrap Yard', description: 'Mining parts and scrap' },
                home: { name: 'Cave Villa', description: 'Underground residence' },
                craftingStation: { name: 'Mining Crafting Station', description: 'Underground vehicle crafting' },
                missionsOffice: { name: 'Underground Missions HQ', description: 'Mining missions' },
                leaderboard: { name: 'Underground Rankings', description: 'Underground city leaderboard' }
            },
            waterCity: {
                showroom: { name: 'Marine Showroom', description: 'Water vehicle showroom' },
                garage: { name: 'Harbor Garage', description: 'Marine vehicle storage' },
                auctionHouse: { name: 'Ocean Auction House', description: 'Marine vehicle auctions' },
                raceTrack: { name: 'Water Racing Circuit', description: 'Water racing competitions' },
                bettingOffice: { name: 'Wave Betting Office', description: 'Water race betting' },
                junkyard: { name: 'Ocean Scrap Yard', description: 'Marine parts and scrap' },
                home: { name: 'Water Villa', description: 'Floating residence' },
                craftingStation: { name: 'Marine Crafting Dock', description: 'Water vehicle crafting' },
                missionsOffice: { name: 'Water Missions HQ', description: 'Marine missions' },
                leaderboard: { name: 'Water Rankings', description: 'Water city leaderboard' }
            }
        };
    }
    
    getShowroom(cityName) {
        return this.showrooms[cityName] || null;
    }
    
    unlockShowroom(cityName) {
        if (this.showrooms[cityName]) {
            this.showrooms[cityName].unlocked = true;
            window.dispatchEvent(new CustomEvent('showroom:unlocked', {
                detail: { showroom: this.showrooms[cityName] }
            }));
            return true;
        }
        return false;
    }
    
    isShowroomUnlocked(cityName) {
        return this.showrooms[cityName]?.unlocked || false;
    }
    
    enterShowroom(cityName) {
        const showroom = this.showrooms[cityName];
        if (!showroom || !showroom.unlocked) {
            return { success: false, message: 'Showroom not available' };
        }
        
        this.currentShowroom = cityName;
        
        // Track visitor count
        const count = this.visitorCount.get(cityName) || 0;
        this.visitorCount.set(cityName, count + 1);
        
        window.dispatchEvent(new CustomEvent('showroom:enter', {
            detail: { 
                showroom,
                visitorCount: count + 1
            }
        }));
        
        return { 
            success: true, 
            message: `Welcome to ${showroom.name}!`,
            showroom,
            availableCars: this.getAvailableCars(cityName)
        };
    }
    
    getAvailableCars(cityName) {
        const showroom = this.showrooms[cityName];
        if (!showroom) return [];
        
        // This would integrate with the car database
        // For now, return the car categories available in this showroom
        return showroom.cars;
    }
    
    getShowroomFeatures(cityName) {
        const showroom = this.showrooms[cityName];
        return showroom?.specialFeatures || [];
    }
    
    getVisitorCount(cityName) {
        return this.visitorCount.get(cityName) || 0;
    }
    
    getAllShowrooms() {
        return Object.values(this.showrooms);
    }
    
    getUnlockedShowrooms() {
        return Object.values(this.showrooms).filter(showroom => showroom.unlocked);
    }
    
    // Special showroom events
    triggerShowroomEvent(cityName) {
        const showroom = this.showrooms[cityName];
        if (!showroom || !showroom.unlocked) return;
        
        const events = [
            {
                type: 'discount',
                message: 'Special discount on all vehicles!',
                effect: { discount: 0.2, duration: 300000 } // 20% off for 5 minutes
            },
            {
                type: 'new_arrival',
                message: 'New exclusive vehicle just arrived!',
                effect: { newCar: true }
            },
            {
                type: 'test_drive',
                message: 'Free test drive event!',
                effect: { freeTestDrive: true, duration: 600000 } // 10 minutes
            },
            {
                type: 'rare_spawn',
                message: 'Rare vehicle spotted in showroom!',
                effect: { rareCar: true }
            }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        window.dispatchEvent(new CustomEvent('showroom:event', {
            detail: {
                showroom: cityName,
                event: randomEvent
            }
        }));
        
        return randomEvent;
    }
    
    // Showroom customization
    customizeShowroom(cityName, customizations) {
        const showroom = this.showrooms[cityName];
        if (!showroom) return false;
        
        if (!showroom.customizations) {
            showroom.customizations = {};
        }
        
        Object.assign(showroom.customizations, customizations);
        
        window.dispatchEvent(new CustomEvent('showroom:customized', {
            detail: { showroom: cityName, customizations }
        }));
        
        return true;
    }
    
    // Showroom statistics
    getShowroomStats() {
        const stats = {};
        
        Object.keys(this.showrooms).forEach(cityName => {
            const showroom = this.showrooms[cityName];
            const visitorCount = this.visitorCount.get(cityName) || 0;
            
            stats[cityName] = {
                name: showroom.name,
                unlocked: showroom.unlocked,
                visitorCount,
                carCount: showroom.cars.length,
                specialFeatures: showroom.specialFeatures?.length || 0
            };
        });
        
        return stats;
    }
    
    // Showroom achievements
    checkShowroomAchievements() {
        const achievements = [];
        const totalVisitors = Array.from(this.visitorCount.values()).reduce((a, b) => a + b, 0);
        const unlockedCount = this.getUnlockedShowrooms().length;
        
        if (totalVisitors >= 100) {
            achievements.push({
                id: 'showroom_visitor_100',
                title: 'Showroom Explorer',
                description: 'Visited showrooms 100 times',
                icon: 'explorer_badge'
            });
        }
        
        if (unlockedCount >= 4) {
            achievements.push({
                id: 'showroom_master',
                title: 'Showroom Master',
                description: 'Unlocked all special city showrooms',
                icon: 'master_badge'
            });
        }
        
        if (this.visitorCount.get('skyCity') >= 50) {
            achievements.push({
                id: 'sky_showroom_regular',
                title: 'Sky High Shopper',
                description: 'Visited Sky City showroom 50 times',
                icon: 'sky_badge'
            });
        }
        
        return achievements;
    }
    
    // City features management
    getCityFeatures(cityName) {
        return this.cityFeatures[cityName] || null;
    }
    
    getFeatureInfo(cityName, featureType) {
        const features = this.getCityFeatures(cityName);
        return features ? features[featureType] : null;
    }
    
    getAllCityFeatures() {
        return this.cityFeatures;
    }
    
    // Enter a city feature
    enterFeature(cityName, featureType) {
        const feature = this.getFeatureInfo(cityName, featureType);
        if (!feature) {
            return { success: false, message: 'Feature not found' };
        }
        
        // Check if city is unlocked
        const showroom = this.getShowroom(cityName);
        if (!showroom || !showroom.unlocked) {
            return { success: false, message: 'City not unlocked' };
        }
        
        // Track feature visits
        const visitKey = `${cityName}_${featureType}`;
        const count = this.visitorCount.get(visitKey) || 0;
        this.visitorCount.set(visitKey, count + 1);
        
        window.dispatchEvent(new CustomEvent('city-feature:enter', {
            detail: {
                city: cityName,
                feature: featureType,
                featureInfo: feature,
                visitCount: count + 1
            }
        }));
        
        return {
            success: true,
            message: `Welcome to ${feature.name}!`,
            feature: feature,
            visitCount: count + 1
        };
    }
    
    // Get available features for a city
    getAvailableFeatures(cityName) {
        const features = this.getCityFeatures(cityName);
        if (!features) return [];
        
        const showroom = this.getShowroom(cityName);
        if (!showroom || !showroom.unlocked) return [];
        
        return Object.keys(features).map(featureType => ({
            type: featureType,
            name: features[featureType].name,
            description: features[featureType].description
        }));
    }
    
    // Check if a feature is available
    isFeatureAvailable(cityName, featureType) {
        const showroom = this.getShowroom(cityName);
        if (!showroom || !showroom.unlocked) return false;
        
        const features = this.getCityFeatures(cityName);
        return features && features[featureType];
    }
    
    // Get feature visit statistics
    getFeatureStats() {
        const stats = {};
        
        Object.keys(this.cityFeatures).forEach(cityName => {
            stats[cityName] = {};
            const features = this.getCityFeatures(cityName);
            
            if (features) {
                Object.keys(features).forEach(featureType => {
                    const visitKey = `${cityName}_${featureType}`;
                    stats[cityName][featureType] = {
                        name: features[featureType].name,
                        visits: this.visitorCount.get(visitKey) || 0,
                        available: this.isFeatureAvailable(cityName, featureType)
                    };
                });
            }
        });
        
        return stats;
    }
    
    // City feature achievements
    checkCityFeatureAchievements() {
        const achievements = [];
        const stats = this.getFeatureStats();
        
        // Check for city explorer achievements
        Object.keys(stats).forEach(cityName => {
            if (cityName === 'main') return; // Skip main city
            
            const cityStats = stats[cityName];
            const totalVisits = Object.values(cityStats).reduce((sum, feature) => sum + feature.visits, 0);
            
            if (totalVisits >= 50) {
                achievements.push({
                    id: `${cityName}_explorer`,
                    title: `${cityName.charAt(0).toUpperCase() + cityName.slice(1)} Explorer`,
                    description: `Visited all features in ${cityName} 50 times`,
                    icon: `${cityName}_badge`
                });
            }
        });
        
        // Check for feature master achievements
        const allFeatures = ['showroom', 'garage', 'auctionHouse', 'raceTrack', 'bettingOffice', 'junkyard', 'home', 'craftingStation', 'missionsOffice', 'leaderboard'];
        
        allFeatures.forEach(featureType => {
            let totalVisits = 0;
            Object.keys(stats).forEach(cityName => {
                if (stats[cityName][featureType]) {
                    totalVisits += stats[cityName][featureType].visits;
                }
            });
            
            if (totalVisits >= 100) {
                achievements.push({
                    id: `${featureType}_master`,
                    title: `${featureType.charAt(0).toUpperCase() + featureType.slice(1)} Master`,
                    description: `Visited ${featureType} features 100 times across all cities`,
                    icon: `${featureType}_badge`
                });
            }
        });
        
        return achievements;
    }
}
