import { Canvas, ThreeEvent, useLoader } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import sampleData from "@/util/sampleData";
import { Color, Vector3 } from "three";

const vertexShader = `
uniform float min;
uniform float max;

varying vec2 vUv;

void main() {
    vUv.y = (position.y - min) / (max - min);

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_PointSize = 5.0 * ( 300.0 / -mvPosition.z );
  
    gl_Position = projectionMatrix * mvPosition;}
`;

const fragmentShader = `
uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;

void main() {
    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
}
`;

type Transform = {
    offset: Vector3;
    scale: Vector3;
};

type Bounds = {
    min: Vector3;
    max: Vector3;
};

function calculateBounds(points: Vector3[]) {
    const x_values = points.map((p) => p.x);
    const y_values = points.map((p) => p.y);
    const z_values = points.map((p) => p.z);

    return {
        min: new Vector3(
            Math.min(...x_values),
            Math.min(...y_values),
            Math.min(...z_values)
        ),
        max: new Vector3(
            Math.max(...x_values),
            Math.max(...y_values),
            Math.max(...z_values)
        ),
    } as Bounds;
}

function applyTransform(point: Vector3, transform: Transform) {
    return new Vector3(
        (point.x + transform.offset.x) * transform.scale.x,
        (point.y + transform.offset.y) * transform.scale.y,
        (point.z + transform.offset.z) * transform.scale.z
    );
}

function createGPSTransform(bounds: Bounds) {
    const scale = new Vector3(111139, 2, 111139);
    const offset = new Vector3(
        (bounds.max.x + bounds.min.x) / -2,
        0,
        (bounds.max.z + bounds.min.z) / -2
    );

    return { scale, offset } as Transform;
}

export default function Viewer() {
    const meshData = new Float32Array(sampleData.length * 3);
    const imagePositions = sampleData.map(
        (d) => new Vector3(d.latitude, d.altitude, d.longitude)
    );
    const bounds = calculateBounds(imagePositions);
    const transform = createGPSTransform(bounds);
    console.log(bounds, transform);

    for (let i = 0; i < imagePositions.length; i++) {
        const i3 = i * 3;
        const point = applyTransform(imagePositions[i], transform);

        console.log(point);

        meshData[i3] = point.x;
        meshData[i3 + 1] = point.y;
        meshData[i3 + 2] = point.z;
    }

    return (
        <div className="w-full h-screen">
            <Canvas
                camera={{
                    position: [-6, 7, 7],
                    near: 0.1,
                    far: 10000,
                }}
            >
                <ambientLight color={"white"} intensity={0.5} />
                <gridHelper args={[1000, 50, 0xdddddd, 0xeeeeee]} />

                <CameraControls />

                <points
                    onClick={(e: ThreeEvent<MouseEvent>) => {
                        console.log(e.point);
                    }}
                >
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={sampleData.length}
                            itemSize={3}
                            array={meshData}
                        />
                    </bufferGeometry>
                    <shaderMaterial
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        uniforms={{
                            color1: {
                                value: new Color(0xff0000),
                            },
                            color2: {
                                value: new Color(0x0000ff),
                            },
                            min: {
                                value: applyTransform(bounds.min, transform).y,
                            },
                            max: {
                                value: applyTransform(bounds.max, transform).y,
                            },
                        }}
                    />
                </points>
            </Canvas>
        </div>
    );
}
