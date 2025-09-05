export class LeaderboardsManager {
    constructor() {
        this.boards = {
            carsOwned: [],
            money: [],
            distance: []
        };
    }

    updateEntry(board, playerId, playerName, value) {
        const list = this.boards[board];
        if (!list) return;
        const idx = list.findIndex(e => e.playerId === playerId);
        if (idx >= 0) {
            list[idx].value = value;
        } else {
            list.push({ playerId, playerName, value });
        }
        list.sort((a, b) => b.value - a.value);
        this.boards[board] = list.slice(0, 50);
        window.dispatchEvent(new CustomEvent('leaderboard:update', { detail: { board, list: this.boards[board] } }));
    }
}


