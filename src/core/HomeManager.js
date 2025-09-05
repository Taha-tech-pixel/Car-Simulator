export class HomeManager {
    constructor() {
        this.storage = { parts: {}, cars: [] };
        this.location = { name: 'Player Home', x: 20, y: 0, z: -30 };
    }

    storePart(partId, qty = 1) {
        this.storage.parts[partId] = (this.storage.parts[partId] || 0) + qty;
    }

    storeCar(car) {
        this.storage.cars.push(car);
    }
}


