# 3D Car Game - Ultimate Racing Experience

A comprehensive 3D car game built with Three.js featuring realistic car models, multiplayer racing, auction systems, and car showrooms. Play on any device with full cross-platform compatibility.

## 🚗 Features

### Core Gameplay
- **3D Car Models**: Realistic car models with detailed specifications
- **Car Categories**: Sports cars, luxury vehicles, supercars, and normal cars
- **Buying & Selling**: Complete car trading system with realistic pricing
- **Car Customization**: Paint jobs, performance upgrades, and modifications

### New Systems
- **Singleplayer Mode**: Local progression with money, cars, distance, and levels
- **Crafting & Scraps**: Collect parts from junkyards and craft chassis/engines/aero kits
- **Car Builder**: Freeform block-based custom car creation (prototype)
- **Missions & Challenges**: Story-style missions plus daily/weekly rotating goals
- **Achievements**: For specific cars, category completion, and full collection
- **Junkyards**: Explore and pick up scrap/parts in the world
- **Map & Home**: World map panel and a home base with storage
- **Betting**: Challenge others by staking cars (prototype flow)
- **Leaderboards**: Cars owned, money, and distance-driven
- **Water/Air Vehicles**: Specialized cars and part missions for amphibious/air travel

### Environmental & UX
- **Dynamic Weather + Day/Night**: Affects visibility and atmosphere; rain/fog cycles
- **Damage/Repair**: Performance penalties with repair costs and overlays
- **NPC Traffic & Time Trials**: Ambient cars and solo time-based challenges
- **Photo Mode + Replays**: Toggle photo mode and save the last clip buffer
- **Garage Upgrades & Decor**: Storage and visual trophies (scaffolded)
- **Economy & Difficulty**: Tunable rewards/costs and AI difficulty hooks
- **Controller & Keybinds**: Basic keybinds (P=Photo, R=Replay, T=Drift)
- **Mini‑map with POIs**: In-game radar with markers
- **Car Tuning**: Gear ratios, tire grip, downforce (gated by parts)
- **Limited‑time Events**: Temporary boosted drop-rate events
- **Accessibility**: Colorblind settings, UI scale, motion/bloom reduction
- **Telemetry HUD & Drift Mode**: Live stats overlay and drift scoring

### Racing System
- **Multiple Tracks**: City Circuit, Mountain Pass, Desert Highway, Coastal Road
- **Physics-Based Racing**: Realistic car physics and handling
- **Multiplayer Racing**: Race against other players in real-time
- **Lap Times & Records**: Track your performance and compete for best times

### Auction House
- **Real-Time Bidding**: Live auction system with instant updates
- **Car Trading**: Buy and sell cars through auctions
- **Auction Management**: Create, manage, and track your auctions
- **Bid History**: Complete transaction history and statistics

### Car Showroom
- **3D Showroom**: Interactive 3D environment to view cars
- **Car Display**: Showcase your collection in a virtual showroom
- **Customization Studio**: Customize your cars with various options
- **Performance Testing**: Test drive cars before purchasing

### Multiplayer Features
- **Real-Time Multiplayer**: WebSocket-based multiplayer system
- **Player Interactions**: Chat, trade, and race with other players
- **Global Leaderboards**: Compete for top positions
- **Social Features**: Friend systems and player profiles

### Save System
- **Local Storage**: Save your progress locally
- **Cloud Sync**: Optional cloud save functionality
- **Auto-Save**: Automatic saving every 30 seconds
- **Backup System**: Create and restore save backups

### Cross-Platform
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Touch Controls**: Mobile-optimized controls
- **Adaptive UI**: UI adjusts to different screen sizes
- **Performance Optimization**: Optimized for various devices

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 3d-car-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the game server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🎮 How to Play

### Getting Started
1. Enter your player name when prompted
2. You start with $100,000 to buy your first car
3. Explore the showroom to see available cars
4. Buy cars, customize them, and start racing!

### Car Categories
- **Sports Cars**: High-performance vehicles (Ferrari, Lamborghini, McLaren)
- **Luxury Cars**: Premium comfort vehicles (Rolls-Royce, Bentley)
- **Supercars**: Ultra-high-performance hypercars (Bugatti, Koenigsegg)
- **Normal Cars**: Everyday vehicles (BMW, Audi, Honda, Toyota)

### Racing
1. Go to the Races panel
2. Join an existing race or create your own
3. Choose your car and track
4. Race against other players for the best time!

### Auctions
1. Visit the Auction House
2. Browse active auctions or create your own
3. Place bids on cars you want
4. Win auctions to add cars to your collection

### Car Showroom
1. Access your showroom to display your cars
2. Customize your vehicles with different colors and upgrades
3. Show off your collection to other players

