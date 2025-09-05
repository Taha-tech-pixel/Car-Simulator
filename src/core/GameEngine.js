export class GameEngine {
    constructor() {
        this.gameState = {
            isRunning: false,
            currentScene: 'mainMenu',
            player: null,
            cars: new Map(),
            auctions: new Map(),
            races: new Map(),
            showrooms: new Map(),
            missions: new Map(),
            achievements: new Map(),
            junkyards: new Map(),
            leaderboards: {
                carsOwned: [],
                money: [],
                distance: []
            }
        };
        
        this.eventListeners = new Map();
        this.updateCallbacks = [];
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                callback(data);
            });
        }
    }

    // Update system
    addUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    update(deltaTime) {
        this.updateCallbacks.forEach(callback => {
            callback(deltaTime);
        });
    }

    // Game state management
    setGameState(newState) {
        this.gameState = { ...this.gameState, ...newState };
        this.emit('gameStateChanged', this.gameState);
    }

    getGameState() {
        return this.gameState;
    }

    // Scene management
    changeScene(sceneName) {
        this.gameState.currentScene = sceneName;
        this.emit('sceneChanged', sceneName);
    }

    // Player management
    setPlayer(player) {
        this.gameState.player = player;
        this.emit('playerChanged', player);
    }

    getPlayer() {
        return this.gameState.player;
    }

    // Car management
    addCar(car) {
        this.gameState.cars.set(car.id, car);
        this.emit('carAdded', car);
    }

    removeCar(carId) {
        const car = this.gameState.cars.get(carId);
        if (car) {
            this.gameState.cars.delete(carId);
            this.emit('carRemoved', car);
        }
    }

    getCar(carId) {
        return this.gameState.cars.get(carId);
    }

    getAllCars() {
        return Array.from(this.gameState.cars.values());
    }

    // Auction management
    addAuction(auction) {
        this.gameState.auctions.set(auction.id, auction);
        this.emit('auctionAdded', auction);
    }

    updateAuction(auction) {
        this.gameState.auctions.set(auction.id, auction);
        this.emit('auctionUpdated', auction);
    }

    removeAuction(auctionId) {
        const auction = this.gameState.auctions.get(auctionId);
        if (auction) {
            this.gameState.auctions.delete(auctionId);
            this.emit('auctionRemoved', auction);
        }
    }

    getAuction(auctionId) {
        return this.gameState.auctions.get(auctionId);
    }

    getAllAuctions() {
        return Array.from(this.gameState.auctions.values());
    }

    // Race management
    addRace(race) {
        this.gameState.races.set(race.id, race);
        this.emit('raceAdded', race);
    }

    updateRace(race) {
        this.gameState.races.set(race.id, race);
        this.emit('raceUpdated', race);
    }

    removeRace(raceId) {
        const race = this.gameState.races.get(raceId);
        if (race) {
            this.gameState.races.delete(raceId);
            this.emit('raceRemoved', race);
        }
    }

    getRace(raceId) {
        return this.gameState.races.get(raceId);
    }

    getAllRaces() {
        return Array.from(this.gameState.races.values());
    }

    // Utility methods
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Game loop control
    start() {
        this.gameState.isRunning = true;
        this.emit('gameStarted');
    }

    pause() {
        this.gameState.isRunning = false;
        this.emit('gamePaused');
    }

    stop() {
        this.gameState.isRunning = false;
        this.emit('gameStopped');
    }

    isRunning() {
        return this.gameState.isRunning;
    }
}
