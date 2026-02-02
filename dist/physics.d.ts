type VecLike = {
    x: number;
    y: number;
    z: number;
};
export declare class SphereCollider {
    radius: number;
    offset: VecLike;
    constructor(radius: number, offset?: VecLike);
}
export declare class SimplePhysicsBody {
    velocity: VecLike;
    mass: number;
    private accumulatedForce;
    constructor(mass?: number);
    applyForce(force: VecLike): void;
    integrate(position: VecLike, dt: number): void;
}
/**
 * Attach a physics body and optional collider to a mesh.
 * The mesh is expected to have a `transform` with a `position` with `{x,y,z}`.
 */
export declare function attachPhysics(mesh: any, body: SimplePhysicsBody, collider?: SphereCollider): void;
/**
 * Step simple physics for meshes that have `.userData.physics` attached.
 * - Integrates bodies
 * - Performs simple sphere-sphere collision detection & position/velocity resolution
 */
export declare function stepPhysics(meshes: any[], dt: number): void;
declare const _default: {
    SphereCollider: typeof SphereCollider;
    SimplePhysicsBody: typeof SimplePhysicsBody;
    attachPhysics: typeof attachPhysics;
    stepPhysics: typeof stepPhysics;
};
export default _default;