## 🏗️ Technical Architecture

### Frontend
- **Three.js**: 3D graphics and rendering
- **WebGL**: Hardware-accelerated graphics
- **Webpack**: Module bundling and asset management
- **ES6 Modules**: Modern JavaScript architecture

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Socket.io**: Real-time multiplayer communication
- **WebSocket**: Low-latency communication

### Core Systems
- **GameEngine**: Central game state management
- **CarManager**: Car models and specifications
- **UIManager**: User interface and interactions
- **NetworkManager**: Multiplayer communication
- **SaveManager**: Progress persistence
- **PhysicsEngine**: Car physics and collision detection
- **RaceManager**: Racing mechanics and tracks
- **AuctionManager**: Auction system and bidding
 - **WeatherManager**: Day/night and weather transitions (rain/fog)
 - **JunkyardManager**: Scrap spawning and pickups
 - **LeaderboardsManager**: Global rankings
 - **BettingManager**: Car wagers (prototype)
 - **Missions/Challenges/Achievements**: Progression and rewards
 - **Replay/Telemetry/Drift/MiniMap/Tuning/Events/Settings**: UX and systems layer

## 🚘 Available Cars

### Sports
- Ferrari 488 GTB
- Lamborghini Huracán
- McLaren 720S
 - Porsche 911 GT3
 - Nissan GT-R
 - Chevrolet Corvette C8

### Luxury
- Rolls‑Royce Ghost
- Bentley Continental GT
 - Mercedes-Maybach S680
 - Aston Martin DB11

### Supercars
- Bugatti Chiron
- Koenigsegg Agera RS
 - Porsche 918 Spyder
 - Ferrari LaFerrari

### Normal
- BMW M3
- Audi RS6 Avant
- Mercedes‑AMG C63 S
- Honda Civic Type R
- Toyota GR Supra
 - Subaru WRX STI
 - Ford Mustang GT
 - Volkswagen Golf R

### Water
- Hydro Sprint

### Air
- Sky Runner

### Electric
- Tesla Model S Plaid
- Rimac Nevera
- Porsche Taycan Turbo S

### Off‑Road
- Jeep Wrangler Rubicon
- Ford F‑150 Raptor
- Land Rover Defender

### Rally
- Lancia Delta Integrale
- Mitsubishi Lancer Evolution VI
- Subaru Impreza 22B

### Classics
- Ford GT40
- Toyota 2000GT
- Chevrolet Bel Air (1957)

<!-- Non-car categories removed per request -->

## 🎨 Customization

### Adding New Cars
1. Add car data to `src/core/CarManager.js` or import a Car Pack
2. Optional: Create 3D model or use placeholder
3. Update car database or provide a JSON pack

### Car Packs (Bulk Import)
- Place JSON under `src/assets/` (see `cars-pack.sample.json`)
- Each key is a category (sports, luxury, supercars, normal, electric, offroad, rally, classics, water, air)
- Minimal schema per car:
  - `id`, `name`, `brand`, `price`, `topSpeed`, `acceleration`, `handling`, `rarity`, `category`
- Load at runtime (open console while game is running):
```
window.game.carManager.loadCarPackFromUrl('src/assets/cars-pack.sample.json')
```

### Creating New Tracks
1. Add track data to `src/core/RaceManager.js`
2. Create track geometry and checkpoints
3. Add scenery and environmental elements

### UI Customization
1. Modify styles in `src/index.html`
2. Update UI components in `src/core/UIManager.js`
3. Add new panels and interactions

## 📱 Mobile Support

The game is fully optimized for mobile devices:
- Touch controls for car movement
- Responsive UI that adapts to screen size
- Optimized performance for mobile GPUs
- Gesture-based navigation

## 🔧 Configuration

### Server Configuration
Edit `server.js` to modify:
- Port number (default: 3000)
- Car database and pricing
- Auction settings
- Race configurations

### Client Configuration
Edit `src/index.js` to modify:
- Graphics settings
- Camera controls
- UI preferences
- Game mechanics

## 🐛 Troubleshooting

### Common Issues

1. **Game won't load**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Verify server is running

2. **Multiplayer not working**
   - Check network connection
   - Verify server is accessible
   - Check firewall settings

3. **Performance issues**
   - Lower graphics settings
   - Close other browser tabs
   - Update graphics drivers

4. **Save data lost**
   - Check browser storage permissions
   - Clear browser cache and try again
   - Use backup save feature

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for excellent 3D graphics library
- Socket.io for real-time multiplayer functionality
- All contributors and testers

## 📞 Support

For support, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Enjoy racing and collecting cars in this ultimate 3D car game experience!** 🏎️💨
