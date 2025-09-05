import * as THREE from 'three';

export class JunkyardManager {
    constructor(scene) {
        this.scene = scene;
        this.yards = new Map();
        this.spawnedItems = [];
        this.initializeJunkyards();
    }

    initializeJunkyards() {
        const yard = this.createJunkyardArea('yard-1', new THREE.Vector3(-60, 0, -40));
        this.yards.set('yard-1', yard);
        this.scene.add(yard.group);
        this.spawnScraps(yard.area);
    }

    createJunkyardArea(id, position) {
        const group = new THREE.Group();
        group.position.copy(position);

        const groundGeom = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const ground = new THREE.Mesh(groundGeom, groundMat);
        ground.rotation.x = -Math.PI / 2;
        group.add(ground);

        // Piles
        for (let i = 0; i < 8; i++) {
            const pileGeom = new THREE.BoxGeometry(2 + Math.random() * 2, 1 + Math.random() * 2, 2 + Math.random() * 2);
            const pileMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
            const pile = new THREE.Mesh(pileGeom, pileMat);
            pile.position.set((Math.random() - 0.5) * 20, 0.5, (Math.random() - 0.5) * 20);
            pile.castShadow = true;
            group.add(pile);
        }

        return { id, group, area: { center: position, radius: 18 } };
    }

    spawnScraps(area) {
        for (let i = 0; i < 20; i++) {
            const scrapGeom = new THREE.SphereGeometry(0.3, 6, 4);
            const scrapMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const scrap = new THREE.Mesh(scrapGeom, scrapMat);
            const offset = new THREE.Vector3((Math.random() - 0.5) * area.radius * 2, 0.3, (Math.random() - 0.5) * area.radius * 2);
            scrap.position.copy(area.center).add(offset);
            scrap.userData = { collectable: true, itemId: 'metal-scrap' };
            this.scene.add(scrap);
            this.spawnedItems.push({ mesh: scrap, itemId: 'metal-scrap' });
        }
    }
}


