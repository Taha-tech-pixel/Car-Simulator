import * as THREE from 'three';

export class WeatherManager {
    constructor(scene) {
        this.scene = scene;
        this.timeOfDay = 12.0; // 0-24
        this.dayLengthSeconds = 300; // full day in seconds
        this.weather = 'clear'; // clear | rain | foggy
        this.transitionTimer = 0;
        this.nextWeatherChange = 60; // seconds

        this.rainGroup = new THREE.Group();
        this.scene.add(this.rainGroup);
        this.spawnRainParticles();
    }

    spawnRainParticles() {
        this.rainGroup.clear();
        const count = 400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 50 + 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.1, transparent: true, opacity: 0.7 });
        const points = new THREE.Points(geometry, material);
        points.visible = this.weather === 'rain';
        this.rainGroup.add(points);
    }

    setWeather(type) {
        this.weather = type;
        if (this.rainGroup.children[0]) {
            this.rainGroup.children[0].visible = type === 'rain';
        }
    }

    update(deltaTime, lights) {
        // Advance time of day
        this.timeOfDay = (this.timeOfDay + (24 * deltaTime / this.dayLengthSeconds)) % 24;

        // Cycle weather occasionally
        this.transitionTimer += deltaTime;
        if (this.transitionTimer >= this.nextWeatherChange) {
            this.transitionTimer = 0;
            this.nextWeatherChange = 45 + Math.random() * 75;
            const types = ['clear', 'rain', 'foggy'];
            this.setWeather(types[Math.floor(Math.random() * types.length)]);
        }

        // Animate rain
        if (this.weather === 'rain' && this.rainGroup.children[0]) {
            const arr = this.rainGroup.children[0].geometry.attributes.position;
            for (let i = 0; i < arr.count; i++) {
                const y = arr.getY(i) - deltaTime * 15;
                arr.setY(i, y < 0 ? Math.random() * 50 + 10 : y);
            }
            arr.needsUpdate = true;
        }

        // Apply lighting and fog based on time/weather
        if (lights) {
            const { ambient, sun, rim } = lights;
            const t = this.timeOfDay;
            const isNight = t < 6 || t > 18;
            const sunIntensity = isNight ? 0.05 : 1.0 * Math.max(0.2, Math.sin(((t - 6) / 12) * Math.PI));
            const ambientIntensity = isNight ? 0.2 : 0.6;
            if (sun) sun.intensity = sunIntensity;
            if (ambient) ambient.intensity = ambientIntensity;
            if (rim) rim.intensity = isNight ? 0.1 : 0.2;

            // Sky/fog color shift
            const duskFactor = Math.max(0, Math.cos(((t - 12) / 12) * Math.PI));
            const sky = new THREE.Color().lerpColors(new THREE.Color(0x0a0f1a), new THREE.Color(0x87CEEB), 1 - isNight * 0.8);
            this.scene.background = sky;
            const fogColor = new THREE.Color(0x87CEEB).lerp(new THREE.Color(0x8899aa), isNight ? 0.7 : 0.2);
            if (!this.scene.fog) this.scene.fog = new THREE.Fog(fogColor, 50, 200);
            this.scene.fog.color.copy(fogColor);

            // Weather fog density tweak
            if (this.weather === 'foggy') {
                this.scene.fog.near = 30;
                this.scene.fog.far = 120;
            } else if (this.weather === 'rain') {
                this.scene.fog.near = 40;
                this.scene.fog.far = 160;
            } else {
                this.scene.fog.near = 50;
                this.scene.fog.far = 200;
            }
        }
    }
}


