export class AchievementsManager {
    constructor(carManager) {
        this.carManager = carManager;
        this.achievements = this.initializeAchievements();
        this.unlocked = new Set();
    }

    initializeAchievements() {
        return {
            'collector-specific': { check: (player) => player.cars.some(c => c.id === 'bugatti-chiron'), title: 'Hyper Icon' },
            'collector-category': { check: (player) => this.hasAllInCategory(player, 'sports'), title: 'Sports Set Complete' },
            'collector-all': { check: (player) => this.hasAllCars(player), title: 'Garage Tycoon' }
        };
    }

    hasAllInCategory(player, category) {
        const all = Object.values(this.carManager.getAllCarData()).flat().filter(c => c.category === category).map(c => c.id);
        const owned = new Set(player.cars.map(c => c.id));
        return all.every(id => owned.has(id));
    }

    hasAllCars(player) {
        const all = Object.values(this.carManager.getAllCarData()).flat().map(c => c.id);
        const owned = new Set(player.cars.map(c => c.id));
        return all.every(id => owned.has(id));
    }

    evaluate(player) {
        Object.entries(this.achievements).forEach(([id, def]) => {
            if (!this.unlocked.has(id) && def.check(player)) {
                this.unlocked.add(id);
                window.dispatchEvent(new CustomEvent('achievement:unlocked', { detail: { id, title: def.title } }));
            }
        });
    }
}


