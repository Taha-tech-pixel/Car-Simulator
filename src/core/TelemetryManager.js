export class TelemetryManager {
    constructor() {
        this.stats = {
            speed: 0,
            gForce: 0,
            slip: 0,
            damage: 0,
            weather: 'clear',
            time: '12:00'
        };
        this._hudEl = null;
    }

    attach(hudElement) {
        this._hudEl = hudElement;
    }

    setWeatherAndTime(weather, timeStr) {
        this.stats.weather = weather;
        this.stats.time = timeStr;
    }

    setDamage(value) {
        this.stats.damage = value;
    }

    setDriftScore(score) {
        this.stats.driftScore = score;
    }

    update(speed = 0) {
        this.stats.speed = speed;
        if (this._hudEl) {
            this._hudEl.innerHTML = `Speed: ${Math.round(this.stats.speed)} | Damage: ${(this.stats.damage*100|0)}% | Weather: ${this.stats.weather} | Time: ${this.stats.time}${this.stats.driftScore!==undefined?` | Drift: ${Math.round(this.stats.driftScore)}`:''}`;
        }
    }
}


