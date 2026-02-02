/**
 * Skotch - 3D Graphics Library
 *
 * Copyright (C) 2025 - Navid M.
 */

/**
 * Some 3D vector.
 */
export class Vec3 {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}

    add(v: Vec3): Vec3 {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v: Vec3): Vec3 {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(scalar: number): Vec3 {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    normalize(): Vec3 {
        const len = Math.sqrt(
            this.x * this.x + this.y * this.y + this.z * this.z,
        );
        return len > 0
            ? new Vec3(this.x / len, this.y / len, this.z / len)
            : new Vec3();
    }

    cross(v: Vec3): Vec3 {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x,
        );
    }

    static zero(): Vec3 {
        return new Vec3(0, 0, 0);
    }

    static up(): Vec3 {
        return new Vec3(0, 1, 0);
    }
}

export class Mat4 {
    data: Float32Array;

    constructor(data?: number[]) {
        this.data = new Float32Array(data || Mat4.identityData());
    }

    private static identityData(): number[] {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    static identity(): Mat4 {
        return new Mat4();
    }

    static perspective(
        fov: number,
        aspect: number,
        near: number,
        far: number,
    ): Mat4 {
        const f = 1.0 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);

        return new Mat4([
            f / aspect,
            0,
            0,
            0,
            0,
            f,
            0,
            0,
            0,
            0,
            (near + far) * rangeInv,
            -1,
            0,
            0,
            near * far * rangeInv * 2,
            0,
        ]);
    }

    static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
        const z = eye.subtract(target).normalize();
        const x = up.cross(z).normalize();
        const y = z.cross(x).normalize();

        return new Mat4([
            x.x,
            y.x,
            z.x,
            0,
            x.y,
            y.y,
            z.y,
            0,
            x.z,
            y.z,
            z.z,
            0,
            -x.x * eye.x - x.y * eye.y - x.z * eye.z,
            -y.x * eye.x - y.y * eye.y - y.z * eye.z,
            -z.x * eye.x - z.y * eye.y - z.z * eye.z,
            1,
        ]);
    }

    static translation(x: number, y: number, z: number): Mat4 {
        return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
    }

    static rotationX(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Mat4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    }

    static rotationY(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Mat4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
    }

    static rotationZ(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Mat4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    static scaling(x: number, y: number, z: number): Mat4 {
        return new Mat4([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
    }

    multiply(other: Mat4): Mat4 {
        const result = new Float32Array(16);
        const a = this.data;
        const b = other.data;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (a && b) {
                    result[i * 4 + j] =
                        a[i * 4 + 0]! * b[0 * 4 + j]! +
                        a[i * 4 + 1]! * b[1 * 4 + j]! +
                        a[i * 4 + 2]! * b[2 * 4 + j]! +
                        a[i * 4 + 3]! * b[3 * 4 + j]!;
                }
            }
        }

        return new Mat4(Array.from(result));
    }
}

export interface Geometry {
    vertices: number[];
    indices: number[];
    normals: number[];
    colors: number[];
}

