// Socket.io will be loaded via CDN in the HTML

export class NetworkManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.playerId = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for game events
        window.addEventListener('buyCar', (event) => {
            this.buyCar(event.detail.carId);
        });

        window.addEventListener('sellCar', (event) => {
            this.sellCar(event.detail.carId);
        });

        window.addEventListener('placeBid', (event) => {
            this.placeBid(event.detail.auctionId, event.detail.amount);
        });

        window.addEventListener('createAuction', (event) => {
            this.createAuction(event.detail);
        });

        window.addEventListener('joinRace', (event) => {
            this.joinRace(event.detail.raceId);
        });

        window.addEventListener('createRace', (event) => {
            this.createRace(event.detail);
        });

        window.addEventListener('customizeCar', (event) => {
            this.customizeCar(event.detail);
        });
    }

    connect(playerName) {
        try {
            // Use global io from CDN
            this.socket = window.io('http://localhost:3000', {
                transports: ['websocket'],
                timeout: 10000
            });

            this.setupSocketListeners();
            this.socket.emit('join-game', { name: playerName });
            
        } catch (error) {
            console.error('Failed to connect to server:', error);
            this.handleConnectionError();
        }
    }

    setupSocketListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.emit('connected');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
            this.isConnected = false;
            this.emit('disconnected', reason);
            
            if (reason === 'io server disconnect') {
                // Server initiated disconnect, try to reconnect
                this.attemptReconnect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.handleConnectionError();
        });

        // Game state events
        this.socket.on('game-state', (gameState) => {
            console.log('Received game state:', gameState);
            this.playerId = this.socket.id;
            this.emit('gameStateReceived', gameState);
        });

        this.socket.on('update-player', (playerData) => {
            console.log('Player updated:', playerData);
            this.emit('playerUpdated', playerData);
        });

        // Car events
        this.socket.on('buy-car-result', (result) => {
            if (result.success) {
                this.emit('carBought', result);
                window.uiManager.showNotification('Car purchased successfully!', 'success');
            } else {
                window.uiManager.showNotification(result.message, 'error');
            }
        });

        this.socket.on('sell-car-result', (result) => {
            if (result.success) {
                this.emit('carSold', result);
                window.uiManager.showNotification(`Car sold for $${result.sellPrice.toLocaleString()}`, 'success');
            } else {
                window.uiManager.showNotification(result.message, 'error');
            }
        });

        // Auction events
        this.socket.on('new-auction', (auction) => {
            console.log('New auction:', auction);
            this.emit('auctionCreated', auction);
            window.uiManager.showNotification(`New auction: ${auction.car.name}`, 'info');
        });

        this.socket.on('auction-updated', (auction) => {
            console.log('Auction updated:', auction);
            this.emit('auctionUpdated', auction);
        });

        this.socket.on('auction-ended', (auction) => {
            console.log('Auction ended:', auction);
            this.emit('auctionEnded', auction);
        });

        this.socket.on('auction-result', (result) => {
            if (result.success) {
                this.emit('auctionCreated', result.auction);
                window.uiManager.showNotification('Auction created successfully!', 'success');
            } else {
                window.uiManager.showNotification(result.message, 'error');
            }
        });

        this.socket.on('bid-result', (result) => {
            if (result.success) {
                window.uiManager.showNotification('Bid placed successfully!', 'success');
            } else {
                window.uiManager.showNotification(result.message, 'error');
            }
        });

        // Race events
        this.socket.on('new-race', (race) => {
            console.log('New race:', race);
            this.emit('raceCreated', race);
            window.uiManager.showNotification(`New race: ${race.track}`, 'info');
        });

        this.socket.on('race-updated', (race) => {
            console.log('Race updated:', race);
            this.emit('raceUpdated', race);
        });

        this.socket.on('race-created', (race) => {
            console.log('Race created:', race);
            this.emit('raceCreated', race);
            window.uiManager.showNotification('Race created successfully!', 'success');
        });

        this.socket.on('race-result', (result) => {
            if (result.success) {
                this.emit('raceJoined', result.race);
                window.uiManager.showNotification('Joined race successfully!', 'success');
            } else {
                window.uiManager.showNotification(result.message, 'error');
            }
        });

        // Tournaments
        this.socket.on('tournament:created', (t) => {
            this.emit('tournamentCreated', t);
            window.uiManager.showNotification(`Tournament created: ${t.name}`, 'info');
        });
        this.socket.on('tournament:updated', (t) => this.emit('tournamentUpdated', t));
        this.socket.on('tournament:started', (t) => {
            this.emit('tournamentStarted', t);
            window.uiManager.showNotification('Tournament started', 'info');
        });
        this.socket.on('tournament:finished', (t) => {
            this.emit('tournamentFinished', t);
            window.uiManager.showNotification('Tournament finished!', 'success');
        });

        // Reports
        this.socket.on('report:ack', (res) => {
            if (res?.success) window.uiManager.showNotification('Report sent. Thank you.', 'info');
        });

        // Admin dev console logs
        this.socket.on('admin:log', (entry) => {
            this.emit('adminLog', entry);
        });

        // Player events
        this.socket.on('player-joined', (player) => {
            console.log('Player joined:', player);
            this.emit('playerJoined', player);
        });

        this.socket.on('player-left', (playerId) => {
            console.log('Player left:', playerId);
            this.emit('playerLeft', playerId);
        });

        this.socket.on('player-moved', (data) => {
            this.emit('playerMoved', data);
        });
    }

    // Car actions
    buyCar(carId) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('buy-car', carId);
    }

    sellCar(carId) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('sell-car', carId);
    }

    // Auction actions
    createAuction(auctionData) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('create-auction', auctionData);
    }

    placeBid(auctionId, amount) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('place-bid', {
            auctionId: auctionId,
            amount: amount
        });
    }

    // Race actions
    createRace(raceData) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('create-race', raceData);
    }

    joinRace(raceId) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('join-race', raceId);
    }

    // Player position updates (for racing)
    updatePosition(position, rotation) {
        if (!this.isConnected) return;
        
        this.socket.emit('update-position', {
            position: position,
            rotation: rotation
        });
    }

    // Car customization
    customizeCar(customizationData) {
        if (!this.isConnected) {
            window.uiManager.showNotification('Not connected to server', 'error');
            return;
        }
        
        this.socket.emit('customize-car', customizationData);
    }

    // Tournaments
    createTournament(config) {
        if (!this.isConnected) return;
        this.socket.emit('tournament:create', config);
    }
    joinTournament(tournamentId) {
        if (!this.isConnected) return;
        this.socket.emit('tournament:join', tournamentId);
    }
    startTournament(tournamentId) {
        if (!this.isConnected) return;
        this.socket.emit('tournament:start', tournamentId);
    }
    reportTournamentResult(tournamentId, winnerId) {
        if (!this.isConnected) return;
        this.socket.emit('tournament:reportResult', { tournamentId, winnerId });
    }

    // Reports
    reportPlayer(accusedId, category, message) {
        if (!this.isConnected) return;
        this.socket.emit('report:player', { accusedId, category, message });
    }

    // Connection management
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            this.emit('reconnectionFailed');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            if (!this.isConnected) {
                this.socket.connect();
            }
        }, delay);
    }

    handleConnectionError() {
        this.emit('connectionError');
        window.uiManager.showNotification('Connection lost. Attempting to reconnect...', 'error');
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
    }

    // Event system
    emit(event, data) {
        window.dispatchEvent(new CustomEvent(`network:${event}`, { detail: data }));
    }

    // Utility methods
    isPlayerConnected() {
        return this.isConnected && this.playerId !== null;
    }

    getPlayerId() {
        return this.playerId;
    }

    getConnectionStatus() {
        return {
            connected: this.isConnected,
            playerId: this.playerId,
            reconnectAttempts: this.reconnectAttempts
        };
    }

    // Update method for game loop
    update(deltaTime) {
        // Handle any network-related updates
        if (this.isConnected && this.socket) {
            // Ping server periodically to maintain connection
            if (this.lastPingTime === undefined || Date.now() - this.lastPingTime > 30000) {
                this.socket.emit('ping');
                this.lastPingTime = Date.now();
            }
        }
    }
}
