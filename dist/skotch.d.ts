/**
 * Skotch - 3D Graphics Library
 *
 * Copyright (C) 2025 - Navid M.
 */
/**
 * Some 3D vector.
 */
export declare class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    add(v: Vec3): Vec3;
    subtract(v: Vec3): Vec3;
    multiply(scalar: number): Vec3;
    normalize(): Vec3;
    cross(v: Vec3): Vec3;
    static zero(): Vec3;
    static up(): Vec3;
}
export declare class Mat4 {
    data: Float32Array;
    constructor(data?: number[]);
    private static identityData;
    static identity(): Mat4;
    static perspective(fov: number, aspect: number, near: number, far: number): Mat4;
    static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4;
    static translation(x: number, y: number, z: number): Mat4;
    static rotationX(angle: number): Mat4;
    static rotationY(angle: number): Mat4;
    static rotationZ(angle: number): Mat4;
    static scaling(x: number, y: number, z: number): Mat4;
    multiply(other: Mat4): Mat4;
}
export interface Geometry {
    vertices: number[];
    indices: number[];
    normals: number[];
    colors: number[];
}
export declare class GeometryBuilder {
    static cube(size?: number, color?: number[]): Geometry;
    static sphere(radius?: number, segments?: number, color?: number[]): Geometry;
    static pyramid(size?: number, color?: number[]): Geometry;
    static torus(majorRadius?: number, minorRadius?: number, segments?: number, color?: number[]): Geometry;
}
export declare class Transform {
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
    getMatrix(): Mat4;
}
export declare class Mesh {
    geometry: Geometry;
    transform: Transform;
    private buffers?;
    constructor(geometry: Geometry);
    initBuffers(gl: WebGLRenderingContext): void;
    getBuffers(): {
        vertex: WebGLBuffer;
        index: WebGLBuffer;
        normal: WebGLBuffer;
        color: WebGLBuffer;
    };
}
export declare class Camera {
    position: Vec3;
    target: Vec3;
    up: Vec3;
    fov: number;
    aspect: number;
    near: number;
    far: number;
    getViewMatrix(): Mat4;
    getProjectionMatrix(): Mat4;
}
export declare class Renderer {
    private gl;
    private program?;
    private locations?;
    constructor(canvas: HTMLCanvasElement);
    private initShaders;
    private compileShader;
    private setupGL;
    clear(): void;
    render(mesh: Mesh, camera: Camera): void;
}
export declare class Scene {
    private renderer;
    private camera;
    private meshes;
    private animationCallbacks;
    private isAnimating;
    private lastTime;
    constructor(canvas: HTMLCanvasElement);
    add(mesh: Mesh): Mesh;
    remove(mesh: Mesh): void;
    setCamera(camera: Camera): void;
    getCamera(): Camera;
    onAnimate(callback: (time: number) => void): void;
    render(): void;
    startAnimation(): void;
    stopAnimation(): void;
    private animate;
}
export declare class Skotch {
    static createScene(canvasId: string): Scene;
    static createCube(size?: number, color?: number[]): Mesh;
    static createSphere(radius?: number, segments?: number, color?: number[]): Mesh;
    static createPyramid(size?: number, color?: number[]): Mesh;
    static createTorus(majorRadius?: number, minorRadius?: number, segments?: number, color?: number[]): Mesh;
    static Vec3: typeof Vec3;
    static Camera: typeof Camera;
}
export default Skotch;