export class GeometryBuilder {
    static cube(
        size: number = 1,
        color: number[] = [1, 0.5, 0.2, 1],
    ): Geometry {
        const s = size / 2;

        const vertices = [
            -s,
            -s,
            s,
            s,
            -s,
            s,
            s,
            s,
            s,
            -s,
            s,
            s,
            // Back face
            -s,
            -s,
            -s,
            -s,
            s,
            -s,
            s,
            s,
            -s,
            s,
            -s,
            -s,
            // Top face
            -s,
            s,
            -s,
            -s,
            s,
            s,
            s,
            s,
            s,
            s,
            s,
            -s,
            // Bottom face
            -s,
            -s,
            -s,
            s,
            -s,
            -s,
            s,
            -s,
            s,
            -s,
            -s,
            s,
            // Right face
            s,
            -s,
            -s,
            s,
            s,
            -s,
            s,
            s,
            s,
            s,
            -s,
            s,
            // Left face
            -s,
            -s,
            -s,
            -s,
            -s,
            s,
            -s,
            s,
            s,
            -s,
            s,
            -s,
        ];

        const indices = [
            0,
            1,
            2,
            0,
            2,
            3, // front
            4,
            5,
            6,
            4,
            6,
            7, // back
            8,
            9,
            10,
            8,
            10,
            11, // top
            12,
            13,
            14,
            12,
            14,
            15, // bottom
            16,
            17,
            18,
            16,
            18,
            19, // right
            20,
            21,
            22,
            20,
            22,
            23, // left
        ];

        const normals = [
            0,
            0,
            1,
            0,
            0,
            1,
            0,
            0,
            1,
            0,
            0,
            1, // front
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1, // back
            0,
            1,
            0,
            0,
            1,
            0,
            0,
            1,
            0,
            0,
            1,
            0, // top
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0, // bottom
            1,
            0,
            0,
            1,
            0,
            0,
            1,
            0,
            0,
            1,
            0,
            0, // right
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0, // left
        ];

        const colors = [];
        for (let i = 0; i < 24; i++) {
            colors.push(...color);
        }

        return { vertices, indices, normals, colors };
    }

    static sphere(
        radius: number = 1,
        segments: number = 32,
        color: number[] = [0.2, 0.5, 1, 1],
    ): Geometry {
        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];
        const colors: number[] = [];

        for (let lat = 0; lat <= segments; lat++) {
            const theta = (lat * Math.PI) / segments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let lon = 0; lon <= segments; lon++) {
                const phi = (lon * 2 * Math.PI) / segments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                vertices.push(radius * x, radius * y, radius * z);
                normals.push(x, y, z);
                colors.push(...color);
            }
        }

        for (let lat = 0; lat < segments; lat++) {
            for (let lon = 0; lon < segments; lon++) {
                const first = lat * (segments + 1) + lon;
                const second = first + segments + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { vertices, indices, normals, colors };
    }

    static pyramid(
        size: number = 1,
        color: number[] = [1, 0.8, 0.2, 1],
    ): Geometry {
        const s = size / 2;

        const vertices = [
            -s,
            0,
            -s,
            s,
            0,
            -s,
            s,
            0,
            s,
            -s,
            0,
            s,
            0,
            size,
            0,
            0,
            size,
            0,
            0,
            size,
            0,
            0,
            size,
            0,
        ];

        const indices = [
            0,
            1,
            2,
            0,
            2,
            3, // base
            0,
            1,
            4, // front
            1,
            2,
            5, // right
            2,
            3,
            6, // back
            3,
            0,
            7, // left
        ];

        const normals: number[] = [];
        for (let i = 0; i < vertices.length / 3; i++) {
            normals.push(0, 1, 0);
        }

        const colors: number[] = [];
        for (let i = 0; i < vertices.length / 3; i++) {
            colors.push(...color);
        }

        return { vertices, indices, normals, colors };
    }

    static torus(
        majorRadius: number = 1,
        minorRadius: number = 0.3,
        segments: number = 32,
        color: number[] = [0.8, 0.2, 0.8, 1],
    ): Geometry {
        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];
        const colors: number[] = [];

        for (let i = 0; i <= segments; i++) {
            const u = (i * 2 * Math.PI) / segments;
            for (let j = 0; j <= segments; j++) {
                const v = (j * 2 * Math.PI) / segments;

                const x =
                    (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
                const y = minorRadius * Math.sin(v);
                const z =
                    (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);

                vertices.push(x, y, z);

                const nx = Math.cos(v) * Math.cos(u);
                const ny = Math.sin(v);
                const nz = Math.cos(v) * Math.sin(u);
                normals.push(nx, ny, nz);

                colors.push(...color);
            }
        }

        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const a = i * (segments + 1) + j;
                const b = a + segments + 1;

                indices.push(a, b, a + 1);
                indices.push(b, b + 1, a + 1);
            }
        }

        return { vertices, indices, normals, colors };
    }
}

export class Transform {
    position: Vec3 = new Vec3(0, 0, 0);
    rotation: Vec3 = new Vec3(0, 0, 0);
    scale: Vec3 = new Vec3(1, 1, 1);

