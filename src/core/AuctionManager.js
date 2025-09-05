export class AuctionManager {
    constructor() {
        this.activeAuctions = new Map();
        this.auctionHistory = new Map();
        this.bidHistory = new Map();
        this.auctionCategories = ['sports', 'luxury', 'supercars', 'normal'];
        
        this.initializeAuctionSystem();
    }

    initializeAuctionSystem() {
        // Set up auction cleanup timer
        setInterval(() => {
            this.cleanupExpiredAuctions();
        }, 60000); // Check every minute
        
        console.log('Auction system initialized');
    }

    // Auction creation
    createAuction(auctionData) {
        const auction = {
            id: this.generateAuctionId(),
            sellerId: auctionData.sellerId,
            sellerName: auctionData.sellerName,
            car: auctionData.car,
            startingPrice: auctionData.startingPrice,
            currentBid: auctionData.startingPrice,
            currentBidder: null,
            currentBidderName: null,
            bidHistory: [],
            endTime: Date.now() + (auctionData.duration * 60 * 1000), // duration in minutes
            status: 'active', // active, ended, cancelled
            createdAt: Date.now(),
            category: auctionData.car.category,
            rarity: auctionData.car.rarity
        };
        
        this.activeAuctions.set(auction.id, auction);
        this.emit('auctionCreated', auction);
        
        return auction;
    }

    // Bidding system
    placeBid(auctionId, bidderId, bidderName, bidAmount) {
        const auction = this.activeAuctions.get(auctionId);
        if (!auction || auction.status !== 'active') {
            return { success: false, message: 'Auction not found or not active' };
        }
        
        if (Date.now() >= auction.endTime) {
            return { success: false, message: 'Auction has ended' };
        }
        
        if (bidAmount <= auction.currentBid) {
            return { success: false, message: 'Bid must be higher than current bid' };
        }
        
        if (bidderId === auction.sellerId) {
            return { success: false, message: 'Cannot bid on your own auction' };
        }
        
        // Record the bid
        const bid = {
            id: this.generateBidId(),
            auctionId,
            bidderId,
            bidderName,
            amount: bidAmount,
            timestamp: Date.now()
        };
        
        auction.bidHistory.push(bid);
        auction.currentBid = bidAmount;
        auction.currentBidder = bidderId;
        auction.currentBidderName = bidderName;
        
        this.activeAuctions.set(auctionId, auction);
        this.emit('bidPlaced', bid);
        this.emit('auctionUpdated', auction);
        
        return { success: true, bid, auction };
    }

    // Auction management
    endAuction(auctionId) {
        const auction = this.activeAuctions.get(auctionId);
        if (!auction) {
            return { success: false, message: 'Auction not found' };
        }
        
        auction.status = 'ended';
        auction.endTime = Date.now();
        
        // Move to history
        this.auctionHistory.set(auctionId, auction);
        this.activeAuctions.delete(auctionId);
        
        this.emit('auctionEnded', auction);
        
        return { success: true, auction };
    }

    cancelAuction(auctionId, sellerId) {
        const auction = this.activeAuctions.get(auctionId);
        if (!auction) {
            return { success: false, message: 'Auction not found' };
        }
        
        if (auction.sellerId !== sellerId) {
            return { success: false, message: 'Only the seller can cancel the auction' };
        }
        
        if (auction.bidHistory.length > 0) {
            return { success: false, message: 'Cannot cancel auction with active bids' };
        }
        
        auction.status = 'cancelled';
        auction.endTime = Date.now();
        
        // Move to history
        this.auctionHistory.set(auctionId, auction);
        this.activeAuctions.delete(auctionId);
        
        this.emit('auctionCancelled', auction);
        
        return { success: true, auction };
    }

    // Auction queries
    getAuction(auctionId) {
        return this.activeAuctions.get(auctionId) || this.auctionHistory.get(auctionId);
    }

    getActiveAuctions() {
        return Array.from(this.activeAuctions.values());
    }

    getAuctionsByCategory(category) {
        return this.getActiveAuctions().filter(auction => auction.category === category);
    }

    getAuctionsByRarity(rarity) {
        return this.getActiveAuctions().filter(auction => auction.rarity === rarity);
    }

    getAuctionsBySeller(sellerId) {
        return this.getActiveAuctions().filter(auction => auction.sellerId === sellerId);
    }

    getAuctionsByBidder(bidderId) {
        return this.getActiveAuctions().filter(auction => 
            auction.bidHistory.some(bid => bid.bidderId === bidderId)
        );
    }

    // Search and filtering
    searchAuctions(query) {
        const activeAuctions = this.getActiveAuctions();
        const searchTerm = query.toLowerCase();
        
        return activeAuctions.filter(auction => 
            auction.car.name.toLowerCase().includes(searchTerm) ||
            auction.car.brand.toLowerCase().includes(searchTerm) ||
            auction.sellerName.toLowerCase().includes(searchTerm)
        );
    }

    filterAuctions(filters) {
        let auctions = this.getActiveAuctions();
        
        if (filters.category) {
            auctions = auctions.filter(auction => auction.category === filters.category);
        }
        
        if (filters.rarity) {
            auctions = auctions.filter(auction => auction.rarity === filters.rarity);
        }
        
        if (filters.minPrice) {
            auctions = auctions.filter(auction => auction.currentBid >= filters.minPrice);
        }
        
        if (filters.maxPrice) {
            auctions = auctions.filter(auction => auction.currentBid <= filters.maxPrice);
        }
        
        if (filters.timeLeft) {
            const now = Date.now();
            auctions = auctions.filter(auction => {
                const timeLeft = auction.endTime - now;
                return timeLeft <= filters.timeLeft * 60 * 1000; // Convert minutes to milliseconds
            });
        }
        
        return auctions;
    }

    // Auction statistics
    getAuctionStats() {
        const activeAuctions = this.getActiveAuctions();
        const historicalAuctions = Array.from(this.auctionHistory.values());
        
        const stats = {
            active: activeAuctions.length,
            total: activeAuctions.length + historicalAuctions.length,
            byCategory: {},
            byRarity: {},
            averageBid: 0,
            totalVolume: 0
        };
        
        // Calculate category stats
        this.auctionCategories.forEach(category => {
            stats.byCategory[category] = activeAuctions.filter(a => a.category === category).length;
        });
        
        // Calculate rarity stats
        const rarities = ['common', 'rare', 'epic', 'legendary', 'mythic'];
        rarities.forEach(rarity => {
            stats.byRarity[rarity] = activeAuctions.filter(a => a.rarity === rarity).length;
        });
        
        // Calculate average bid and total volume
        const allAuctions = [...activeAuctions, ...historicalAuctions];
        if (allAuctions.length > 0) {
            const totalBids = allAuctions.reduce((sum, auction) => sum + auction.currentBid, 0);
            stats.averageBid = totalBids / allAuctions.length;
            stats.totalVolume = allAuctions.reduce((sum, auction) => sum + auction.currentBid, 0);
        }
        
        return stats;
    }

    // Time management
    getTimeLeft(auctionId) {
        const auction = this.activeAuctions.get(auctionId);
        if (!auction) return 0;
        
        const timeLeft = auction.endTime - Date.now();
        return Math.max(0, timeLeft);
    }

    formatTimeLeft(auctionId) {
        const timeLeft = this.getTimeLeft(auctionId);
        if (timeLeft <= 0) return 'Ended';
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Cleanup expired auctions
    cleanupExpiredAuctions() {
        const now = Date.now();
        const expiredAuctions = [];
        
        for (const [auctionId, auction] of this.activeAuctions) {
            if (now >= auction.endTime && auction.status === 'active') {
                expiredAuctions.push(auctionId);
            }
        }
        
        expiredAuctions.forEach(auctionId => {
            this.endAuction(auctionId);
        });
        
        if (expiredAuctions.length > 0) {
            console.log(`Cleaned up ${expiredAuctions.length} expired auctions`);
        }
    }

    // Bid history
    getBidHistory(auctionId) {
        const auction = this.getAuction(auctionId);
        return auction ? auction.bidHistory : [];
    }

    getBidderHistory(bidderId) {
        const allAuctions = [...this.getActiveAuctions(), ...Array.from(this.auctionHistory.values())];
        const bidderBids = [];
        
        allAuctions.forEach(auction => {
            auction.bidHistory.forEach(bid => {
                if (bid.bidderId === bidderId) {
                    bidderBids.push({
                        ...bid,
                        auction: auction
                    });
                }
            });
        });
        
        return bidderBids.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Auction recommendations
    getRecommendedAuctions(playerId, playerCars) {
        const activeAuctions = this.getActiveAuctions();
        const recommendations = [];
        
        // Filter out auctions by the same player
        const otherAuctions = activeAuctions.filter(auction => auction.sellerId !== playerId);
        
        // Recommend based on player's car collection
        const playerCategories = new Set(playerCars.map(car => car.category));
        const playerRarities = new Set(playerCars.map(car => car.rarity));
        
        otherAuctions.forEach(auction => {
            let score = 0;
            
            // Higher score for categories player doesn't have
            if (!playerCategories.has(auction.category)) {
                score += 10;
            }
            
            // Higher score for higher rarity
            const rarityScores = {
                'common': 1,
                'rare': 2,
                'epic': 3,
                'legendary': 4,
                'mythic': 5
            };
            score += rarityScores[auction.rarity] || 0;
            
            // Lower score for very high prices
            if (auction.currentBid > 1000000) {
                score -= 5;
            }
            
            // Higher score for ending soon
            const timeLeft = this.getTimeLeft(auction.id);
            if (timeLeft < 30 * 60 * 1000) { // Less than 30 minutes
                score += 5;
            }
            
            recommendations.push({
                auction,
                score
            });
        });
        
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(rec => rec.auction);
    }

    // Utility methods
    generateAuctionId() {
        return 'auction_' + Math.random().toString(36).substr(2, 9);
    }

    generateBidId() {
        return 'bid_' + Math.random().toString(36).substr(2, 9);
    }

    // Event system
    emit(event, data) {
        window.dispatchEvent(new CustomEvent(`auction:${event}`, { detail: data }));
    }

    // Update method for game loop
    update(deltaTime) {
        // Update auction timers and check for expirations
        for (const [auctionId, auction] of this.activeAuctions) {
            if (Date.now() >= auction.endTime && auction.status === 'active') {
                this.endAuction(auctionId);
            }
        }
    }

    // Cleanup
    destroy() {
        this.activeAuctions.clear();
        this.auctionHistory.clear();
        this.bidHistory.clear();
    }
}
