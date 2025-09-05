export class DamageManager {
    constructor() {
        this.instanceDamage = new Map(); // instanceId -> 0..1
        this.repairCostPerUnit = 500;
    }

    getDamage(instanceId) {
        return this.instanceDamage.get(instanceId) || 0;
    }

    applyDamage(instanceId, amount) {
        const d = Math.min(1, this.getDamage(instanceId) + amount);
        this.instanceDamage.set(instanceId, d);
        return d;
    }

    repair(instanceId) {
        const d = this.getDamage(instanceId);
        this.instanceDamage.set(instanceId, 0);
        const cost = Math.ceil(d * this.repairCostPerUnit * 100);
        return cost;
    }

    performanceMultiplier(instanceId) {
        const d = this.getDamage(instanceId);
        return Math.max(0.5, 1 - d * 0.5);
    }
}


