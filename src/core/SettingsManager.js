export class SettingsManager {
    constructor() {
        this.keybinds = {
            photo: 'KeyP',
            replay: 'KeyR'
        };
        this.accessibility = {
            colorblind: 'none', // none | deuter | prot | trit
            uiScale: 1.0,
            reduceMotion: false,
            reduceBloom: false
        };
        
        // Graphics settings with automatic detection
        this.graphics = this.detectOptimalGraphics();
        
        // Player progression levels
        this.levels = {
            auction: 1,
            betting: 1,
            racing: 1,
            trading: 1
        };
        
        // Titles and achievements
        this.titles = [];
        this.achievements = [];
        
        // Special city access
        this.specialCities = {
            skyCity: false,
            volcanoCity: false,
            undergroundCity: false,
            waterCity: false
        };
        
        // Trading system
        this.trading = {
            enabled: true,
            cooldown: 300000, // 5 minutes between trades
            lastTrade: 0
        };
    }
    
    detectOptimalGraphics() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return {
                quality: 'low',
                shadows: false,
                particles: false,
                reflections: false,
                antialiasing: false,
                textureQuality: 'low',
                renderDistance: 500
            };
        }
        
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        const memory = navigator.deviceMemory || 4; // GB
        const cores = navigator.hardwareConcurrency || 4;
        
        // Detect GPU capabilities
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        
        let quality = 'medium';
        let shadows = true;
        let particles = true;
        let reflections = true;
        let antialiasing = true;
        let textureQuality = 'medium';
        let renderDistance = 1000;
        
        // High-end detection
        if (memory >= 8 && cores >= 8 && maxTextureSize >= 4096) {
            quality = 'ultra';
            renderDistance = 2000;
            textureQuality = 'ultra';
        }
        // Medium-end detection
        else if (memory >= 4 && cores >= 4 && maxTextureSize >= 2048) {
            quality = 'high';
            renderDistance = 1500;
            textureQuality = 'high';
        }
        // Low-end detection
        else if (memory < 4 || cores < 4 || maxTextureSize < 1024) {
            quality = 'low';
            shadows = false;
            particles = false;
            reflections = false;
            antialiasing = false;
            textureQuality = 'low';
            renderDistance = 500;
        }
        
        // Mobile device detection
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            quality = 'mobile';
            shadows = false;
            particles = false;
            reflections = false;
            antialiasing = false;
            textureQuality = 'low';
            renderDistance = 300;
        }
        
        return {
            quality,
            shadows,
            particles,
            reflections,
            antialiasing,
            textureQuality,
            renderDistance,
            autoDetected: true,
            deviceInfo: {
                memory,
                cores,
                maxTextureSize,
                renderer,
                vendor
            }
        };
    }
    
    updateGraphicsSettings(settings) {
        this.graphics = { ...this.graphics, ...settings };
        this.saveSettings();
    }
    
    getGraphicsSettings() {
        return this.graphics;
    }
    
    // Level progression methods
    increaseLevel(type, amount = 1) {
        if (this.levels[type]) {
            this.levels[type] += amount;
            this.checkLevelAchievements(type);
            this.saveSettings();
        }
    }
    
    getLevel(type) {
        return this.levels[type] || 1;
    }
    
    // Achievement system
    checkLevelAchievements(type) {
        const level = this.levels[type];
        const achievements = this.getLevelAchievements(type, level);
        
        achievements.forEach(achievement => {
            if (!this.achievements.includes(achievement.id)) {
                this.achievements.push(achievement.id);
                this.unlockTitle(achievement.title);
                this.showAchievementNotification(achievement);
            }
        });
    }
    
    getLevelAchievements(type, level) {
        const achievements = [];
        
        if (level >= 5) {
            achievements.push({
                id: `${type}_novice`,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Novice`,
                description: `Reached level 5 in ${type}`
            });
        }
        
        if (level >= 10) {
            achievements.push({
                id: `${type}_expert`,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Expert`,
                description: `Reached level 10 in ${type}`
            });
        }
        
        if (level >= 25) {
            achievements.push({
                id: `${type}_master`,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Master`,
                description: `Reached level 25 in ${type}`
            });
        }
        
        if (level >= 50) {
            achievements.push({
                id: `${type}_legend`,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Legend`,
                description: `Reached level 50 in ${type}`
            });
        }
        
        return achievements;
    }
    
    unlockTitle(title) {
        if (!this.titles.includes(title)) {
            this.titles.push(title);
        }
    }
    
    showAchievementNotification(achievement) {
        // This would trigger a UI notification
        console.log(`Achievement Unlocked: ${achievement.title} - ${achievement.description}`);
    }
    
    // Special city access
    unlockSpecialCity(cityName) {
        if (this.specialCities[cityName] !== undefined) {
            this.specialCities[cityName] = true;
            this.saveSettings();
        }
    }
    
    hasAccessToCity(cityName) {
        return this.specialCities[cityName] || false;
    }
    
    // Trading system
    canTrade() {
        const now = Date.now();
        return (now - this.trading.lastTrade) >= this.trading.cooldown;
    }
    
    setLastTrade() {
        this.trading.lastTrade = Date.now();
        this.saveSettings();
    }
    
    // Save/Load settings
    saveSettings() {
        const settings = {
            graphics: this.graphics,
            levels: this.levels,
            titles: this.titles,
            achievements: this.achievements,
            specialCities: this.specialCities,
            trading: this.trading
        };
        localStorage.setItem('gameSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.graphics = { ...this.graphics, ...settings.graphics };
            this.levels = { ...this.levels, ...settings.levels };
            this.titles = settings.titles || [];
            this.achievements = settings.achievements || [];
            this.specialCities = { ...this.specialCities, ...settings.specialCities };
            this.trading = { ...this.trading, ...settings.trading };
        }
    }
}


