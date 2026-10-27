import { Box, Cylinder, Legs } from './primitives';

export const Table = ({ color, dining = false }: { color: string; dining?: boolean }) => (
  <group>
    <Legs height={0.83} x={0.36} z={0.33} color={color} width={dining ? 0.06 : 0.085} />
    <Box size={[0.9, 0.14, 0.73]} position={[0, 0.73, 0]} color={color} />
    <Box size={[1, 0.1, 1]} position={[0, 0.88, 0]} color={color} radius={0.065} roughness={0.6} />
    <Box size={[0.25, 0.025, 0.28]} position={[-0.16, 0.947, 0.04]} rotation={[0, -0.12, 0]} color="#ebe7dc" radius={0.003} />
    <Box size={[0.24, 0.014, 0.27]} position={[-0.16, 0.968, 0.04]} rotation={[0, -0.12, 0]} color="#a77a57" radius={0.002} />
    <Cylinder radius={0.065} topRadius={0.045} height={0.06} position={[0.19, 0.965, -0.05]} color="#ded3bd" />
  </group>
);

export const Shelf = ({ color }: { color: string }) => (
  <group>
    <Box size={[0.97, 0.94, 0.045]} position={[0, 0.52, -0.475]} color={color} radius={0.008} />
    {[-0.475, 0.475].map((x) => <Box key={x} size={[0.05, 1, 1]} position={[x, 0.5, 0]} color={color} radius={0.005} />)}
    {[0.04, 0.29, 0.55, 0.8, 0.98].map((y) => <Box key={y} size={[0.95, 0.035, 1]} position={[0, y, 0]} color={color} radius={0.004} />)}
    {[0, 1, 2].map((row) => <group key={row} position={[row % 2 === 0 ? -0.21 : 0.12, row * 0.255 + 0.135, -0.1]}>
      {['#6c7a6a', '#dbceb6', '#ae7355', '#e8dfcc', '#75756a'].map((bookColor, i) => <Box key={i} size={[0.048, 0.14 + (i % 3) * 0.018, 0.59]} position={[(i - 2) * 0.053, 0, 0]} color={bookColor} radius={0.002} />)}
    </group>)}
    <Cylinder radius={0.08} topRadius={0.045} height={0.13} position={[0.24, 0.88, 0]} color="#d7c4a4" />
    <Box size={[0.22, 0.12, 0.65]} position={[-0.2, 0.87, 0]} color="#a7ad99" radius={0.012} />
  </group>
);
