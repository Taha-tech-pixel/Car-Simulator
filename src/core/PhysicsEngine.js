import * as THREE from 'three';

export class PhysicsEngine {
    constructor() {
        this.world = null;
        this.bodies = new Map();
        this.vehicles = new Map();
        this.gravity = -9.82;
        this.timeStep = 1/60;
        this.maxSubSteps = 3;
        
        this.initializePhysics();
    }

    initializePhysics() {
        // For now, we'll use a simple physics simulation
        // In a real implementation, you would integrate with Cannon.js or similar
        console.log('Physics engine initialized');
    }

    // Car physics
    createCarBody(carMesh, carData) {
        const body = {
            mesh: carMesh,
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            acceleration: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            angularVelocity: new THREE.Vector3(),
            mass: this.calculateCarMass(carData),
            drag: 0.98,
            angularDrag: 0.95,
            onGround: false,
            wheelContacts: []
        };

        this.bodies.set(carMesh.uuid, body);
        return body;
    }

    calculateCarMass(carData) {
        // Calculate mass based on car specifications
        const baseMass = 1200; // kg
        const categoryMultiplier = {
            'sports': 0.9,
            'luxury': 1.2,
            'supercars': 0.8,
            'normal': 1.0
        };
        
        return baseMass * (categoryMultiplier[carData.category] || 1.0);
    }

    // Car movement and controls
    applyCarForces(body, input) {
        if (!body) return;

        const { throttle, brake, steering, handbrake } = input;
        
        // Calculate engine force
        const engineForce = this.calculateEngineForce(body, throttle, brake);
        
        // Calculate steering force
        const steeringForce = this.calculateSteeringForce(body, steering);
        
        // Apply forces
        this.applyForce(body, engineForce);
        this.applyTorque(body, steeringForce);
        
        // Apply drag
        this.applyDrag(body);
        
        // Apply ground friction
        if (body.onGround) {
            this.applyGroundFriction(body, handbrake);
        }
    }

    calculateEngineForce(body, throttle, brake) {
        const force = new THREE.Vector3();
        
        if (throttle > 0) {
            // Forward force
            const forward = new THREE.Vector3(0, 0, 1);
            forward.applyQuaternion(body.mesh.quaternion);
            force.add(forward.multiplyScalar(throttle * 2000));
        }
        
        if (brake > 0) {
            // Braking force (opposite to velocity)
            const brakeForce = body.velocity.clone().multiplyScalar(-brake * 3000);
            force.add(brakeForce);
        }
        
        return force;
    }

    calculateSteeringForce(body, steering) {
        if (Math.abs(steering) < 0.1) return new THREE.Vector3();
        
        const steeringTorque = steering * 1000;
        return new THREE.Vector3(0, steeringTorque, 0);
    }

    applyForce(body, force) {
        const acceleration = force.clone().divideScalar(body.mass);
        body.acceleration.add(acceleration);
    }

    applyTorque(body, torque) {
        const angularAcceleration = torque.clone().divideScalar(body.mass);
        body.angularVelocity.add(angularAcceleration);
    }

    applyDrag(body) {
        // Air resistance
        body.velocity.multiplyScalar(body.drag);
        body.angularVelocity.multiplyScalar(body.angularDrag);
    }

    applyGroundFriction(body, handbrake) {
        const friction = handbrake ? 0.3 : 0.8;
        const frictionForce = body.velocity.clone().multiplyScalar(-friction);
        this.applyForce(body, frictionForce);
    }

    // Collision detection
    checkCollisions(body) {
        const collisions = [];
        
        // Simple AABB collision detection
        for (const [otherId, otherBody] of this.bodies) {
            if (otherId === body.mesh.uuid) continue;
            
            if (this.checkAABBCollision(body, otherBody)) {
                collisions.push({
                    body: otherBody,
                    normal: this.calculateCollisionNormal(body, otherBody),
                    depth: this.calculateCollisionDepth(body, otherBody)
                });
            }
        }
        
        return collisions;
    }

    checkAABBCollision(body1, body2) {
        const box1 = new THREE.Box3().setFromObject(body1.mesh);
        const box2 = new THREE.Box3().setFromObject(body2.mesh);
        return box1.intersectsBox(box2);
    }

    calculateCollisionNormal(body1, body2) {
        const direction = body2.position.clone().sub(body1.position);
        return direction.normalize();
    }

    calculateCollisionDepth(body1, body2) {
        const box1 = new THREE.Box3().setFromObject(body1.mesh);
        const box2 = new THREE.Box3().setFromObject(body2.mesh);
        
        const intersection = box1.intersect(box2);
        if (intersection.isEmpty()) return 0;
        
        return intersection.getSize(new THREE.Vector3()).length();
    }

