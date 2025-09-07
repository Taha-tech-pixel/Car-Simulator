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

// Demo-only in-memory auth (replace with DB + hashed passwords in production)
const accounts = new Map(); // username -> { username, passwordHash, createdAt, profile }
const tokens = new Map();   // token -> username
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-secret';

app.post('/auth/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }
  if (accounts.has(username)) {
    return res.status(409).json({ success: false, message: 'Username already exists' });
  }
  const account = {
    username,
    // Plain text for demo
    passwordHash: password,
    createdAt: Date.now(),
    profile: { displayName: username, level: 1, experience: 0, money: 100000, cars: [] }
  };
  accounts.set(username, account);
  return res.json({ success: true });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }
  const account = accounts.get(username);
  if (!account || account.passwordHash !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = uuidv4();
  tokens.set(token, username);
  return res.json({ success: true, token, profile: account.profile });
});

app.get('/auth/profile', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  const username = token ? tokens.get(token) : null;
  if (!username) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const account = accounts.get(username);
  return res.json({ success: true, profile: account?.profile || null });
});

// Server list for server hopping (demo)
app.get('/servers', (req, res) => {
  res.json({
    success: true,
    servers: [
      { id: 'local-3000', name: 'Localhost 3000', url: 'http://localhost:3000' },
      { id: 'local-3001', name: 'Localhost 3001', url: 'http://localhost:3001' }
    ]
  });
});

// Simple player report endpoint
app.post('/report', (req, res) => {
  const { reporterId, accusedId, category, message } = req.body || {};
  console.log('Player report:', { reporterId, accusedId, category, message, ts: Date.now() });
  return res.json({ success: true });
});

