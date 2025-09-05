const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Game state
const gameState = {
  players: new Map(),
  cars: new Map(),
  auctions: new Map(),
  races: new Map(),
  showrooms: new Map()
};

// Car database with realistic specifications
const carDatabase = {
  sports: [
    {
      id: 'ferrari-488',
      name: 'Ferrari 488 GTB',
      brand: 'Ferrari',
      price: 250000,
      topSpeed: 205,
      acceleration: 3.0,
      handling: 95,
      rarity: 'legendary',
      model: 'ferrari-488.glb'
    },
    {
      id: 'lamborghini-huracan',
      name: 'Lamborghini Huracán',
      brand: 'Lamborghini',
      price: 200000,
      topSpeed: 201,
      acceleration: 3.2,
      handling: 92,
      rarity: 'legendary',
      model: 'lamborghini-huracan.glb'
    },
    {
      id: 'mclaren-720s',
      name: 'McLaren 720S',
      brand: 'McLaren',
      price: 280000,
      topSpeed: 212,
      acceleration: 2.8,
      handling: 98,
      rarity: 'legendary',
      model: 'mclaren-720s.glb'
    }
  ],
  luxury: [
    {
      id: 'rolls-royce-ghost',
      name: 'Rolls-Royce Ghost',
      brand: 'Rolls-Royce',
      price: 300000,
      topSpeed: 155,
      acceleration: 4.8,
      handling: 75,
      rarity: 'legendary',
      model: 'rolls-royce-ghost.glb'
    },
    {
      id: 'bentley-continental',
      name: 'Bentley Continental GT',
      brand: 'Bentley',
      price: 200000,
      topSpeed: 207,
      acceleration: 3.6,
      handling: 85,
      rarity: 'epic',
      model: 'bentley-continental.glb'
    }
  ],
  supercars: [
    {
      id: 'bugatti-chiron',
      name: 'Bugatti Chiron',
      brand: 'Bugatti',
      price: 3000000,
      topSpeed: 261,
      acceleration: 2.4,
      handling: 100,
      rarity: 'mythic',
      model: 'bugatti-chiron.glb'
    },
    {
      id: 'koenigsegg-agera',
      name: 'Koenigsegg Agera RS',
      brand: 'Koenigsegg',
      price: 2500000,
      topSpeed: 278,
      acceleration: 2.6,
      handling: 99,
      rarity: 'mythic',
      model: 'koenigsegg-agera.glb'
    }
  ],
  normal: [
    {
      id: 'bmw-m3',
      name: 'BMW M3',
      brand: 'BMW',
      price: 70000,
      topSpeed: 180,
      acceleration: 4.1,
      handling: 88,
      rarity: 'rare',
      model: 'bmw-m3.glb'
    },
    {
      id: 'audi-rs6',
      name: 'Audi RS6 Avant',
      brand: 'Audi',
      price: 110000,
      topSpeed: 190,
      acceleration: 3.6,
      handling: 90,
      rarity: 'epic',
      model: 'audi-rs6.glb'
    },
    {
      id: 'mercedes-c63',
      name: 'Mercedes-AMG C63 S',
      brand: 'Mercedes-Benz',
      price: 80000,
      topSpeed: 180,
      acceleration: 3.9,
      handling: 87,
      rarity: 'rare',
      model: 'mercedes-c63.glb'
    },
    {
      id: 'honda-civic',
      name: 'Honda Civic Type R',
      brand: 'Honda',
      price: 35000,
      topSpeed: 169,
      acceleration: 5.7,
      handling: 85,
      rarity: 'common',
      model: 'honda-civic.glb'
    },
    {
      id: 'toyota-supra',
      name: 'Toyota GR Supra',
      brand: 'Toyota',
      price: 50000,
      topSpeed: 155,
      acceleration: 4.1,
      handling: 89,
      rarity: 'rare',
      model: 'toyota-supra.glb'
    }
  ]
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Player joins game
  socket.on('join-game', (playerData) => {
    const player = {
      id: socket.id,
      name: playerData.name || `Player_${socket.id.substring(0, 6)}`,
      money: 100000, // Starting money
      cars: [],
      level: 1,
      experience: 0,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    };
    
    gameState.players.set(socket.id, player);
    socket.emit('game-state', {
      player,
      availableCars: carDatabase,
      activeAuctions: Array.from(gameState.auctions.values()),
      activeRaces: Array.from(gameState.races.values())
    });
    
    socket.broadcast.emit('player-joined', player);
  });

  // Buy car
  socket.on('buy-car', (carId) => {
    const player = gameState.players.get(socket.id);
    if (!player) return;

    const car = Object.values(carDatabase).flat().find(c => c.id === carId);
    if (!car || player.money < car.price) {
      socket.emit('buy-car-result', { success: false, message: 'Insufficient funds or car not found' });
      return;
    }

    player.money -= car.price;
    player.cars.push({ ...car, id: uuidv4(), purchaseDate: Date.now() });
    
    gameState.players.set(socket.id, player);
    socket.emit('buy-car-result', { success: true, player });
    socket.emit('update-player', player);
  });

  // Sell car
  socket.on('sell-car', (carInstanceId) => {
    const player = gameState.players.get(socket.id);
    if (!player) return;

    const carIndex = player.cars.findIndex(c => c.id === carInstanceId);
    if (carIndex === -1) {
      socket.emit('sell-car-result', { success: false, message: 'Car not found' });
      return;
    }

    const car = player.cars[carIndex];
    const sellPrice = Math.floor(car.price * 0.8); // 80% of original price
    
    player.money += sellPrice;
    player.cars.splice(carIndex, 1);
    
    gameState.players.set(socket.id, player);
    socket.emit('sell-car-result', { success: true, player, sellPrice });
    socket.emit('update-player', player);
  });

  // Create auction
  socket.on('create-auction', (auctionData) => {
    const player = gameState.players.get(socket.id);
    if (!player) return;

    const car = player.cars.find(c => c.id === auctionData.carId);
    if (!car) {
      socket.emit('auction-result', { success: false, message: 'Car not found' });
      return;
    }

    const auction = {
      id: uuidv4(),
      sellerId: socket.id,
      sellerName: player.name,
      car: car,
      startingPrice: auctionData.startingPrice,
      currentBid: auctionData.startingPrice,
      currentBidder: null,
      endTime: Date.now() + (auctionData.duration * 60 * 1000), // duration in minutes
      status: 'active'
    };

    gameState.auctions.set(auction.id, auction);
    io.emit('new-auction', auction);
    socket.emit('auction-result', { success: true, auction });
  });

  // Place bid
  socket.on('place-bid', (bidData) => {
    const player = gameState.players.get(socket.id);
    const auction = gameState.auctions.get(bidData.auctionId);
    
    if (!player || !auction || auction.status !== 'active') {
      socket.emit('bid-result', { success: false, message: 'Invalid auction or player' });
      return;
    }

    if (bidData.amount <= auction.currentBid || player.money < bidData.amount) {
      socket.emit('bid-result', { success: false, message: 'Invalid bid amount' });
      return;
    }

    // Return money to previous bidder
    if (auction.currentBidder) {
      const previousBidder = gameState.players.get(auction.currentBidder);
      if (previousBidder) {
        previousBidder.money += auction.currentBid;
        gameState.players.set(auction.currentBidder, previousBidder);
        io.to(auction.currentBidder).emit('update-player', previousBidder);
      }
    }

    // Update auction
    auction.currentBid = bidData.amount;
    auction.currentBidder = socket.id;
    player.money -= bidData.amount;
    
    gameState.auctions.set(auction.id, auction);
    gameState.players.set(socket.id, player);
    
    io.emit('auction-updated', auction);
    socket.emit('bid-result', { success: true });
    socket.emit('update-player', player);
  });

  // Join race
  socket.on('join-race', (raceId) => {
    const player = gameState.players.get(socket.id);
    const race = gameState.races.get(raceId);
    
    if (!player || !race || race.status !== 'waiting') {
      socket.emit('race-result', { success: false, message: 'Invalid race' });
      return;
    }

    if (race.participants.length >= race.maxParticipants) {
      socket.emit('race-result', { success: false, message: 'Race is full' });
      return;
    }

    race.participants.push({
      playerId: socket.id,
      playerName: player.name,
      car: player.cars[0] || null, // Use first car
      position: race.participants.length,
      lapTime: 0,
      bestLap: 0
    });

    gameState.races.set(raceId, race);
    io.emit('race-updated', race);
    socket.emit('race-result', { success: true, race });
  });

  // Create race
  socket.on('create-race', (raceData) => {
    const race = {
      id: uuidv4(),
      creatorId: socket.id,
      track: raceData.track,
      maxParticipants: raceData.maxParticipants || 8,
      laps: raceData.laps || 3,
      participants: [],
      status: 'waiting',
      startTime: null
    };

    gameState.races.set(race.id, race);
    io.emit('new-race', race);
    socket.emit('race-created', race);
  });

  // Update player position (for racing)
  socket.on('update-position', (positionData) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      player.position = positionData.position;
      player.rotation = positionData.rotation;
      gameState.players.set(socket.id, player);
      socket.broadcast.emit('player-moved', {
        playerId: socket.id,
        position: positionData.position,
        rotation: positionData.rotation
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    gameState.players.delete(socket.id);
    socket.broadcast.emit('player-left', socket.id);
  });
});

// Clean up expired auctions
setInterval(() => {
  const now = Date.now();
  for (const [auctionId, auction] of gameState.auctions) {
    if (auction.endTime <= now && auction.status === 'active') {
      auction.status = 'ended';
      
      if (auction.currentBidder) {
        // Transfer car to winner
        const winner = gameState.players.get(auction.currentBidder);
        const seller = gameState.players.get(auction.sellerId);
        
        if (winner && seller) {
          winner.cars.push(auction.car);
          seller.money += auction.currentBid;
          
          gameState.players.set(auction.currentBidder, winner);
          gameState.players.set(auction.sellerId, seller);
          
          io.to(auction.currentBidder).emit('update-player', winner);
          io.to(auction.sellerId).emit('update-player', seller);
        }
      }
      
      io.emit('auction-ended', auction);
    }
  }
}, 10000); // Check every 10 seconds

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
