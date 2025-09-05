export class ReplayManager {
    constructor() {
        this.buffer = [];
        this.maxSeconds = 30;
        this.accum = 0;
        this.photoMode = false;
    }

    togglePhotoMode() {
        this.photoMode = !this.photoMode;
        window.dispatchEvent(new CustomEvent('photo:toggle', { detail: { enabled: this.photoMode } }));
    }

    record(frame) {
        this.buffer.push({ t: performance.now(), frame });
        const cutoff = performance.now() - this.maxSeconds * 1000;
        while (this.buffer.length && this.buffer[0].t < cutoff) this.buffer.shift();
    }

    saveLastClip() {
        const clip = [...this.buffer];
        window.dispatchEvent(new CustomEvent('replay:saved', { detail: { frames: clip.length } }));
        return clip;
    }
}


