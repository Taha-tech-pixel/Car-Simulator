export class TuningManager {
    constructor() {
        this.tunes = new Map(); // carId -> tuning settings
    }

    getTune(carId) {
        return this.tunes.get(carId) || { gearRatio: 1.0, tireGrip: 1.0, downforce: 1.0 };
    }

    setTune(carId, tune) {
        const current = this.getTune(carId);
        this.tunes.set(carId, { ...current, ...tune });
    }

    applyPerformance(base, tune) {
        return {
            topSpeed: base.topSpeed * (0.9 + 0.2 * tune.gearRatio),
            acceleration: base.acceleration * (1.05 - 0.1 * tune.gearRatio),
            handling: base.handling * (0.9 + 0.2 * (tune.tireGrip + tune.downforce) / 2)
        };
    }
}


