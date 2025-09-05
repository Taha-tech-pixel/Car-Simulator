export class BettingManager {
    constructor() {
        this.openBets = new Map();
    }

    createBet(bet) {
        const id = 'bet_' + Math.random().toString(36).substr(2, 9);
        this.openBets.set(id, { id, ...bet, status: 'open' });
        return id;
    }

    acceptBet(id, opponent) {
        const bet = this.openBets.get(id);
        if (!bet || bet.status !== 'open') return false;
        bet.opponent = opponent;
        bet.status = 'locked';
        return true;
    }

    resolveBet(id, winner) {
        const bet = this.openBets.get(id);
        if (!bet) return null;
        bet.status = 'resolved';
        bet.winner = winner;
        return bet;
    }
}


