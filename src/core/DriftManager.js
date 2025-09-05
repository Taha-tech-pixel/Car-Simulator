export class DriftManager {
    constructor() {
        this.enabled = false;
        this.score = 0;
        this.combo = 0;
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.score = 0;
            this.combo = 0;
        }
        window.dispatchEvent(new CustomEvent('drift:toggle', { detail: { enabled: this.enabled } }));
    }

    update(deltaTime, slip = 0) {
        if (!this.enabled) return;
        if (slip > 0.3) {
            this.combo += deltaTime * slip * 10;
            this.score += deltaTime * slip * 100;
        } else {
            this.combo = 0;
        }
        window.dispatchEvent(new CustomEvent('drift:update', { detail: { score: this.score, combo: this.combo } }));
    }
}