    // Collision response
    resolveCollision(collision) {
        const { body1, body2, normal, depth } = collision;
        
        // Separate bodies
        const separation = normal.clone().multiplyScalar(depth * 0.5);
        body1.position.sub(separation);
        body2.position.add(separation);
        
        // Calculate relative velocity
        const relativeVelocity = body2.velocity.clone().sub(body1.velocity);
        const velocityAlongNormal = relativeVelocity.dot(normal);
        
        // Don't resolve if velocities are separating
        if (velocityAlongNormal > 0) return;
        
        // Calculate restitution
        const restitution = 0.3;
        const impulse = -(1 + restitution) * velocityAlongNormal;
        const totalMass = body1.mass + body2.mass;
        
        // Apply impulse
        const impulseVector = normal.clone().multiplyScalar(impulse);
        body1.velocity.add(impulseVector.clone().multiplyScalar(-1 / body1.mass));
        body2.velocity.add(impulseVector.clone().multiplyScalar(1 / body2.mass));
    }

    // Ground collision
    checkGroundCollision(body) {
        const groundY = 0;
        const carBottom = body.position.y - 1; // Approximate car height
        
        if (carBottom <= groundY) {
            body.position.y = groundY + 1;
            body.velocity.y = Math.max(0, body.velocity.y);
            body.onGround = true;
            return true;
        }
        
        body.onGround = false;
        return false;
    }

    // Update physics simulation
    update(deltaTime) {
        // Update all bodies
        for (const [id, body] of this.bodies) {
            this.updateBody(body, deltaTime);
        }
        
        // Check collisions
        this.checkAllCollisions();
    }

    updateBody(body, deltaTime) {
        // Check ground collision
        this.checkGroundCollision(body);
        
        // Update velocity
        body.velocity.add(body.acceleration.clone().multiplyScalar(deltaTime));
        
        // Update position
        body.position.add(body.velocity.clone().multiplyScalar(deltaTime));
        
        // Update rotation
        body.rotation.x += body.angularVelocity.x * deltaTime;
        body.rotation.y += body.angularVelocity.y * deltaTime;
        body.rotation.z += body.angularVelocity.z * deltaTime;
        
        // Update mesh
        body.mesh.position.copy(body.position);
        body.mesh.rotation.copy(body.rotation);
        
        // Reset acceleration
        body.acceleration.set(0, 0, 0);
    }

    checkAllCollisions() {
        const bodies = Array.from(this.bodies.values());
        
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const body1 = bodies[i];
                const body2 = bodies[j];
                
                const collisions = this.checkCollisions(body1);
                const collision = collisions.find(c => c.body === body2);
                
                if (collision) {
                    this.resolveCollision({
                        body1,
                        body2,
                        normal: collision.normal,
                        depth: collision.depth
                    });
                }
            }
        }
    }

    // Racing physics
    calculateLapTime(carBody, trackData) {
        // Calculate lap time based on car performance and track difficulty
        const baseTime = trackData.baseTime || 120; // seconds
        const carPerformance = this.calculateCarPerformance(carBody);
        const performanceMultiplier = 1 - (carPerformance / 100) * 0.3; // Up to 30% faster
        
        return baseTime * performanceMultiplier;
    }

    calculateCarPerformance(carBody) {
        // Calculate overall car performance score
        const carData = carBody.mesh.userData.carData;
        if (!carData) return 50;
        
        const topSpeedScore = (carData.topSpeed / 300) * 30; // Max 30 points
        const accelerationScore = (10 / carData.acceleration) * 30; // Max 30 points
        const handlingScore = (carData.handling / 100) * 40; // Max 40 points
        
        return topSpeedScore + accelerationScore + handlingScore;
    }

    // Utility methods
    getBody(mesh) {
        return this.bodies.get(mesh.uuid);
    }

    removeBody(mesh) {
        this.bodies.delete(mesh.uuid);
    }

    setGravity(gravity) {
        this.gravity = gravity;
    }

    // Debug visualization
    createDebugVisualization() {
        const debugGroup = new THREE.Group();
        
        for (const [id, body] of this.bodies) {
            // Velocity vector
            const velocityGeometry = new THREE.ConeGeometry(0.1, 0.5, 6);
            const velocityMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const velocityArrow = new THREE.Mesh(velocityGeometry, velocityMaterial);
            velocityArrow.position.copy(body.position);
            velocityArrow.lookAt(body.position.clone().add(body.velocity));
            debugGroup.add(velocityArrow);
            
            // AABB box
            const boxGeometry = new THREE.BoxGeometry(4, 1.5, 2);
            const boxMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00, 
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.copy(body.position);
            debugGroup.add(box);
        }
        
        return debugGroup;
    }

    // Cleanup
    destroy() {
        this.bodies.clear();
        this.vehicles.clear();
    }
}