// Game state
const gameState = {
  players: new Map(),
  cars: new Map(),
  auctions: new Map(),
  races: new Map(),
  showrooms: new Map(),
  tournaments: new Map(),
  banned: new Set(),
  frozen: new Set()
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
  ],
  // Special city exclusive cars
  skyCity: [
    {
      id: 'sky-jet-car',
      name: 'Sky Jet Car',
      brand: 'Aero Dynamics',
      price: 500000,
      topSpeed: 300,
      acceleration: 2.0,
      handling: 85,
      rarity: 'mythic',
      model: 'sky-jet-car.glb',
      specialAbility: 'flight',
      cityExclusive: 'skyCity'
    },
    {
      id: 'cloud-cruiser',
      name: 'Cloud Cruiser',
      brand: 'Sky Motors',
      price: 350000,
      topSpeed: 250,
      acceleration: 2.5,
      handling: 90,
      rarity: 'legendary',
      model: 'cloud-cruiser.glb',
      specialAbility: 'hover',
      cityExclusive: 'skyCity'
    },
    {
      id: 'wind-rider',
      name: 'Wind Rider',
      brand: 'Atmospheric',
      price: 400000,
      topSpeed: 280,
      acceleration: 2.2,
      handling: 88,
      rarity: 'legendary',
      model: 'wind-rider.glb',
      specialAbility: 'wind_boost',
      cityExclusive: 'skyCity'
    }
  ],
  volcanoCity: [
    {
      id: 'lava-crawler',
      name: 'Lava Crawler',
      brand: 'Volcanic Motors',
      price: 600000,
      topSpeed: 180,
      acceleration: 3.5,
      handling: 95,
      rarity: 'mythic',
      model: 'lava-crawler.glb',
      specialAbility: 'lava_immunity',
      cityExclusive: 'volcanoCity'
    },
    {
      id: 'fire-breaker',
      name: 'Fire Breaker',
      brand: 'Inferno Inc',
      price: 450000,
      topSpeed: 200,
      acceleration: 3.0,
      handling: 92,
      rarity: 'legendary',
      model: 'fire-breaker.glb',
      specialAbility: 'fire_resistance',
      cityExclusive: 'volcanoCity'
    },
    {
      id: 'magma-racer',
      name: 'Magma Racer',
      brand: 'Molten Motors',
      price: 550000,
      topSpeed: 220,
      acceleration: 2.8,
      handling: 90,
      rarity: 'mythic',
      model: 'magma-racer.glb',
      specialAbility: 'heat_vision',
      cityExclusive: 'volcanoCity'
    }
  ],
  undergroundCity: [
    {
      id: 'crystal-driller',
      name: 'Crystal Driller',
      brand: 'Deep Earth Motors',
      price: 400000,
      topSpeed: 160,
      acceleration: 4.0,
      handling: 98,
      rarity: 'legendary',
      model: 'crystal-driller.glb',
      specialAbility: 'tunnel_vision',
      cityExclusive: 'undergroundCity'
    },
    {
      id: 'mining-master',
      name: 'Mining Master',
      brand: 'Subterranean',
      price: 350000,
      topSpeed: 170,
      acceleration: 3.8,
      handling: 95,
      rarity: 'legendary',
      model: 'mining-master.glb',
      specialAbility: 'sonar',
      cityExclusive: 'undergroundCity'
    },
    {
      id: 'cave-explorer',
      name: 'Cave Explorer',
      brand: 'Underground Racing',
      price: 380000,
      topSpeed: 175,
      acceleration: 3.6,
      handling: 96,
      rarity: 'legendary',
      model: 'cave-explorer.glb',
      specialAbility: 'night_vision',
      cityExclusive: 'undergroundCity'
    }
  ],
  waterCity: [
    {
      id: 'aqua-jet',
      name: 'Aqua Jet',
      brand: 'Marine Motors',
      price: 450000,
      topSpeed: 200,
      acceleration: 3.2,
      handling: 88,
      rarity: 'legendary',
      model: 'aqua-jet.glb',
      specialAbility: 'water_boost',
      cityExclusive: 'waterCity'
    },
    {
      id: 'wave-rider',
      name: 'Wave Rider',
      brand: 'Ocean Dynamics',
      price: 400000,
      topSpeed: 190,
      acceleration: 3.4,
      handling: 90,
      rarity: 'legendary',
      model: 'wave-rider.glb',
      specialAbility: 'wave_surfing',
      cityExclusive: 'waterCity'
    },
    {
      id: 'deep-diver',
      name: 'Deep Diver',
      brand: 'Submarine Racing',
      price: 500000,
      topSpeed: 180,
      acceleration: 3.6,
      handling: 85,
      rarity: 'mythic',
      model: 'deep-diver.glb',
      specialAbility: 'underwater_mode',
      cityExclusive: 'waterCity'
    }
  ]
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Player joins game
  socket.on('join-game', (playerData) => {
    if (gameState.banned.has(socket.id)) {
      socket.emit('banned');
      socket.disconnect(true);
      return;
    }
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
    player.cars.push({ ...car, id: uuidv4(), purchaseDate: Date.now(), fuel: 100, charge: 100, customization: {} });
    
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
    if (gameState.frozen.has(socket.id)) {
      return;
    }
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
  
  // Petrol pump and electric charger
  socket.on('refuel', (amount) => {
    const player = gameState.players.get(socket.id);
    if (!player || !player.cars?.length) return;
    const car = player.cars[0];
    const cost = Math.ceil((amount || 10) * 2); // $2 per unit
    if (player.money < cost) return;
    player.money -= cost;
    car.fuel = Math.min(100, (car.fuel || 0) + (amount || 10));
    gameState.players.set(socket.id, player);
    socket.emit('update-player', player);
  });

  socket.on('recharge', (amount) => {
    const player = gameState.players.get(socket.id);
    if (!player || !player.cars?.length) return;
    const car = player.cars[0];
    const cost = Math.ceil((amount || 10) * 3); // $3 per unit
    if (player.money < cost) return;
    player.money -= cost;
    car.charge = Math.min(100, (car.charge || 0) + (amount || 10));
    gameState.players.set(socket.id, player);
    socket.emit('update-player', player);
  });

  // Tournaments core
  socket.on('tournament:create', (config) => {
    const id = uuidv4();
    const tournament = {
      id,
      name: config?.name || `Tournament ${id.slice(0, 5)}`,
      creatorId: socket.id,
      status: 'waiting',
      maxPlayers: config?.maxPlayers || 8,
      participants: [],
      bracket: [],
      rewards: config?.rewards || { money: 5000 },
      arena: config?.arena || 'default-arena'
    };
    gameState.tournaments.set(id, tournament);
    io.emit('tournament:created', tournament);
  });

  socket.on('tournament:join', (tournamentId) => {
    const t = gameState.tournaments.get(tournamentId);
    const player = gameState.players.get(socket.id);
    if (!t || !player) return;
    if (t.status !== 'waiting' || t.participants.length >= t.maxPlayers) return;
    if (!t.participants.find(p => p.playerId === socket.id)) {
      t.participants.push({ playerId: socket.id, name: player.name });
    }
    gameState.tournaments.set(t.id, t);
    io.emit('tournament:updated', t);
  });

  socket.on('tournament:start', (tournamentId) => {
    const t = gameState.tournaments.get(tournamentId);
    if (!t || t.creatorId !== socket.id) return;
    t.status = 'in_progress';
    // Seed simple bracket
    const ids = t.participants.map(p => p.playerId).sort(() => Math.random() - 0.5);
    t.bracket = [];
    for (let i = 0; i < ids.length; i += 2) {
      const a = ids[i];
      const b = ids[i + 1] || null;
      t.bracket.push({ a, b, winner: b ? null : a });
    }
    gameState.tournaments.set(t.id, t);
    io.emit('tournament:started', t);
  });

  socket.on('tournament:reportResult', ({ tournamentId, winnerId }) => {
    const t = gameState.tournaments.get(tournamentId);
    if (!t || t.status !== 'in_progress') return;
    const match = t.bracket.find(m => m.winner === null && (m.a === winnerId || m.b === winnerId));
    if (match) match.winner = winnerId;
    if (t.bracket.every(m => m.winner !== null)) {
      const counts = {};
      t.bracket.forEach(m => { counts[m.winner] = (counts[m.winner] || 0) + 1; });
      const champion = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      t.status = 'finished';
      t.champion = champion;
      const winnerPlayer = gameState.players.get(champion);
      if (winnerPlayer) {
        winnerPlayer.money += t.rewards.money || 0;
        gameState.players.set(champion, winnerPlayer);
        io.to(champion).emit('update-player', winnerPlayer);
      }
      io.emit('tournament:finished', t);
    } else {
      io.emit('tournament:updated', t);
    }
  });

  // Report via socket
  socket.on('report:player', ({ accusedId, category, message }) => {
    console.log('Socket report:', { reporterId: socket.id, accusedId, category, message, ts: Date.now() });
    socket.emit('report:ack', { success: true });
  });

  // Admin commands (secured)
  socket.on('admin:exec', (payload) => {
    try {
      const { secret, cmd, args } = payload || {};
      if (secret !== ADMIN_SECRET) {
        return socket.emit('admin:log', { level: 'error', message: 'Invalid admin secret' });
      }
      const log = (message, level = 'info') => socket.emit('admin:log', { level, message });
      switch (cmd) {
        case 'giveMoney': {
          const { targetId, amount } = args || {};
          const p = gameState.players.get(targetId);
          if (!p) return log('Target not found', 'error');
          p.money = (p.money || 0) + (Number(amount) || 0);
          gameState.players.set(targetId, p);
          io.to(targetId).emit('update-player', p);
          return log(`Gave $${amount} to ${targetId}`);
        }
        case 'spawnCar': {
          const { targetId, carId } = args || {};
          const p = gameState.players.get(targetId);
          if (!p) return log('Target not found', 'error');
          const car = Object.values(carDatabase).flat().find(c => c.id === carId);
          if (!car) return log('Car not found', 'error');
          p.cars.push({ ...car, id: uuidv4(), purchaseDate: Date.now(), fuel: 100, charge: 100, customization: {} });
          gameState.players.set(targetId, p);
          io.to(targetId).emit('update-player', p);
          return log(`Spawned ${carId} for ${targetId}`);
        }
        case 'ban': {
          const { targetId } = args || {};
          if (!targetId) return log('Missing targetId', 'error');
          gameState.banned.add(targetId);
          io.to(targetId).emit('banned');
          io.sockets.sockets.get(targetId)?.disconnect(true);
          return log(`Banned ${targetId}`);
        }
        case 'freeze': {
          const { targetId } = args || {};
          if (!targetId) return log('Missing targetId', 'error');
          gameState.frozen.add(targetId);
          return log(`Froze ${targetId}`);
        }
        case 'unfreeze': {
          const { targetId } = args || {};
          if (!targetId) return log('Missing targetId', 'error');
          gameState.frozen.delete(targetId);
          return log(`Unfroze ${targetId}`);
        }
        default:
          return log('Unknown command', 'error');
      }
    } catch (e) {
      socket.emit('admin:log', { level: 'error', message: `Error: ${e.message}` });
    }
  });

  // Apply basic customization (color/upgrades) to player's first car (demo)
  socket.on('customize-car', (customization) => {
    const player = gameState.players.get(socket.id);
    if (!player || !player.cars || player.cars.length === 0) {
      return;
    }
    const targetCar = player.cars[0];
    targetCar.customization = { ...(targetCar.customization || {}), ...customization };
    gameState.players.set(socket.id, player);
    socket.emit('update-player', player);
  });

  // Level progression system
  socket.on('level-up', (data) => {
    const player = gameState.players.get(socket.id);
    if (!player) return;
    
    const { type, amount = 1 } = data;
    if (!player.levels) player.levels = { auction: 1, betting: 1, racing: 1, trading: 1 };
    
    player.levels[type] = (player.levels[type] || 1) + amount;
    
    // Check for achievements and titles
    const level = player.levels[type];
    const achievements = getLevelAchievements(type, level);
    
    achievements.forEach(achievement => {
      if (!player.achievements) player.achievements = [];
      if (!player.achievements.includes(achievement.id)) {
        player.achievements.push(achievement.id);
        if (!player.titles) player.titles = [];
        if (!player.titles.includes(achievement.title)) {
          player.titles.push(achievement.title);
        }
        socket.emit('achievement-unlocked', achievement);
      }
    });
    
    gameState.players.set(socket.id, player);
    socket.emit('level-updated', { type, level: player.levels[type], player });
  });

  // Trading system
  socket.on('trade-request', (data) => {
    const { targetPlayerId, offer, request } = data;
    const player = gameState.players.get(socket.id);
    const targetPlayer = gameState.players.get(targetPlayerId);
    
    if (!player || !targetPlayer) {
      socket.emit('trade-error', { message: 'Player not found' });
      return;
    }
    
    // Check if players can trade
    const now = Date.now();
    if (player.lastTrade && (now - player.lastTrade) < 300000) { // 5 minute cooldown
      socket.emit('trade-error', { message: 'You must wait 5 minutes between trades' });
      return;
    }
    
    if (targetPlayer.lastTrade && (now - targetPlayer.lastTrade) < 300000) {
      socket.emit('trade-error', { message: 'Target player must wait 5 minutes between trades' });
      return;
    }
    
    // Validate offer and request
    if (!validateTradeItems(player, offer) || !validateTradeItems(targetPlayer, request)) {
      socket.emit('trade-error', { message: 'Invalid trade items' });
      return;
    }
    
    // Send trade request to target player
    io.to(targetPlayerId).emit('trade-offer', {
      fromPlayerId: socket.id,
      fromPlayerName: player.name,
      offer,
      request
    });
    
    socket.emit('trade-sent', { message: 'Trade request sent' });
  });

  socket.on('trade-accept', (data) => {
    const { fromPlayerId, offer, request } = data;
    const player = gameState.players.get(socket.id);
    const fromPlayer = gameState.players.get(fromPlayerId);
    
    if (!player || !fromPlayer) {
      socket.emit('trade-error', { message: 'Player not found' });
      return;
    }
    
    // Execute the trade
    if (executeTrade(fromPlayer, player, offer, request)) {
      fromPlayer.lastTrade = Date.now();
      player.lastTrade = Date.now();
      
      gameState.players.set(fromPlayerId, fromPlayer);
      gameState.players.set(socket.id, player);
      
      io.to(fromPlayerId).emit('trade-completed', { 
        message: 'Trade completed successfully',
        player: fromPlayer
      });
      socket.emit('trade-completed', { 
        message: 'Trade completed successfully',
        player: player
      });
    } else {
      socket.emit('trade-error', { message: 'Trade execution failed' });
      io.to(fromPlayerId).emit('trade-error', { message: 'Trade execution failed' });
    }
  });

  socket.on('trade-decline', (data) => {
    const { fromPlayerId } = data;
    io.to(fromPlayerId).emit('trade-declined', { 
      message: 'Trade request declined',
      fromPlayerId: socket.id
    });
  });

  // Special city events
  socket.on('city-event-trigger', () => {
    const player = gameState.players.get(socket.id);
    if (!player) return;
    
    // Random chance to trigger city event (1% chance)
    if (Math.random() < 0.01) {
      const cities = ['skyCity', 'volcanoCity', 'undergroundCity', 'waterCity'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      if (!player.unlockedCities) player.unlockedCities = [];
      if (!player.unlockedCities.includes(randomCity)) {
        player.unlockedCities.push(randomCity);
        gameState.players.set(socket.id, player);
        
        socket.emit('city-unlocked', {
          city: randomCity,
          message: `A mysterious portal has opened to ${randomCity}!`
        });
      }
    }
  });

  // Teleport to special city
  socket.on('teleport-to-city', (data) => {
    const { cityName } = data;
    const player = gameState.players.get(socket.id);
    if (!player) return;
    
    if (!player.unlockedCities || !player.unlockedCities.includes(cityName)) {
      socket.emit('teleport-error', { message: 'City not unlocked' });
      return;
    }
    
    const cityPositions = {
      skyCity: { x: 0, y: 2000, z: 0 },
      volcanoCity: { x: 5000, y: 0, z: 0 },
      undergroundCity: { x: 0, y: -1000, z: 0 },
      waterCity: { x: -5000, y: 0, z: 0 }
    };
    
    const position = cityPositions[cityName];
    if (position) {
      player.position = position;
      gameState.players.set(socket.id, player);
      socket.emit('teleported', { city: cityName, position });
      socket.broadcast.emit('player-teleported', { 
        playerId: socket.id, 
        city: cityName, 
        position 
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

// Helper functions for trading system
function validateTradeItems(player, items) {
  if (!items || !Array.isArray(items)) return false;
  
  return items.every(item => {
    if (item.type === 'car') {
      return player.cars.some(car => car.id === item.id);
    } else if (item.type === 'money') {
      return player.money >= item.amount;
    }
    return false;
  });
}

function executeTrade(player1, player2, offer, request) {
  try {
    // Remove items from player1 (offer)
    offer.forEach(item => {
      if (item.type === 'car') {
        const carIndex = player1.cars.findIndex(car => car.id === item.id);
        if (carIndex !== -1) {
          player1.cars.splice(carIndex, 1);
        }
      } else if (item.type === 'money') {
        player1.money -= item.amount;
      }
    });
    
    // Remove items from player2 (request)
    request.forEach(item => {
      if (item.type === 'car') {
        const carIndex = player2.cars.findIndex(car => car.id === item.id);
        if (carIndex !== -1) {
          player2.cars.splice(carIndex, 1);
        }
      } else if (item.type === 'money') {
        player2.money -= item.amount;
      }
    });
    
    // Give items to player1 (request)
    request.forEach(item => {
      if (item.type === 'car') {
        const car = Object.values(carDatabase).flat().find(c => c.id === item.id);
        if (car) {
          player1.cars.push({ ...car, id: uuidv4(), purchaseDate: Date.now(), fuel: 100, charge: 100, customization: {} });
        }
      } else if (item.type === 'money') {
        player1.money += item.amount;
      }
    });
    
    // Give items to player2 (offer)
    offer.forEach(item => {
      if (item.type === 'car') {
        const car = Object.values(carDatabase).flat().find(c => c.id === item.id);
        if (car) {
          player2.cars.push({ ...car, id: uuidv4(), purchaseDate: Date.now(), fuel: 100, charge: 100, customization: {} });
        }
      } else if (item.type === 'money') {
        player2.money += item.amount;
      }
    });
    
    return true;
  } catch (error) {
    console.error('Trade execution error:', error);
    return false;
  }
}

function getLevelAchievements(type, level) {
  const achievements = [];
  
  if (level >= 5) {
    achievements.push({
      id: `${type}_novice`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Novice`,
      description: `Reached level 5 in ${type}`,
      icon: 'novice_badge'
    });
  }
  
  if (level >= 10) {
    achievements.push({
      id: `${type}_expert`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Expert`,
      description: `Reached level 10 in ${type}`,
      icon: 'expert_badge'
    });
  }
  
  if (level >= 25) {
    achievements.push({
      id: `${type}_master`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Master`,
      description: `Reached level 25 in ${type}`,
      icon: 'master_badge'
    });
  }
  
  if (level >= 50) {
    achievements.push({
      id: `${type}_legend`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Legend`,
      description: `Reached level 50 in ${type}`,
      icon: 'legend_badge'
    });
  }
  
  return achievements;
}

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
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://[YOUR_IP]:${PORT}`);
});
