export class DevToolsManager {
    constructor() {
        this.enabled = false;
        this.commands = new Map();
        this.initializeCommands();
        this.setupKeyboardShortcuts();
    }
    
    initializeCommands() {
        // Teleport commands
        this.commands.set('tp', {
            description: 'Teleport to coordinates or city',
            usage: 'tp <x> <y> <z> OR tp <cityName>',
            execute: (args) => this.teleportCommand(args)
        });
        
        this.commands.set('teleport', {
            description: 'Alias for tp command',
            usage: 'teleport <x> <y> <z> OR teleport <cityName>',
            execute: (args) => this.teleportCommand(args)
        });
        
        // City management
        this.commands.set('unlock-city', {
            description: 'Unlock a special city',
            usage: 'unlock-city <cityName>',
            execute: (args) => this.unlockCityCommand(args)
        });
        
        this.commands.set('list-cities', {
            description: 'List all available cities',
            usage: 'list-cities',
            execute: () => this.listCitiesCommand()
        });
        
        // Player management
        this.commands.set('give-money', {
            description: 'Give money to player',
            usage: 'give-money <amount>',
            execute: (args) => this.giveMoneyCommand(args)
        });
        
        this.commands.set('give-car', {
            description: 'Give a car to player',
            usage: 'give-car <carId>',
            execute: (args) => this.giveCarCommand(args)
        });
        
        this.commands.set('level-up', {
            description: 'Increase player level',
            usage: 'level-up <type> <amount>',
            execute: (args) => this.levelUpCommand(args)
        });
        
        // Graphics settings
        this.commands.set('graphics', {
            description: 'Change graphics settings',
            usage: 'graphics <setting> <value>',
            execute: (args) => this.graphicsCommand(args)
        });
        
        this.commands.set('fps', {
            description: 'Toggle FPS display',
            usage: 'fps',
            execute: () => this.toggleFPSCommand()
        });
        
        // Weather and environment
        this.commands.set('weather', {
            description: 'Change weather',
            usage: 'weather <type>',
            execute: (args) => this.weatherCommand(args)
        });
        
        this.commands.set('time', {
            description: 'Set time of day',
            usage: 'time <hour>',
            execute: (args) => this.timeCommand(args)
        });
        
        // Debug commands
        this.commands.set('debug', {
            description: 'Toggle debug mode',
            usage: 'debug',
            execute: () => this.toggleDebugCommand()
        });
        
        this.commands.set('info', {
            description: 'Show player info',
            usage: 'info',
            execute: () => this.showInfoCommand()
        });
        
        // City features commands
        this.commands.set('city-features', {
            description: 'List all features in a city',
            usage: 'city-features <cityName>',
            execute: (args) => this.cityFeaturesCommand(args)
        });
        
        this.commands.set('tp-feature', {
            description: 'Teleport to a specific feature in a city',
            usage: 'tp-feature <cityName> <featureType>',
            execute: (args) => this.teleportToFeatureCommand(args)
        });
        
        this.commands.set('list-features', {
            description: 'List all available feature types',
            usage: 'list-features',
            execute: () => this.listFeaturesCommand()
        });
        
        // Help command
        this.commands.set('help', {
            description: 'Show available commands',
            usage: 'help [command]',
            execute: (args) => this.helpCommand(args)
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Toggle dev tools with F12
            if (event.key === 'F12') {
                event.preventDefault();
                this.toggleDevTools();
            }
            
            // Open command console with `
            if (event.key === '`' || event.key === '~') {
                event.preventDefault();
                this.toggleCommandConsole();
            }
        });
    }
    
    toggleDevTools() {
        this.enabled = !this.enabled;
        window.dispatchEvent(new CustomEvent('dev-tools:toggle', { 
            detail: { enabled: this.enabled } 
        }));
        
        if (this.enabled) {
            console.log('🔧 Dev Tools Enabled');
            console.log('Available commands:', Array.from(this.commands.keys()).join(', '));
            console.log('Type "help" for command list or use F12 to toggle');
        } else {
            console.log('🔧 Dev Tools Disabled');
        }
    }
    
    toggleCommandConsole() {
        window.dispatchEvent(new CustomEvent('dev-tools:console:toggle'));
    }
    
