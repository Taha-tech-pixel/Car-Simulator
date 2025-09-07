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
        this.installAnimationsCSS();
        this.installDevConsole();
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

        const tournamentsBtn = document.getElementById('tournamentsBtn');
        if (tournamentsBtn) tournamentsBtn.addEventListener('click', () => this.togglePanel('tournamentsPanel'));

        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.togglePanel('settingsPanel'));

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
            panel.style.animation = 'fadeInPanel 250ms ease-out';
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
            case 'tournamentsPanel':
                this.loadTournaments();
                break;
            case 'settingsPanel':
                this.loadSettings();
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
            <div id="partsTable" style="margin-top:15px;"></div>
        `;

        // Render parts table when builder finalizes
        const handler = (e) => {
            const parts = e.detail?.parts || [];
            const table = document.getElementById('partsTable');
            if (!table) return;
            if (parts.length === 0) { table.innerHTML = '<div style="color:#aaa;">No parts</div>'; return; }
            const rows = parts.map(p => `<tr><td style=\"padding:6px; border:1px solid #0a5;\">${p.idx}</td><td style=\"padding:6px; border:1px solid #0a5;\">${p.size}</td><td style=\"padding:6px; border:1px solid #0a5;\">[img]</td></tr>`).join('');
            table.innerHTML = `
                <h4 style=\"color:#00ff88; margin: 10px 0;\">Parts Table</h4>
                <table style=\"width:100%; border-collapse: collapse;\">
                    <thead>
                        <tr><th style=\"text-align:left; padding:6px; border:1px solid #0a5;\">#</th><th style=\"text-align:left; padding:6px; border:1px solid #0a5;\">Size</th><th style=\"text-align:left; padding:6px; border:1px solid #0a5;\">Preview</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>`;
        };
        window.addEventListener('builder:partsTable', handler, { once: false });
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

    loadTournaments() {
        const content = document.getElementById('tournamentsContent');
        if (!content) return;
        content.innerHTML = `
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <button class="menu-button" onclick="window.dispatchEvent(new CustomEvent('tournament:create', { detail: { name: 'Quick Cup', maxPlayers: 8 } }))">Create Tournament</button>
                <button class="menu-button" onclick="uiManager.fetchServers()">Server List</button>
            </div>
            <div id="tournamentsList">No tournaments yet</div>
        `;

        window.addEventListener('network:tournamentCreated', (e) => this.renderTournamentList([e.detail]));
        window.addEventListener('network:tournamentUpdated', (e) => this.renderTournamentList([e.detail]));
        window.addEventListener('network:tournamentStarted', (e) => this.renderTournamentList([e.detail]));
        window.addEventListener('network:tournamentFinished', (e) => this.renderTournamentList([e.detail]));
    }

    renderTournamentList(list) {
        const wrap = document.getElementById('tournamentsList');
        if (!wrap) return;
        const html = list.map(t => `
            <div class="race-item">
                <div class="race-track">${t.name} - ${t.status}</div>
                <div class="race-participants">${t.participants?.length || 0}/${t.maxPlayers} players | Arena: ${t.arena || 'default'}</div>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <button class="menu-button" onclick="window.dispatchEvent(new CustomEvent('tournament:join', { detail: { id: '${t.id}' } }))">Join</button>
                    <button class="menu-button" onclick="window.dispatchEvent(new CustomEvent('tournament:start', { detail: { id: '${t.id}' } }))">Start</button>
                </div>
            </div>
        `).join('');
        wrap.innerHTML = html || '<div style="color:#aaa;">No tournaments yet</div>';
    }

    loadSettings() {
        const content = document.getElementById('settingsContent');
        if (!content) return;
        content.innerHTML = `
            <div>Controls</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:8px;">
                <label>Accelerate</label><input id="keyAccelerate" placeholder="W" />
                <label>Brake</label><input id="keyBrake" placeholder="S" />
                <label>Left</label><input id="keyLeft" placeholder="A" />
                <label>Right</label><input id="keyRight" placeholder="D" />
            </div>
            <button class="menu-button" style="margin-top:10px;" onclick="uiManager.saveControls()">Save Controls</button>
        `;
    }

    saveControls() {
        const map = {
            accelerate: document.getElementById('keyAccelerate')?.value || 'W',
            brake: document.getElementById('keyBrake')?.value || 'S',
            left: document.getElementById('keyLeft')?.value || 'A',
            right: document.getElementById('keyRight')?.value || 'D'
        };
        localStorage.setItem('controls-map', JSON.stringify(map));
        this.showNotification('Controls saved', 'success');
    }

    async fetchServers() {
        try {
            const res = await fetch('/servers');
            const data = await res.json();
            const list = (data?.servers || []).map(s => `${s.name} - ${s.url}`).join('\n');
            alert(list || 'No servers');
        } catch (e) {
            console.error(e);
        }
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
                        <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                            <button class="menu-button" style="flex: 1; padding: 8px;" onclick="uiManager.customizeCar('${car.id}')">
                                Customize
                            </button>
                            <button class="menu-button" style="flex: 1; padding: 8px; background: linear-gradient(45deg, #ff6b6b, #ff5252);" onclick="uiManager.sellCar('${car.id}')">
                                Sell
                            </button>
                            <button class="menu-button" style="flex: 1; padding: 8px; background: linear-gradient(45deg, #00c853, #00e676);" onclick="uiManager.refuelCar()">
                                Refuel
                            </button>
                            <button class="menu-button" style="flex: 1; padding: 8px; background: linear-gradient(45deg, #00b0ff, #40c4ff);" onclick="uiManager.rechargeCar()">
                                Recharge
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

    // Added helpers
    refuelCar() {
        if (window.game?.networkManager?.isConnected) {
            window.game.networkManager.socket.emit('refuel', 20);
        } else {
            this.showNotification('Connect to server to refuel', 'error');
        }
    }

    rechargeCar() {
        if (window.game?.networkManager?.isConnected) {
            window.game.networkManager.socket.emit('recharge', 20);
        } else {
            this.showNotification('Connect to server to recharge', 'error');
        }
    }

    reportPlayerUI() {
        const modal = this.createModal('Report Player', `
            <div style="margin-bottom: 10px;">
                <input id="reportAccused" placeholder="Accused Player ID" class="bid-input"/>
            </div>
            <div style="margin-bottom: 10px;">
                <select id="reportCategory" class="bid-input">
                    <option value="cheating">Cheating</option>
                    <option value="abuse">Abuse</option>
                    <option value="spam">Spam</option>
                </select>
            </div>
            <div>
                <textarea id="reportMessage" placeholder="Describe the issue" class="bid-input"></textarea>
            </div>
        `, [
            { text: 'Cancel', action: 'close' },
            { text: 'Submit', action: 'submitReport' }
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
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Skin:</label>
                <select id="carSkin" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
                    <option value="default">Factory</option>
                    <option value="stealth">Stealth Matte</option>
                    <option value="neon">Neon Pulse</option>
                    <option value="gold">Gold Chrome</option>
                    <option value="crimson">Crimson</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #00ff88;">Element:</label>
                <select id="carElement" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid #00ff88; border-radius: 5px; color: white;">
                    <option value="">None</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="earth">Earth</option>
                    <option value="air">Air</option>
                </select>
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
                    <div style="height:1px; background: rgba(255,255,255,0.1);"></div>
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="attachSpikes">
                        <span>Add Spikes</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="attachGuns">
                        <span>Add Guns</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="attachBombs">
                        <span>Add Bomb</span>
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
            case 'submitReport':
                this.submitReport(modal);
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
        const skinId = modal.querySelector('#carSkin')?.value;
        const element = modal.querySelector('#carElement')?.value || '';
        const engineUpgrade = modal.querySelector('#engineUpgrade').checked;
        const suspensionUpgrade = modal.querySelector('#suspensionUpgrade').checked;
        const aerodynamicsUpgrade = modal.querySelector('#aerodynamicsUpgrade').checked;
        const spikes = modal.querySelector('#attachSpikes').checked;
        const guns = modal.querySelector('#attachGuns').checked;
        const bombs = modal.querySelector('#attachBombs').checked;

        const customization = {
            color: parseInt(color.replace('#', ''), 16),
            skinId,
            element: element || undefined,
            attachments: { spikes, guns, bombs },
            engineUpgrade,
            suspensionUpgrade,
            aerodynamicsUpgrade
        };

        console.log('Applying customization:', customization);
        window.dispatchEvent(new CustomEvent('customizeCar', { detail: customization }));
        document.body.removeChild(modal);
    }

    submitReport(modal) {
        const accusedId = modal.querySelector('#reportAccused').value;
        const category = modal.querySelector('#reportCategory').value;
        const message = modal.querySelector('#reportMessage').value;
        if (!accusedId) { alert('Enter accused ID'); return; }
        if (window.game?.networkManager?.isConnected) {
            window.game.networkManager.reportPlayer(accusedId, category, message);
            document.body.removeChild(modal);
        } else {
            this.showNotification('Connect to server to report', 'error');
        }
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
            animation: popIn 200ms ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'fadeOut 250ms ease-in';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 230);
            }
        }, 5000);
    }

    installAnimationsCSS() {
        if (document.getElementById('ui-anim-styles')) return;
        const style = document.createElement('style');
        style.id = 'ui-anim-styles';
        style.textContent = `
            @keyframes fadeInPanel { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            .menu-button { transition: transform 120ms ease, filter 120ms ease; }
            .menu-button:hover { transform: translateY(-1px); filter: brightness(1.08); }
            .menu-button:active { transform: translateY(0); filter: brightness(0.95); }
        `;
        document.head.appendChild(style);
    }

    installDevConsole() {
        // Hidden console (Ctrl+Alt+D)
        const panel = document.createElement('div');
        panel.id = 'devConsole';
        panel.style.cssText = `
            position: fixed; bottom: 10px; left: 10px; width: 360px; max-height: 40vh; overflow:auto;
            background: rgba(0,0,0,0.85); border: 1px solid #0f8; border-radius: 6px; padding: 10px; display:none; z-index:10001;
        `;
        panel.innerHTML = `
            <div style="color:#0f8; margin-bottom:6px;">Developer Console</div>
            <input id="devSecret" type="password" placeholder="Secret" style="width:100%; margin-bottom:6px;"/>
            <div style="display:flex; gap:6px;">
                <select id="devCmd" style="flex:1;">
                    <option value="giveMoney">giveMoney</option>
                    <option value="spawnCar">spawnCar</option>
                    <option value="ban">ban</option>
                    <option value="freeze">freeze</option>
                    <option value="unfreeze">unfreeze</option>
                </select>
                <input id="devTarget" placeholder="target socket id" style="flex:1;"/>
                <input id="devArg1" placeholder="arg1" style="flex:1;"/>
            </div>
            <button class="menu-button" id="devSend" style="margin-top:6px; width:100%;">Execute</button>
            <div id="devLog" style="margin-top:8px; font-size:12px; color:#ddd;"></div>
        `;
        document.body.appendChild(panel);

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.code === 'KeyD') {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });

        const logDiv = panel.querySelector('#devLog');
        const btn = panel.querySelector('#devSend');
        btn.addEventListener('click', () => {
            const secret = panel.querySelector('#devSecret').value;
            const cmd = panel.querySelector('#devCmd').value;
            const targetId = panel.querySelector('#devTarget').value;
            const arg1 = panel.querySelector('#devArg1').value;
            const args = (cmd === 'giveMoney') ? { targetId, amount: Number(arg1)||0 } :
                         (cmd === 'spawnCar') ? { targetId, carId: arg1 } :
                         { targetId };
            if (!window.game?.networkManager?.isConnected) {
                this.showNotification('Not connected', 'error');
                return;
            }
            window.game.networkManager.socket.emit('admin:exec', { secret, cmd, args });
        });

        window.addEventListener('network:adminLog', (e) => {
            const { level, message } = e.detail || {};
            const row = document.createElement('div');
            row.textContent = `[${level}] ${message}`;
            row.style.color = level === 'error' ? '#f66' : '#9f9';
            logDiv.appendChild(row);
            logDiv.scrollTop = logDiv.scrollHeight;
        });
    }
}

// Make UIManager globally accessible
window.uiManager = new UIManager();
