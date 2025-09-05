export class UIManager {
    constructor() {
        this.activePanels = new Set();
        this.carShowroomData = null;
        this.auctionData = [];
        this.raceData = [];
        this.playerData = null;
        
        this.initializeUI();
    }

    initializeUI() {
        this.setupEventListeners();
        this.setupResponsiveDesign();
    }

    setupEventListeners() {
        // Panel toggle buttons
        document.getElementById('showroomBtn').addEventListener('click', () => {
            this.togglePanel('carShowroom');
        });

        document.getElementById('auctionBtn').addEventListener('click', () => {
            this.togglePanel('auctionHouse');
        });

        document.getElementById('raceBtn').addEventListener('click', () => {
            this.togglePanel('racePanel');
        });

        document.getElementById('garageBtn').addEventListener('click', () => {
            this.togglePanel('garage');
        });

        // New feature buttons
        const mapBtn = document.getElementById('mapBtn');
        if (mapBtn) mapBtn.addEventListener('click', () => { this.togglePanel('mapPanel'); window.dispatchEvent(new Event('map:requestToggle')); });

        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) homeBtn.addEventListener('click', () => this.togglePanel('homePanel'));

        const junkyardBtn = document.getElementById('junkyardBtn');
        if (junkyardBtn) junkyardBtn.addEventListener('click', () => this.togglePanel('junkyardPanel'));

        const missionsBtn = document.getElementById('missionsBtn');
        if (missionsBtn) missionsBtn.addEventListener('click', () => this.togglePanel('missionsPanel'));

        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) achievementsBtn.addEventListener('click', () => this.togglePanel('achievementsPanel'));

        const craftingBtn = document.getElementById('craftingBtn');
        if (craftingBtn) craftingBtn.addEventListener('click', () => this.togglePanel('craftingPanel'));

        const leaderboardsBtn = document.getElementById('leaderboardsBtn');
        if (leaderboardsBtn) leaderboardsBtn.addEventListener('click', () => this.togglePanel('leaderboardsPanel'));

        const bettingBtn = document.getElementById('bettingBtn');
        if (bettingBtn) bettingBtn.addEventListener('click', () => this.togglePanel('bettingPanel'));

        // Create auction button
        document.getElementById('createAuctionBtn').addEventListener('click', () => {
            this.showCreateAuctionModal();
        });

        // Create race button
        document.getElementById('createRaceBtn').addEventListener('click', () => {
            this.showCreateRaceModal();
        });
    }

    setupResponsiveDesign() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.adjustUIForScreenSize();
        });

        // Initial adjustment
        this.adjustUIForScreenSize();
    }

    adjustUIForScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

        // Adjust panel sizes and positions
        const panels = ['carShowroom', 'auctionHouse', 'garage'];
        
        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                if (isMobile) {
                    panel.style.width = 'calc(100vw - 20px)';
                    panel.style.maxWidth = 'none';
                    panel.style.left = '10px';
                    panel.style.right = '10px';
                } else if (isTablet) {
                    panel.style.width = '300px';
                    panel.style.maxWidth = '300px';
                } else {
                    panel.style.width = panelId === 'auctionHouse' ? '350px' : '300px';
                }
            }
        });

        // Adjust race panel for mobile
        const racePanel = document.getElementById('racePanel');
        if (racePanel && isMobile) {
            racePanel.style.width = 'calc(100vw - 20px)';
            racePanel.style.left = '10px';
            racePanel.style.bottom = '10px';
        }
    }

    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        if (this.activePanels.has(panelId)) {
            panel.classList.add('hidden');
            this.activePanels.delete(panelId);
        } else {
            // Hide other panels first
            this.activePanels.forEach(activePanelId => {
                if (activePanelId !== panelId) {
                    document.getElementById(activePanelId).classList.add('hidden');
                }
            });
            this.activePanels.clear();

            // Show the selected panel
            panel.classList.remove('hidden');
            this.activePanels.add(panelId);

            // Load panel data
            this.loadPanelData(panelId);
        }
    }

    loadPanelData(panelId) {
        switch (panelId) {
            case 'carShowroom':
                this.loadCarShowroom();
                break;
            case 'auctionHouse':
                this.loadAuctionHouse();
                break;
            case 'racePanel':
                this.loadRacePanel();
                break;
            case 'garage':
                this.loadGarage();
                break;
            case 'missionsPanel':
                this.loadMissions();
                break;
            case 'achievementsPanel':
                this.loadAchievements();
                break;
            case 'craftingPanel':
                this.loadCrafting();
                break;
            case 'bettingPanel':
                this.loadBetting();
                break;
            case 'leaderboardsPanel':
                this.loadLeaderboards();
                break;
            case 'junkyardPanel':
                this.loadJunkyard();
                break;
            case 'homePanel':
                this.loadHome();
                break;
            case 'mapPanel':
                this.loadMap();
                break;
        }
    }

    loadCarShowroom() {
        const content = document.getElementById('showroomContent');
        if (!content) return;

        // Pull dynamic data from CarManager
        const manager = window.game?.carManager;
        const db = manager ? manager.getAllCarData() : {};
        const categoryOrder = [
            ['sports', 'Sports Cars'],
            ['luxury', 'Luxury Cars'],
            ['supercars', 'Supercars'],
            ['normal', 'Normal Cars'],
            ['electric', 'Electric Cars'],
            ['offroad', 'Off‑Road'],
            ['rally', 'Rally'],
            ['classics', 'Classics'],
            ['water', 'Water Vehicles'],
            ['air', 'Air Vehicles']
        ];

        let html = '';
        categoryOrder.forEach(([key, label]) => {
            const cars = (db[key] || []);
            if (cars.length === 0) return;
            html += `<h3 style="color: #00ff88; margin: 20px 0 10px 0; border-bottom: 1px solid #00ff88; padding-bottom: 5px;">${label}</h3>`;
            cars.forEach(car => {
                const rarityColor = this.getRarityColor(car.rarity);
                html += `
                    <div class="car-item" data-car-id="${car.id}">
                        <div class="car-name">${car.name}</div>
                        <div class="car-specs">
                            <div>Rarity: <span style="color: ${rarityColor}">${(car.rarity||'common').toUpperCase()}</span></div>
                            <div>Price: <span class="car-price">$${(car.price||0).toLocaleString()}</span></div>
                        </div>
                        <button class="menu-button" style="width: 100%; margin-top: 10px; padding: 8px;" onclick="uiManager.buyCar('${car.id}')">
                            Buy Car
                        </button>
                    </div>
                `;
            });
        });

        content.innerHTML = html || '<div style="text-align:center;color:#aaa;padding:20px;">No cars available</div>';
    }

    loadMissions() {
        const content = document.getElementById('missionsContent');
        if (!content) return;
        // Placeholder missions list
        content.innerHTML = `
            <div style="margin-bottom: 10px;">Collect 10 Metal Scrap - Reward: $500</div>
            <div style="margin-bottom: 10px;">Win 3 Races - Reward: $3000</div>
            <div style="margin-bottom: 10px;">Build Basic Chassis - Reward: $2000</div>
            <div style="margin-bottom: 10px;">Find Water Jet - Reward: $5000</div>
            <div>Find Propeller - Reward: $7000</div>
        `;
    }

    loadAchievements() {
        const content = document.getElementById('achievementsContent');
        if (!content) return;
        content.innerHTML = `
            <div>Hyper Icon (Collect Bugatti Chiron)</div>
            <div>Sports Set Complete (Collect all Sports)</div>
            <div>Garage Tycoon (Collect all cars)</div>
        `;
    }

    loadCrafting() {
        const content = document.getElementById('craftingContent');
        if (!content) return;
        content.innerHTML = `
            <div>Scrap Inventory appears here.</div>
            <button class="menu-button" style="margin-top:10px;" onclick="window.dispatchEvent(new CustomEvent('craft:attempt',{detail:{itemId:'basic-chassis'}}))">Craft Basic Chassis</button>
            <div style="margin-top:15px;">Car Builder (prototype)</div>
            <button class="menu-button" style="margin-top:10px;" onclick="window.dispatchEvent(new CustomEvent('builder:addBlock'))">Add Block</button>
            <button class="menu-button" style="margin-top:10px;" onclick="window.dispatchEvent(new CustomEvent('builder:removeBlock'))">Remove Block</button>
            <button class="menu-button" style="margin-top:10px;" onclick="window.dispatchEvent(new CustomEvent('builder:finalize'))">Finalize Car</button>
        `;
    }

    loadBetting() {
        const content = document.getElementById('bettingContent');
        if (!content) return;
        content.innerHTML = `
            <div>Create a bet with your car.</div>
            <input id="betCarId" placeholder="car id" class="bid-input" />
            <button class="menu-button" onclick="(function(){const carId=document.getElementById('betCarId').value;window.dispatchEvent(new CustomEvent('bet:create',{detail:{carId}}));})()">Create Bet</button>
        `;
    }

    loadLeaderboards() {
        const content = document.getElementById('leaderboardsContent');
        if (!content) return;
        content.innerHTML = `
            <div id="lb-distance" style="margin-bottom: 10px;">Distance: (loading)</div>
            <div id="lb-money" style="margin-bottom: 10px;">Money: (loading)</div>
            <div id="lb-cars">Cars Owned: (loading)</div>
        `;

        window.addEventListener('leaderboard:update', (e) => {
            const { board, list } = e.detail;
            const el = document.getElementById(`lb-${board}`);
            if (el) {
                const top5 = list.slice(0, 5).map((e, i) => `${i+1}. ${e.playerName} - ${e.value}`).join('<br>');
                el.innerHTML = `${board.charAt(0).toUpperCase()+board.slice(1)}:<br>${top5}`;
            }
        });
    }

    loadJunkyard() {
        const content = document.getElementById('junkyardContent');
        if (!content) return;
        content.innerHTML = `
            <div>Explore the junkyard in 3D world to pick scraps.</div>
        `;
    }

    loadHome() {
        const content = document.getElementById('homeContent');
        if (!content) return;
        content.innerHTML = `
            <div>Welcome home. Store parts and cars here.</div>
        `;
    }

    loadMap() {
        const content = document.getElementById('mapContent');
        if (!content) return;
        content.innerHTML = `
            <div>Markers: Showroom, Junkyard, Home</div>
        `;
    }

    loadAuctionHouse() {
        const content = document.getElementById('auctionContent');
        if (!content) return;

        // Mock auction data - in real implementation, this would come from the server
        const auctions = [
            {
                id: 'auction-1',
                car: { name: 'Ferrari 488 GTB', rarity: 'legendary' },
                seller: 'Player123',
                currentBid: 180000,
                timeLeft: '2h 15m',
                status: 'active'
            },
            {
                id: 'auction-2',
                car: { name: 'BMW M3', rarity: 'rare' },
                seller: 'Racer456',
                currentBid: 65000,
                timeLeft: '45m',
                status: 'active'
            }
        ];

        let html = '';
        if (auctions.length === 0) {
            html = '<div style="text-align: center; color: #aaa; padding: 20px;">No active auctions</div>';
        } else {
            auctions.forEach(auction => {
                const rarityColor = this.getRarityColor(auction.car.rarity);
                html += `
                    <div class="auction-item">
                        <div class="auction-car">${auction.car.name}</div>
                        <div style="font-size: 0.9em; color: #ccc; margin: 5px 0;">
                            Seller: ${auction.seller} | Time: ${auction.timeLeft}
                        </div>
                        <div class="auction-bid">Current Bid: $${auction.currentBid.toLocaleString()}</div>
                        <div style="display: flex; align-items: center; margin-top: 10px;">
                            <input type="number" class="bid-input" placeholder="Your bid" min="${auction.currentBid + 1000}">
                            <button class="bid-button" onclick="uiManager.placeBid('${auction.id}', this.previousElementSibling.value)">
                                Bid
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        content.innerHTML = html;
    }

    loadRacePanel() {
        const content = document.getElementById('raceContent');
        if (!content) return;

        // Mock race data
        const races = [
            {
                id: 'race-1',
                track: 'City Circuit',
                participants: 3,
                maxParticipants: 8,
                laps: 3,
                status: 'waiting'
            },
            {
                id: 'race-2',
                track: 'Mountain Pass',
                participants: 6,
                maxParticipants: 8,
                laps: 5,
                status: 'waiting'
            }
        ];

        let html = '';
        if (races.length === 0) {
            html = '<div style="text-align: center; color: #aaa; padding: 20px;">No active races</div>';
        } else {
            races.forEach(race => {
                html += `
                    <div class="race-item">
                        <div class="race-track">${race.track}</div>
                        <div class="race-participants">
                            ${race.participants}/${race.maxParticipants} players | ${race.laps} laps
                        </div>
                        <button class="join-race-button" onclick="uiManager.joinRace('${race.id}')">
                            Join Race
                        </button>
                    </div>
                `;
            });
        }

        content.innerHTML = html;
    }

    loadGarage() {
        const content = document.getElementById('garageContent');
        if (!content) return;

        // Mock player cars - in real implementation, this would come from the player data
        const playerCars = [
            { id: 'player-car-1', name: 'BMW M3', rarity: 'rare', purchaseDate: '2024-01-15' },
            { id: 'player-car-2', name: 'Honda Civic Type R', rarity: 'common', purchaseDate: '2024-01-10' }
        ];

        let html = '';
        if (playerCars.length === 0) {
            html = '<div style="text-align: center; color: #aaa; padding: 20px;">No cars in garage</div>';
        } else {
            playerCars.forEach(car => {
                const rarityColor = this.getRarityColor(car.rarity);
                html += `
                    <div class="car-item">
                        <div class="car-name">${car.name}</div>
                        <div class="car-specs">
                            <div>Rarity: <span style="color: ${rarityColor}">${car.rarity.toUpperCase()}</span></div>
                            <div>Purchased: ${car.purchaseDate}</div>
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button class="menu-button" style="flex: 1; padding: 8px;" onclick="uiManager.customizeCar('${car.id}')">
                                Customize
                            </button>
                            <button class="menu-button" style="flex: 1; padding: 8px; background: linear-gradient(45deg, #ff6b6b, #ff5252);" onclick="uiManager.sellCar('${car.id}')">
                                Sell
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        content.innerHTML = html;
    }

    getRarityColor(rarity) {
        const colors = {
            'common': '#9ca3af',
            'rare': '#3b82f6',
            'epic': '#8b5cf6',
            'legendary': '#f59e0b',
            'mythic': '#ef4444'
        };
        return colors[rarity] || '#9ca3af';
    }

    // Car actions
    buyCar(carId) {
        // This would normally trigger a network request
        console.log(`Buying car: ${carId}`);
        // Emit event to game engine
        window.dispatchEvent(new CustomEvent('buyCar', { detail: { carId } }));
    }

    sellCar(carId) {
        if (confirm('Are you sure you want to sell this car?')) {
            console.log(`Selling car: ${carId}`);
            window.dispatchEvent(new CustomEvent('sellCar', { detail: { carId } }));
        }
    }

    customizeCar(carId) {
        console.log(`Customizing car: ${carId}`);
        this.showCustomizationModal(carId);
    }

    // Auction actions
    placeBid(auctionId, bidAmount) {
        const amount = parseInt(bidAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid bid amount');
            return;
        }
        
        console.log(`Placing bid on auction ${auctionId}: $${amount}`);
        window.dispatchEvent(new CustomEvent('placeBid', { 
            detail: { auctionId, amount } 
        }));
    }

    showCreateAuctionModal() {
        // Create modal for creating auctions
        const modal = this.createModal('Create Auction', `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Select Car:</label>
                <select id="auctionCarSelect" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
                    <option value="">Select a car to auction</option>
                    <!-- Cars would be populated here -->
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Starting Price:</label>
                <input type="number" id="auctionStartingPrice" placeholder="Starting price" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Duration (hours):</label>
                <select id="auctionDuration" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
                    <option value="1">1 Hour</option>
                    <option value="6">6 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                </select>
            </div>
        `, [
            { text: 'Cancel', action: 'close' },
            { text: 'Create Auction', action: 'createAuction' }
        ]);

        document.body.appendChild(modal);
    }

    // Race actions
    joinRace(raceId) {
        console.log(`Joining race: ${raceId}`);
        window.dispatchEvent(new CustomEvent('joinRace', { detail: { raceId } }));
    }

    showCreateRaceModal() {
        const modal = this.createModal('Create Race', `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Track:</label>
                <select id="raceTrack" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
                    <option value="city-circuit">City Circuit</option>
                    <option value="mountain-pass">Mountain Pass</option>
                    <option value="desert-highway">Desert Highway</option>
                    <option value="coastal-road">Coastal Road</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Laps:</label>
                <input type="number" id="raceLaps" value="3" min="1" max="10" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Max Participants:</label>
                <input type="number" id="raceMaxParticipants" value="8" min="2" max="16" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
            </div>
        `, [
            { text: 'Cancel', action: 'close' },
            { text: 'Create Race', action: 'createRace' }
        ]);

        document.body.appendChild(modal);
    }

    showCustomizationModal(carId) {
        const modal = this.createModal('Customize Car', `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Color:</label>
                <input type="color" id="carColor" value="#ff0000" style="width: 100%; height: 40px; border: none; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Upgrades:</label>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="engineUpgrade">
                        <span>Engine Upgrade (+10% top speed)</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="suspensionUpgrade">
                        <span>Suspension Upgrade (+15% handling)</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="aerodynamicsUpgrade">
                        <span>Aerodynamics Upgrade (+5% top speed, +10% handling)</span>
                    </label>
                </div>
            </div>
        `, [
            { text: 'Cancel', action: 'close' },
            { text: 'Apply Changes', action: 'customizeCar' }
        ]);

        document.body.appendChild(modal);
    }

    createModal(title, content, buttons) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        modalContent.innerHTML = `
            <h2 style="color: #00ff88; margin-bottom: 20px; text-align: center;">${title}</h2>
            ${content}
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                ${buttons.map(btn => `
                    <button class="menu-button" onclick="uiManager.handleModalAction('${btn.action}', this.closest('.modal').parentElement)">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        `;

        modalContent.classList.add('modal');
        modal.appendChild(modalContent);
        return modal;
    }

    handleModalAction(action, modal) {
        switch (action) {
            case 'close':
                document.body.removeChild(modal);
                break;
            case 'createAuction':
                this.createAuction(modal);
                break;
            case 'createRace':
                this.createRace(modal);
                break;
            case 'customizeCar':
                this.applyCustomization(modal);
                break;
        }
    }

    createAuction(modal) {
        const carSelect = modal.querySelector('#auctionCarSelect');
        const startingPrice = modal.querySelector('#auctionStartingPrice');
        const duration = modal.querySelector('#auctionDuration');

        if (!carSelect.value || !startingPrice.value) {
            alert('Please fill in all fields');
            return;
        }

        const auctionData = {
            carId: carSelect.value,
            startingPrice: parseInt(startingPrice.value),
            duration: parseInt(duration.value)
        };

        console.log('Creating auction:', auctionData);
        window.dispatchEvent(new CustomEvent('createAuction', { detail: auctionData }));
        document.body.removeChild(modal);
    }

    createRace(modal) {
        const track = modal.querySelector('#raceTrack').value;
        const laps = parseInt(modal.querySelector('#raceLaps').value);
        const maxParticipants = parseInt(modal.querySelector('#raceMaxParticipants').value);

        const raceData = { track, laps, maxParticipants };
        console.log('Creating race:', raceData);
        window.dispatchEvent(new CustomEvent('createRace', { detail: raceData }));
        document.body.removeChild(modal);
    }

    applyCustomization(modal) {
        const color = modal.querySelector('#carColor').value;
        const engineUpgrade = modal.querySelector('#engineUpgrade').checked;
        const suspensionUpgrade = modal.querySelector('#suspensionUpgrade').checked;
        const aerodynamicsUpgrade = modal.querySelector('#aerodynamicsUpgrade').checked;

        const customization = {
            color: parseInt(color.replace('#', ''), 16),
            engineUpgrade,
            suspensionUpgrade,
            aerodynamicsUpgrade
        };

        console.log('Applying customization:', customization);
        window.dispatchEvent(new CustomEvent('customizeCar', { detail: customization }));
        document.body.removeChild(modal);
    }

    // Update player info
    updatePlayerInfo(playerData) {
        this.playerData = playerData;
        
        if (document.getElementById('playerName')) {
            document.getElementById('playerName').textContent = playerData.name;
        }
        if (document.getElementById('playerMoney')) {
            document.getElementById('playerMoney').textContent = `$${playerData.money.toLocaleString()}`;
        }
        if (document.getElementById('playerLevel')) {
            document.getElementById('playerLevel').textContent = playerData.level;
        }
        if (document.getElementById('playerCars')) {
            document.getElementById('playerCars').textContent = playerData.cars.length;
        }
    }

    // Show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 255, 136, 0.9)'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
}

// Make UIManager globally accessible
window.uiManager = new UIManager();