    executeCommand(input) {
        if (!this.enabled) {
            return { success: false, message: 'Dev tools not enabled. Press F12 to enable.' };
        }
        
        const parts = input.trim().split(' ');
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        const command = this.commands.get(commandName);
        if (!command) {
            return { success: false, message: `Unknown command: ${commandName}. Type "help" for available commands.` };
        }
        
        try {
            return command.execute(args);
        } catch (error) {
            return { success: false, message: `Error executing command: ${error.message}` };
        }
    }
    
    // Command implementations
    teleportCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: tp <x> <y> <z> OR tp <cityName>' };
        }
        
        // Check if it's a city name
        const cityNames = ['skyCity', 'volcanoCity', 'undergroundCity', 'waterCity', 'main'];
        const cityName = args[0];
        
        if (cityNames.includes(cityName)) {
            window.dispatchEvent(new CustomEvent('dev-tools:teleport', {
                detail: { type: 'city', destination: cityName }
            }));
            return { success: true, message: `Teleporting to ${cityName}...` };
        }
        
        // Parse coordinates
        if (args.length >= 3) {
            const x = parseFloat(args[0]);
            const y = parseFloat(args[1]);
            const z = parseFloat(args[2]);
            
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                return { success: false, message: 'Invalid coordinates. Use numbers for x, y, z.' };
            }
            
            window.dispatchEvent(new CustomEvent('dev-tools:teleport', {
                detail: { type: 'coordinates', x, y, z }
            }));
            return { success: true, message: `Teleporting to (${x}, ${y}, ${z})...` };
        }
        
        return { success: false, message: 'Invalid teleport destination.' };
    }
    
    unlockCityCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: unlock-city <cityName>' };
        }
        
        const cityName = args[0];
        const validCities = ['skyCity', 'volcanoCity', 'undergroundCity', 'waterCity'];
        
        if (!validCities.includes(cityName)) {
            return { success: false, message: `Invalid city. Valid cities: ${validCities.join(', ')}` };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:unlock-city', {
            detail: { cityName }
        }));
        return { success: true, message: `Unlocked ${cityName}!` };
    }
    
    listCitiesCommand() {
        const cities = [
            'main - Main city (default)',
            'skyCity - Floating city in the clouds',
            'volcanoCity - City built on an active volcano',
            'undergroundCity - Hidden city beneath the surface',
            'waterCity - City floating on the ocean'
        ];
        
        return { success: true, message: 'Available cities:\n' + cities.join('\n') };
    }
    
    giveMoneyCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: give-money <amount>' };
        }
        
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return { success: false, message: 'Invalid amount. Use a positive number.' };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:give-money', {
            detail: { amount }
        }));
        return { success: true, message: `Gave $${amount.toLocaleString()} to player.` };
    }
    
    giveCarCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: give-car <carId>' };
        }
        
        const carId = args[0];
        window.dispatchEvent(new CustomEvent('dev-tools:give-car', {
            detail: { carId }
        }));
        return { success: true, message: `Gave car ${carId} to player.` };
    }
    
    levelUpCommand(args) {
        if (args.length < 2) {
            return { success: false, message: 'Usage: level-up <type> <amount>' };
        }
        
        const type = args[0];
        const amount = parseInt(args[1]);
        
        const validTypes = ['auction', 'betting', 'racing', 'trading'];
        if (!validTypes.includes(type)) {
            return { success: false, message: `Invalid type. Valid types: ${validTypes.join(', ')}` };
        }
        
        if (isNaN(amount) || amount <= 0) {
            return { success: false, message: 'Invalid amount. Use a positive number.' };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:level-up', {
            detail: { type, amount }
        }));
        return { success: true, message: `Increased ${type} level by ${amount}.` };
    }
    
    graphicsCommand(args) {
        if (args.length < 2) {
            return { success: false, message: 'Usage: graphics <setting> <value>' };
        }
        
        const setting = args[0];
        const value = args[1];
        
        const validSettings = ['quality', 'shadows', 'particles', 'reflections', 'antialiasing'];
        if (!validSettings.includes(setting)) {
            return { success: false, message: `Invalid setting. Valid settings: ${validSettings.join(', ')}` };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:graphics', {
            detail: { setting, value }
        }));
        return { success: true, message: `Set ${setting} to ${value}.` };
    }
    
    toggleFPSCommand() {
        window.dispatchEvent(new CustomEvent('dev-tools:toggle-fps'));
        return { success: true, message: 'Toggled FPS display.' };
    }
    
    weatherCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: weather <type>' };
        }
        
        const weatherType = args[0];
        const validWeather = ['clear', 'rain', 'snow', 'fog', 'storm', 'ash_rain'];
        
        if (!validWeather.includes(weatherType)) {
            return { success: false, message: `Invalid weather. Valid types: ${validWeather.join(', ')}` };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:weather', {
            detail: { weatherType }
        }));
        return { success: true, message: `Changed weather to ${weatherType}.` };
    }
    
    timeCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: time <hour>' };
        }
        
        const hour = parseInt(args[0]);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            return { success: false, message: 'Invalid hour. Use a number between 0-23.' };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:time', {
            detail: { hour }
        }));
        return { success: true, message: `Set time to ${hour}:00.` };
    }
    
    toggleDebugCommand() {
        window.dispatchEvent(new CustomEvent('dev-tools:toggle-debug'));
        return { success: true, message: 'Toggled debug mode.' };
    }
    
    showInfoCommand() {
        window.dispatchEvent(new CustomEvent('dev-tools:show-info'));
        return { success: true, message: 'Showing player info...' };
    }
    
    cityFeaturesCommand(args) {
        if (args.length === 0) {
            return { success: false, message: 'Usage: city-features <cityName>' };
        }
        
        const cityName = args[0];
        const validCities = ['main', 'skyCity', 'volcanoCity', 'undergroundCity', 'waterCity'];
        
        if (!validCities.includes(cityName)) {
            return { success: false, message: `Invalid city. Valid cities: ${validCities.join(', ')}` };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:city-features', {
            detail: { cityName }
        }));
        
        return { success: true, message: `Listing features for ${cityName}...` };
    }
    
    teleportToFeatureCommand(args) {
        if (args.length < 2) {
            return { success: false, message: 'Usage: tp-feature <cityName> <featureType>' };
        }
        
        const cityName = args[0];
        const featureType = args[1];
        
        const validCities = ['main', 'skyCity', 'volcanoCity', 'undergroundCity', 'waterCity'];
        const validFeatures = ['showroom', 'garage', 'auctionHouse', 'raceTrack', 'bettingOffice', 'junkyard', 'home', 'craftingStation', 'missionsOffice', 'leaderboard'];
        
        if (!validCities.includes(cityName)) {
            return { success: false, message: `Invalid city. Valid cities: ${validCities.join(', ')}` };
        }
        
        if (!validFeatures.includes(featureType)) {
            return { success: false, message: `Invalid feature. Valid features: ${validFeatures.join(', ')}` };
        }
        
        window.dispatchEvent(new CustomEvent('dev-tools:teleport-to-feature', {
            detail: { cityName, featureType }
        }));
        
        return { success: true, message: `Teleporting to ${featureType} in ${cityName}...` };
    }
    
    listFeaturesCommand() {
        const features = [
            'showroom - Vehicle showroom',
            'garage - Vehicle storage and customization',
            'auctionHouse - Buy and sell vehicles',
            'raceTrack - Racing competitions',
            'bettingOffice - Place bets on races',
            'junkyard - Find scrap and parts',
            'home - Player residence',
            'craftingStation - Craft items and upgrades',
            'missionsOffice - Accept missions',
            'leaderboard - View rankings'
        ];
        
        return { success: true, message: 'Available feature types:\n' + features.join('\n') };
    }
    
    helpCommand(args) {
        if (args.length === 0) {
            // Show all commands
            const commandList = Array.from(this.commands.entries())
                .map(([name, cmd]) => `${name} - ${cmd.description}`)
                .join('\n');
            
            return { 
                success: true, 
                message: `Available commands:\n${commandList}\n\nType "help <command>" for detailed usage.` 
            };
        } else {
            // Show specific command help
            const commandName = args[0].toLowerCase();
            const command = this.commands.get(commandName);
            
            if (!command) {
                return { success: false, message: `Unknown command: ${commandName}` };
            }
            
            return { 
                success: true, 
                message: `${commandName}: ${command.description}\nUsage: ${command.usage}` 
            };
        }
    }
    
    // Public API for external access
    isEnabled() {
        return this.enabled;
    }
    
    getCommands() {
        return Array.from(this.commands.keys());
    }
    
    getCommandInfo(commandName) {
        return this.commands.get(commandName.toLowerCase());
    }
}
