export class TimeTrialManager {
    constructor(raceManager, leaderboardsManager) {
        this.raceManager = raceManager;
        this.leaderboardsManager = leaderboardsManager;
        this.activeTrial = null;
    }

    startTrial(trackId, playerId, playerName) {
        this.activeTrial = {
            trackId, playerId, playerName,
            startTime: Date.now(),
            finished: false
        };
    }

    finishTrial() {
        if (!this.activeTrial || this.activeTrial.finished) return;
        const total = (Date.now() - this.activeTrial.startTime) / 1000;
        this.activeTrial.finished = true;
        this.leaderboardsManager.updateEntry('distance', this.activeTrial.playerId, this.activeTrial.playerName, 0); // ensure presence
        this.leaderboardsManager.updateEntry('money', this.activeTrial.playerId, this.activeTrial.playerName, 0);
        this.leaderboardsManager.updateEntry('carsOwned', this.activeTrial.playerId, this.activeTrial.playerName, 0);
        window.dispatchEvent(new CustomEvent('timetrial:finished', { detail: { seconds: total } }));
        this.activeTrial = null;
    }
}


