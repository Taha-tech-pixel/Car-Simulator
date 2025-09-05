export class CraftingManager {
    constructor() {
        this.scrapInventory = new Map();
        this.recipes = this.initializeRecipes();
    }

    initializeRecipes() {
        return {
            'basic-chassis': { parts: { 'metal-scrap': 20, 'frame-joint': 4 } },
            'sport-engine': { parts: { 'metal-scrap': 30, 'engine-core': 1 } },
            'aero-kit': { parts: { 'carbon-fiber': 10, 'plastic-scrap': 15 } },
            'propeller': { parts: { 'metal-scrap': 40, 'engine-core': 2 } },
            'water-jet': { parts: { 'metal-scrap': 35, 'impeller': 1 } }
        };
    }

    addScrap(partId, amount = 1) {
        const current = this.scrapInventory.get(partId) || 0;
        this.scrapInventory.set(partId, current + amount);
    }

    hasParts(parts) {
        return Object.entries(parts).every(([partId, qty]) => (this.scrapInventory.get(partId) || 0) >= qty);
    }

    consumeParts(parts) {
        Object.entries(parts).forEach(([partId, qty]) => {
            const current = this.scrapInventory.get(partId) || 0;
            this.scrapInventory.set(partId, Math.max(0, current - qty));
        });
    }

    craft(itemId) {
        const recipe = this.recipes[itemId];
        if (!recipe) return { success: false, reason: 'unknown-recipe' };
        if (!this.hasParts(recipe.parts)) return { success: false, reason: 'missing-parts' };
        this.consumeParts(recipe.parts);
        return { success: true, itemId };
    }
}


