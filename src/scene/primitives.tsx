import { RoundedBox } from '@react-three/drei';
import type { EulerTuple } from 'three';

type Triple = [number, number, number];
interface BoxProps {
  size: Triple;
  position?: Triple;
  rotation?: EulerTuple;
  color: string;
  radius?: number;
  roughness?: number;
}

export const Box = ({ size, position, rotation, color, radius = 0.018, roughness = 0.85 }: BoxProps) => (
  <RoundedBox args={size} position={position} rotation={rotation} radius={Math.min(radius, ...size.map((n) => n / 3))} smoothness={2} bevelSegments={2} castShadow receiveShadow>
    <meshStandardMaterial color={color} roughness={roughness} />
  </RoundedBox>
);

export const Cylinder = ({ radius, height, position, color, topRadius = radius }: { radius: number; topRadius?: number; height: number; position: Triple; color: string }) => (
  <mesh position={position} castShadow receiveShadow>
    <cylinderGeometry args={[topRadius, radius, height, 24]} />
    <meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
);

export const Legs = ({ x = 0.38, z = 0.36, height = 0.2, color = '#76583d', width = 0.055 }: { x?: number; z?: number; height?: number; color?: string; width?: number }) => (
  <group>
    {[-x, x].flatMap((px) => [-z, z].map((pz) => <Box key={`${px}-${pz}`} size={[width, height, width]} position={[px, height / 2, pz]} color={color} radius={0.009} />))}
  </group>
);