    getMatrix(): Mat4 {
        const translation = Mat4.translation(
            this.position.x,
            this.position.y,
            this.position.z,
        );
        const rotationX = Mat4.rotationX(this.rotation.x);
        const rotationY = Mat4.rotationY(this.rotation.y);
        const rotationZ = Mat4.rotationZ(this.rotation.z);
        const scaling = Mat4.scaling(this.scale.x, this.scale.y, this.scale.z);

        return translation
            .multiply(rotationY)
            .multiply(rotationX)
            .multiply(rotationZ)
            .multiply(scaling);
    }
}

export class Mesh {
    geometry: Geometry;
    transform: Transform = new Transform();
    userData: any = {};
    private buffers?: {
        vertex: WebGLBuffer;
        index: WebGLBuffer;
        normal: WebGLBuffer;
        color: WebGLBuffer;
    };

    constructor(geometry: Geometry) {
        this.geometry = geometry;
    }

    initBuffers(gl: WebGLRenderingContext) {
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.geometry.vertices),
            gl.STATIC_DRAW,
        );

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.geometry.indices),
            gl.STATIC_DRAW,
        );

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.geometry.normals),
            gl.STATIC_DRAW,
        );

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.geometry.colors),
            gl.STATIC_DRAW,
        );

        this.buffers = {
            vertex: vertexBuffer!,
            index: indexBuffer!,
            normal: normalBuffer!,
            color: colorBuffer!,
        };
    }

    getBuffers() {
        return this.buffers;
    }
}

export class Camera {
    position: Vec3 = new Vec3(0, 0, 5);
    target: Vec3 = new Vec3(0, 0, 0);
    up: Vec3 = Vec3.up();
    fov: number = Math.PI / 4;
    aspect: number = 1;
    near: number = 0.1;
    far: number = 100;

    getViewMatrix(): Mat4 {
        return Mat4.lookAt(this.position, this.target, this.up);
    }

    getProjectionMatrix(): Mat4 {
        return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
    }
}

