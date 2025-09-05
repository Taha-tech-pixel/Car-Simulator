export class ChallengesManager {
    constructor() {
        this.daily = [];
        this.weekly = [];
        this.rollChallenges();
    }

    rollChallenges() {
        this.daily = [
            { id: 'd-collect5', text: 'Collect 5 metal scraps', reward: { money: 300 } },
            { id: 'd-win1', text: 'Win 1 race', reward: { money: 800 } }
        ];
        this.weekly = [
            { id: 'w-build1', text: 'Build 1 custom car', reward: { money: 5000 } },
            { id: 'w-distance', text: 'Drive 10,000 units', reward: { money: 7000 } }
        ];
    }
}


