import { Cylinder } from './primitives';

export const Plant = ({ color }: { color: string }) => (
  <group>
    <Cylinder radius={0.21} topRadius={0.28} height={0.25} position={[0, 0.125, 0]} color="#c7b49a" />
    <Cylinder radius={0.26} height={0.015} position={[0, 0.253, 0]} color="#665541" />
    <Cylinder radius={0.026} topRadius={0.017} height={0.55} position={[0, 0.52, 0]} color="#80633f" />
    {Array.from({ length: 16 }, (_, index) => {
      const angle = index * 2.4;
      const spread = index < 10 ? 0.23 : 0.16;
      const y = 0.43 + index * 0.025;
      return <mesh key={index} position={[Math.sin(angle) * spread, y, Math.cos(angle) * spread]} rotation={[Math.cos(angle) * 0.5, angle, Math.sin(angle) * 0.4]} scale={[0.15, 0.13, 0.26]} castShadow>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>;
    })}
  </group>
);