export class Renderer {
    private gl: WebGLRenderingContext;
    private program?: WebGLProgram;
    private locations?: {
        position: number;
        normal: number;
        color: number;
        modelMatrix: WebGLUniformLocation;
        viewMatrix: WebGLUniformLocation;
        projectionMatrix: WebGLUniformLocation;
        lightDirection: WebGLUniformLocation;
    };

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl");
        if (!gl) {
            throw new Error("WebGL not supported");
        }
        this.gl = gl;
        this.initShaders();
        this.setupGL();
    }

    private initShaders() {
        const vertexShaderSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec4 aColor;

      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform vec3 uLightDirection;

      varying vec4 vColor;
      varying float vLighting;

      void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        
        vec3 normal = normalize((uModelMatrix * vec4(aNormal, 0.0)).xyz);
        float lighting = max(dot(normal, normalize(uLightDirection)), 0.3);
        
        vColor = aColor;
        vLighting = lighting;
      }
    `;

        const fragmentShaderSource = `
      precision mediump float;
      
      varying vec4 vColor;
      varying float vLighting;

      void main() {
        gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
      }
    `;

        const vertexShader = this.compileShader(
            vertexShaderSource,
            this.gl.VERTEX_SHADER,
        );
        const fragmentShader = this.compileShader(
            fragmentShaderSource,
            this.gl.FRAGMENT_SHADER,
        );

        const program = this.gl.createProgram()!;
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error(
                "Program linking failed: " + this.gl.getProgramInfoLog(program),
            );
        }

        this.program = program;
        this.gl.useProgram(program);

        this.locations = {
            position: this.gl.getAttribLocation(program, "aPosition"),
            normal: this.gl.getAttribLocation(program, "aNormal"),
            color: this.gl.getAttribLocation(program, "aColor"),
            modelMatrix: this.gl.getUniformLocation(program, "uModelMatrix")!,
            viewMatrix: this.gl.getUniformLocation(program, "uViewMatrix")!,
            projectionMatrix: this.gl.getUniformLocation(
                program,
                "uProjectionMatrix",
            )!,
            lightDirection: this.gl.getUniformLocation(
                program,
                "uLightDirection",
            )!,
        };
    }

    private compileShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(
                "Shader compilation failed: " +
                    this.gl.getShaderInfoLog(shader),
            );
        }

        return shader;
    }

    private setupGL() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    render(mesh: Mesh, camera: Camera) {
        if (!this.program || !this.locations) return;

        const buffers = mesh.getBuffers();
        if (!buffers) {
            mesh.initBuffers(this.gl);
        }

        const b = mesh.getBuffers()!;

        this.gl.uniformMatrix4fv(
            this.locations.modelMatrix,
            false,
            mesh.transform.getMatrix().data,
        );
        this.gl.uniformMatrix4fv(
            this.locations.viewMatrix,
            false,
            camera.getViewMatrix().data,
        );
        this.gl.uniformMatrix4fv(
            this.locations.projectionMatrix,
            false,
            camera.getProjectionMatrix().data,
        );

        this.gl.uniform3f(this.locations.lightDirection, 0.5, 0.7, 1.0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.vertex);
        this.gl.enableVertexAttribArray(this.locations.position);
        this.gl.vertexAttribPointer(
            this.locations.position,
            3,
            this.gl.FLOAT,
            false,
            0,
            0,
        );

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.normal);
        this.gl.enableVertexAttribArray(this.locations.normal);
        this.gl.vertexAttribPointer(
            this.locations.normal,
            3,
            this.gl.FLOAT,
            false,
            0,
            0,
        );

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, b.color);
        this.gl.enableVertexAttribArray(this.locations.color);
        this.gl.vertexAttribPointer(
            this.locations.color,
            4,
            this.gl.FLOAT,
            false,
            0,
            0,
        );

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, b.index);
        this.gl.drawElements(
            this.gl.TRIANGLES,
            mesh.geometry.indices.length,
            this.gl.UNSIGNED_SHORT,
            0,
        );
    }
}

export class Scene {
    private renderer: Renderer;
    private camera: Camera;
    private meshes: Mesh[] = [];
    private animationCallbacks: ((time: number) => void)[] = [];
    private isAnimating: boolean = false;
    private lastTime: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this.camera = new Camera();
        this.camera.aspect = canvas.width / canvas.height;
    }

    add(mesh: Mesh): Mesh {
        this.meshes.push(mesh);
        return mesh;
    }

    remove(mesh: Mesh) {
        const index = this.meshes.indexOf(mesh);
        if (index > -1) {
            this.meshes.splice(index, 1);
        }
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    getCamera(): Camera {
        return this.camera;
    }

    onAnimate(callback: (time: number) => void) {
        this.animationCallbacks.push(callback);
    }

    render() {
        this.renderer.clear();
        for (const mesh of this.meshes) {
            this.renderer.render(mesh, this.camera);
        }
    }

    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.lastTime = performance.now();
        this.animate();
    }

    stopAnimation() {
        this.isAnimating = false;
    }

    private animate = () => {
        if (!this.isAnimating) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        for (const callback of this.animationCallbacks) {
            callback(deltaTime);
        }

        this.render();
        requestAnimationFrame(this.animate);
    };
}

export class Skotch {
    static createScene(canvasId: string): Scene {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        return new Scene(canvas);
    }

    static createCube(size?: number, color?: number[]): Mesh {
        return new Mesh(GeometryBuilder.cube(size, color));
    }

    static createSphere(
        radius?: number,
        segments?: number,
        color?: number[],
    ): Mesh {
        return new Mesh(GeometryBuilder.sphere(radius, segments, color));
    }

    static createPyramid(size?: number, color?: number[]): Mesh {
        return new Mesh(GeometryBuilder.pyramid(size, color));
    }

    static createTorus(
        majorRadius?: number,
        minorRadius?: number,
        segments?: number,
        color?: number[],
    ): Mesh {
        return new Mesh(
            GeometryBuilder.torus(majorRadius, minorRadius, segments, color),
        );
    }

    static Vec3 = Vec3;
    static Camera = Camera;
}

export default Skotch;
