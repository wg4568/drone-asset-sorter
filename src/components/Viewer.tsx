import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import sampleData from "@/util/sampleData";

export default function Viewer() {
    const positions = new Float32Array(sampleData.length * 3);

    var min_lat = sampleData[0].latitude;
    var max_lat = sampleData[0].latitude;
    var min_lon = sampleData[0].longitude;
    var max_lon = sampleData[0].longitude;

    for (let i = 0; i < sampleData.length; i++) {
        var item = sampleData[i];
        if (item.latitude > max_lat) max_lat = item.latitude;
        if (item.latitude < min_lat) min_lat = item.latitude;
        if (item.longitude > max_lon) max_lon = item.longitude;
        if (item.longitude < min_lon) min_lon = item.longitude;
    }

    var center_lat = (max_lat + min_lat) / 2;
    var center_lon = (max_lon + min_lon) / 2;

    for (let i = 0; i < sampleData.length; i++) {
        const i3 = i * 3;

        const x = (sampleData[i].latitude - center_lat) * 111139;
        const y = sampleData[i].altitude * 2;
        const z = (sampleData[i].longitude - center_lon) * 111139;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
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

                <CameraControls />
                <gridHelper args={[1000, 50, 0xdddddd, 0xeeeeee]} />

                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={sampleData.length}
                            itemSize={3}
                            array={positions}
                        />
                    </bufferGeometry>
                    <pointsMaterial size={2} color="red" transparent />
                </points>
            </Canvas>
        </div>
    );
}
