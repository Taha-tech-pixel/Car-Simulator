export class CityEventsManager {
    constructor() {
        this.events = {
            active: [],
            scheduled: [],
            completed: []
        };
        
        this.eventTypes = {
            portal: {
                name: 'Mysterious Portal',
                description: 'A portal opens to a special city',
                duration: 300000, // 5 minutes
                cooldown: 3600000, // 1 hour
                probability: 0.01, // 1% chance per hour
                cities: ['skyCity', 'volcanoCity', 'undergroundCity', 'waterCity']
            },
            meteor: {
                name: 'Meteor Shower',
                description: 'Meteors fall from the sky, creating rare materials',
                duration: 600000, // 10 minutes
                cooldown: 7200000, // 2 hours
                probability: 0.005, // 0.5% chance per hour
                rewards: ['rare_materials', 'crystal_fragments']
            },
            aurora: {
                name: 'Aurora Borealis',
                description: 'Beautiful aurora lights enhance vehicle performance',
                duration: 1800000, // 30 minutes
                cooldown: 10800000, // 3 hours
                probability: 0.003, // 0.3% chance per hour
                effects: ['performance_boost', 'fuel_efficiency']
            },
            earthquake: {
                name: 'Underground Tremor',
                description: 'Earthquake reveals hidden underground passages',
                duration: 900000, // 15 minutes
                cooldown: 14400000, // 4 hours
                probability: 0.002, // 0.2% chance per hour
                unlocks: ['undergroundCity']
            },
            tsunami: {
                name: 'Ocean Wave',
                description: 'Massive wave reveals water city access',
                duration: 1200000, // 20 minutes
                cooldown: 18000000, // 5 hours
                probability: 0.001, // 0.1% chance per hour
                unlocks: ['waterCity']
            },
            volcano: {
                name: 'Volcanic Eruption',
                description: 'Volcano eruption creates new paths to fire city',
                duration: 1500000, // 25 minutes
                cooldown: 21600000, // 6 hours
                probability: 0.001, // 0.1% chance per hour
                unlocks: ['volcanoCity']
            },
            storm: {
                name: 'Sky Storm',
                description: 'Powerful storm creates wind currents to sky city',
                duration: 1800000, // 30 minutes
                cooldown: 25200000, // 7 hours
                probability: 0.001, // 0.1% chance per hour
                unlocks: ['skyCity']
            }
        };
        
        this.lastEventCheck = Date.now();
        this.eventCheckInterval = 300000; // Check every 5 minutes
    }
    
    start() {
        // Start the event checking loop
        setInterval(() => {
            this.checkForEvents();
        }, this.eventCheckInterval);
        
        console.log('🌍 City Events Manager started');
    }
    
    checkForEvents() {
        const now = Date.now();
        const timeSinceLastCheck = now - this.lastEventCheck;
        
        // Check each event type
        Object.entries(this.eventTypes).forEach(([eventType, config]) => {
            if (this.shouldTriggerEvent(eventType, timeSinceLastCheck)) {
                this.triggerEvent(eventType);
            }
        });
        
        // Update active events
        this.updateActiveEvents();
        
        this.lastEventCheck = now;
    }
    
    shouldTriggerEvent(eventType, timeSinceLastCheck) {
        const config = this.eventTypes[eventType];
        const lastEvent = this.getLastEventOfType(eventType);
        
        // Check cooldown
        if (lastEvent && (now - lastEvent.startTime) < config.cooldown) {
            return false;
        }
        
        // Check if event is already active
        if (this.isEventActive(eventType)) {
            return false;
        }
        
        // Calculate probability based on time passed
        const hoursPassed = timeSinceLastCheck / (1000 * 60 * 60);
        const probability = config.probability * hoursPassed;
        
        return Math.random() < probability;
    }
    
    triggerEvent(eventType) {
        const config = this.eventTypes[eventType];
        const event = {
            id: this.generateEventId(),
            type: eventType,
            name: config.name,
            description: config.description,
            startTime: Date.now(),
            endTime: Date.now() + config.duration,
            config: config,
            participants: new Set(),
            rewards: []
        };
        
        this.events.active.push(event);
        
        // Notify all players
        window.dispatchEvent(new CustomEvent('city-event:started', {
            detail: { event }
        }));
        
        console.log(`🌍 City Event Started: ${event.name}`);
        
        // Schedule event end
        setTimeout(() => {
            this.endEvent(event.id);
        }, config.duration);
        
        return event;
    }
    
    endEvent(eventId) {
        const eventIndex = this.events.active.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return;
        
        const event = this.events.active[eventIndex];
        this.events.active.splice(eventIndex, 1);
        this.events.completed.push(event);
        
        // Distribute rewards
        this.distributeEventRewards(event);
        
        // Notify all players
        window.dispatchEvent(new CustomEvent('city-event:ended', {
            detail: { event }
        }));
        
        console.log(`🌍 City Event Ended: ${event.name}`);
    }
    
    distributeEventRewards(event) {
        event.participants.forEach(playerId => {
            const rewards = this.calculateEventRewards(event);
            
            window.dispatchEvent(new CustomEvent('city-event:rewards', {
                detail: { 
                    playerId, 
                    event: event.type, 
                    rewards 
                }
            }));
        });
    }
    
    calculateEventRewards(event) {
        const rewards = [];
        
        switch (event.type) {
            case 'portal':
                rewards.push({
                    type: 'city_unlock',
                    value: event.config.cities[Math.floor(Math.random() * event.config.cities.length)]
                });
                break;
                
            case 'meteor':
                rewards.push({
                    type: 'materials',
                    value: 'rare_materials',
                    amount: Math.floor(Math.random() * 5) + 1
                });
                break;
                
            case 'aurora':
                rewards.push({
                    type: 'performance_boost',
                    value: 'temporary_boost',
                    duration: 3600000 // 1 hour
                });
                break;
                
            case 'earthquake':
            case 'tsunami':
            case 'volcano':
            case 'storm':
                rewards.push({
                    type: 'city_unlock',
                    value: event.config.unlocks[0]
                });
                break;
        }
        
        return rewards;
    }
    
    joinEvent(playerId, eventId) {
        const event = this.events.active.find(e => e.id === eventId);
        if (!event) return false;
        
        event.participants.add(playerId);
        
        window.dispatchEvent(new CustomEvent('city-event:joined', {
            detail: { playerId, event }
        }));
        
        return true;
    }
    
    leaveEvent(playerId, eventId) {
        const event = this.events.active.find(e => e.id === eventId);
        if (!event) return false;
        
        event.participants.delete(playerId);
        
        window.dispatchEvent(new CustomEvent('city-event:left', {
            detail: { playerId, event }
        }));
        
        return true;
    }
    
    getActiveEvents() {
        return this.events.active;
    }
    
    getEventById(eventId) {
        return this.events.active.find(e => e.id === eventId) || 
               this.events.completed.find(e => e.id === eventId);
    }
    
    isEventActive(eventType) {
        return this.events.active.some(e => e.type === eventType);
    }
    
    getLastEventOfType(eventType) {
        const allEvents = [...this.events.active, ...this.events.completed];
        return allEvents
            .filter(e => e.type === eventType)
            .sort((a, b) => b.startTime - a.startTime)[0];
    }
    
    updateActiveEvents() {
        const now = Date.now();
        this.events.active = this.events.active.filter(event => {
            if (now >= event.endTime) {
                this.endEvent(event.id);
                return false;
            }
            return true;
        });
    }
    
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Manual event triggering (for testing)
    triggerEventManually(eventType) {
        if (!this.eventTypes[eventType]) {
            return { success: false, message: 'Invalid event type' };
        }
        
        if (this.isEventActive(eventType)) {
            return { success: false, message: 'Event already active' };
        }
        
        const event = this.triggerEvent(eventType);
        return { success: true, message: `Triggered ${event.name}`, event };
    }
    
    // Event statistics
    getEventStats() {
        const stats = {
            totalEvents: this.events.completed.length,
            activeEvents: this.events.active.length,
            eventTypes: {}
        };
        
        // Count events by type
        this.events.completed.forEach(event => {
            if (!stats.eventTypes[event.type]) {
                stats.eventTypes[event.type] = 0;
            }
            stats.eventTypes[event.type]++;
        });
        
        return stats;
    }
    
    // Get upcoming events (scheduled)
    getUpcomingEvents() {
        return this.events.scheduled;
    }
    
    // Schedule a future event
    scheduleEvent(eventType, delay) {
        const config = this.eventTypes[eventType];
        if (!config) return false;
        
        const scheduledEvent = {
            type: eventType,
            scheduledTime: Date.now() + delay,
            config: config
        };
        
        this.events.scheduled.push(scheduledEvent);
        
        // Set timeout to trigger the event
        setTimeout(() => {
            this.triggerEvent(eventType);
            // Remove from scheduled
            const index = this.events.scheduled.indexOf(scheduledEvent);
            if (index > -1) {
                this.events.scheduled.splice(index, 1);
            }
        }, delay);
        
        return true;
    }
}
