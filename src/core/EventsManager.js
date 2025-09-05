export class EventsManager {
    constructor() {
        this.activeEvent = null;
        this.timer = 0;
    }

    startRandomEvent() {
        const events = [
            { id: 'water-parts-boost', desc: 'Water parts drop boosted!', duration: 600 },
            { id: 'air-parts-boost', desc: 'Air parts drop boosted!', duration: 600 }
        ];
        this.activeEvent = events[Math.floor(Math.random() * events.length)];
        this.timer = this.activeEvent.duration;
        window.dispatchEvent(new CustomEvent('event:started', { detail: this.activeEvent }));
    }

    update(deltaTime) {
        if (!this.activeEvent) return;
        this.timer -= deltaTime;
        if (this.timer <= 0) {
            window.dispatchEvent(new CustomEvent('event:ended', { detail: this.activeEvent }));
            this.activeEvent = null;
        }
    }
}


