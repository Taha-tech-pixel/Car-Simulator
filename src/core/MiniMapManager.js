export class MiniMapManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.pois = [];
    }

    attach(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    addPOI(x, z, color = '#00ff88') {
        this.pois.push({ x, z, color });
    }

    render(playerPos = { x: 0, z: 0 }) {
        if (!this.ctx) return;
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 0, width, height);
        // Draw POIs
        this.pois.forEach(p => {
            const px = width/2 + (p.x - playerPos.x) * 0.2;
            const pz = height/2 + (p.z - playerPos.z) * 0.2;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(px, pz, 3, 0, Math.PI*2);
            this.ctx.fill();
        });
        // Player
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(width/2 - 2, height/2 - 2, 4, 4);
    }
}


