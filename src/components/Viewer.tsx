import { Canvas, useLoader } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import sampleData from "@/util/sampleData";
import { Color, TextureLoader, Vector3 } from "three";

const alt_scale_factor = 2;

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

export default function Viewer() {
    const positions = new Float32Array(sampleData.length * 3);

    var min_lat = sampleData[0].latitude;
    var max_lat = sampleData[0].latitude;
    var min_lon = sampleData[0].longitude;
    var max_lon = sampleData[0].longitude;
    var min_alt = sampleData[0].altitude;
    var max_alt = sampleData[0].altitude;

    for (let i = 0; i < sampleData.length; i++) {
        var item = sampleData[i];
        if (item.latitude > max_lat) max_lat = item.latitude;
        if (item.latitude < min_lat) min_lat = item.latitude;
        if (item.longitude > max_lon) max_lon = item.longitude;
        if (item.longitude < min_lon) min_lon = item.longitude;
        if (item.altitude > max_alt) max_alt = item.altitude;
        if (item.altitude < min_alt) min_alt = item.altitude;
    }

    var center_lat = (max_lat + min_lat) / 2;
    var center_lon = (max_lon + min_lon) / 2;

    for (let i = 0; i < sampleData.length; i++) {
        const i3 = i * 3;

        const x = (sampleData[i].latitude - center_lat) * 111139;
        const y = sampleData[i].altitude * alt_scale_factor;
        const z = (sampleData[i].longitude - center_lon) * 111139;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
    }

    // const texture = useLoader(TextureLoader, "debug.jpg");

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

                <CameraControls />
                <gridHelper args={[1000, 50, 0xdddddd, 0xeeeeee]} />

                {/* <mesh>
                    <boxGeometry args={[50, 50, 50]} />
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
                        }}
                    />
                </mesh> */}

                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={sampleData.length}
                            itemSize={3}
                            array={positions}
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
                                value: min_alt * alt_scale_factor,
                            },
                            max: {
                                value: max_alt * alt_scale_factor,
                            },
                        }}
                    />
                </points>
            </Canvas>
        </div>
    );
}
