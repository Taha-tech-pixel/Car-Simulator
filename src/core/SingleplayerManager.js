export class SingleplayerManager {
    constructor(game) {
        this.game = game;
        this.enabled = true;
        this.playerProfile = {
            id: 'sp-player',
            name: 'Solo Driver',
            money: 100000,
            level: 1,
            experience: 0,
            distanceDriven: 0,
            cars: []
        };
    }

    start() {
        this.enabled = true;
    }

    stop() {
        this.enabled = false;
    }

    update(deltaTime) {
        if (!this.enabled) return;
        // Track simple solo progression, e.g., distance over time placeholder
        this.playerProfile.distanceDriven += deltaTime * 10;
    }
}


