type VecLike = { x: number; y: number; z: number };

function add(a: VecLike, b: VecLike): VecLike {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function sub(a: VecLike, b: VecLike): VecLike {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function mulScalar(a: VecLike, s: number): VecLike {
    return { x: a.x * s, y: a.y * s, z: a.z * s };
}

function length(v: VecLike): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export class SphereCollider {
    constructor(
        public radius: number,
        public offset: VecLike = { x: 0, y: 0, z: 0 },
    ) {}
}

export class SimplePhysicsBody {
    velocity: VecLike = { x: 0, y: 0, z: 0 };
    mass: number;
    private accumulatedForce: VecLike = { x: 0, y: 0, z: 0 };

    constructor(mass: number = 1) {
        this.mass = mass;
    }

    applyForce(force: VecLike) {
        this.accumulatedForce = add(this.accumulatedForce, force);
    }

    integrate(position: VecLike, dt: number) {
        if (dt <= 0) return;
        const ax = this.accumulatedForce.x / this.mass;
        const ay = this.accumulatedForce.y / this.mass;
        const az = this.accumulatedForce.z / this.mass;

        this.velocity.x += ax * dt;
        this.velocity.y += ay * dt;
        this.velocity.z += az * dt;

        position.x += this.velocity.x * dt;
        position.y += this.velocity.y * dt;
        position.z += this.velocity.z * dt;

        this.accumulatedForce = { x: 0, y: 0, z: 0 };
    }
}

/**
 * Attach a physics body and optional collider to a mesh.
 * The mesh is expected to have a `transform` with a `position` with `{x,y,z}`.
 */
export function attachPhysics(
    mesh: any,
    body: SimplePhysicsBody,
    collider?: SphereCollider,
) {
    mesh.userData = mesh.userData || {};
    mesh.userData.physics = { body, collider };
}

/**
 * Step simple physics for meshes that have `.userData.physics` attached.
 *
 * - Integrates bodies
 * - Performs simple sphere-sphere collision detection & position/velocity resolution
 */
export function stepPhysics(meshes: any[], dt: number) {
    for (const m of meshes) {
        const p = m?.userData?.physics;
        if (!p || !p.body) continue;
        p.body.integrate(m.transform.position, dt);
    }

    const restitution = 0.5;
    for (let i = 0; i < meshes.length; i++) {
        const A = meshes[i];
        const pa = A?.userData?.physics;
        if (!pa || !pa.collider) continue;

        for (let j = i + 1; j < meshes.length; j++) {
            const B = meshes[j];
            const pb = B?.userData?.physics;
            if (!pb || !pb.collider) continue;

            const worldA = add(A.transform.position, pa.collider.offset);
            const worldB = add(B.transform.position, pb.collider.offset);

            const delta = sub(worldB, worldA);
            const dist = length(delta);
            const minDist = pa.collider.radius + pb.collider.radius;
            if (dist === 0) {
                delta.x = 0.001;
                delta.y = 0.001;
                delta.z = 0.001;
            }

            if (dist < minDist) {
                const penetration = minDist - dist;
                const normal = mulScalar(delta, 1 / (dist || 1));
                const correction = mulScalar(normal, penetration * 0.5);

                A.transform.position = add(
                    A.transform.position,
                    mulScalar(correction, -1),
                );
                B.transform.position = add(B.transform.position, correction);

                if (pa.body && pb.body) {
                    const va = pa.body.velocity;
                    const vb = pb.body.velocity;
                    const rel = sub(vb, va);
                    const relAlongNormal =
                        rel.x * normal.x + rel.y * normal.y + rel.z * normal.z;
                    if (relAlongNormal > 0) continue;

                    const invMassA = pa.body.mass > 0 ? 1 / pa.body.mass : 0;
                    const invMassB = pb.body.mass > 0 ? 1 / pb.body.mass : 0;
                    const j =
                        (-(1 + restitution) * relAlongNormal) /
                        (invMassA + invMassB);

                    const impulse = mulScalar(normal, j);
                    pa.body.velocity = sub(
                        pa.body.velocity,
                        mulScalar(impulse, invMassA),
                    );
                    pb.body.velocity = add(
                        pb.body.velocity,
                        mulScalar(impulse, invMassB),
                    );
                }
            }
        }
    }
}

export default {
    SphereCollider,
    SimplePhysicsBody,
    attachPhysics,
    stepPhysics,
};
