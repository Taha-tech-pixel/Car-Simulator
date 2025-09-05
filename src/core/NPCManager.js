import * as THREE from 'three';

export class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.npcs = [];
        this.spawnNPCs(10);
    }

    spawnNPCs(count) {
        for (let i = 0; i < count; i++) {
            const car = new THREE.Mesh(
                new THREE.BoxGeometry(3.5, 1.2, 1.8),
                new THREE.MeshLambertMaterial({ color: 0x555555 + Math.floor(Math.random()*0xaaaa) })
            );
            car.position.set((Math.random()-0.5)*150, 0.6, (Math.random()-0.5)*150);
            car.userData = { speed: 5 + Math.random()*10, dir: new THREE.Vector3(Math.random()-0.5, 0, Math.random()-0.5).normalize() };
            car.castShadow = true;
            this.scene.add(car);
            this.npcs.push(car);
        }
    }

    update(deltaTime) {
        this.npcs.forEach(npc => {
            const move = npc.userData.dir.clone().multiplyScalar(npc.userData.speed * deltaTime);
            npc.position.add(move);
            if (npc.position.length() > 180) {
                npc.position.multiplyScalar(-0.8);
                npc.userData.dir.multiplyScalar(-1);
            }
        });
    }
}


