import * as THREE from 'three';

export class CarBuilderManager {
    constructor(scene) {
        this.scene = scene;
        this.workspace = new THREE.Group();
        this.workspace.name = 'CarBuilderWorkspace';
        this.blocks = [];
        this.isActive = false;
    }

    begin() {
        if (!this.isActive) {
            this.scene.add(this.workspace);
            this.isActive = true;
        }
    }

    end() {
        if (this.isActive) {
            this.scene.remove(this.workspace);
            this.blocks = [];
            this.isActive = false;
        }
    }

    addBlock(position = new THREE.Vector3(), size = new THREE.Vector3(1, 1, 1), color = 0x999999) {
        if (!this.isActive) this.begin();
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshLambertMaterial({ color });
        const block = new THREE.Mesh(geometry, material);
        block.position.copy(position);
        block.castShadow = true;
        block.receiveShadow = true;
        this.workspace.add(block);
        this.blocks.push(block);
        return block;
    }

    removeLastBlock() {
        const block = this.blocks.pop();
        if (block) {
            this.workspace.remove(block);
        }
    }

    finalizeAsCar(id = 'custom-car') {
        if (this.blocks.length === 0) return null;
        const carGroup = new THREE.Group();
        this.blocks.forEach(b => {
            const clone = b.clone();
            carGroup.add(clone);
        });
        carGroup.userData = {
            carData: {
                id,
                name: 'Custom Car',
                brand: 'Player',
                price: 0,
                topSpeed: 150,
                acceleration: 4.5,
                handling: 80,
                rarity: 'common',
                category: 'custom'
            },
            isPlaceholder: false
        };
        this.end();
        return carGroup;
    }
}


