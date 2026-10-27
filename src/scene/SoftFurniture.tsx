import { Box, Legs } from './primitives';

export const Sofa = ({ color, single = false }: { color: string; single?: boolean }) => {
  const seats = single ? 1 : 3;
  const innerWidth = 0.78;
  return (
    <group>
      <Legs height={0.13} x={0.4} z={0.35} color="#70533e" />
      <Box size={[0.98, 0.25, 0.94]} position={[0, 0.28, 0]} color={color} radius={0.045} />
      <Box size={[0.96, 0.66, 0.19]} position={[0, 0.65, -0.39]} color={color} radius={0.05} />
      {[-1, 1].map((side) => <Box key={side} size={[0.11, 0.52, 0.96]} position={[side * 0.445, 0.48, 0]} color={color} radius={0.035} />)}
      {Array.from({ length: seats }, (_, i) => {
        const x = -innerWidth / 2 + (i + 0.5) * innerWidth / seats;
        return <group key={i}>
          <Box size={[innerWidth / seats - 0.012, 0.18, 0.71]} position={[x, 0.48, 0.055]} color={color} radius={0.04} />
          <Box size={[innerWidth / seats - 0.02, 0.42, 0.15]} position={[x, 0.76, -0.25]} rotation={[-0.12, 0, 0]} color={color} radius={0.045} />
        </group>;
      })}
      <Box size={[single ? 0.32 : 0.14, 0.31, 0.15]} position={[-0.25, 0.69, -0.1]} rotation={[0.1, 0.12, -0.13]} color="#e3dac9" radius={0.06} />
      {!single && <Box size={[0.15, 0.28, 0.17]} position={[0.27, 0.67, -0.08]} rotation={[0.1, -0.14, 0.16]} color="#bd7a56" radius={0.045} />}
    </group>
  );
};

export const Bed = ({ color }: { color: string }) => (
  <group>
    <Legs height={0.15} x={0.42} z={0.4} />
    <Box size={[1, 0.22, 1]} position={[0, 0.25, 0]} color="#b88f65" radius={0.025} />
    <Box size={[0.98, 0.75, 0.055]} position={[0, 0.625, -0.47]} color="#b88f65" radius={0.02} />
    <Box size={[0.94, 0.3, 0.92]} position={[0, 0.49, 0.015]} color="#f2ede3" radius={0.06} />
    <Box size={[0.95, 0.08, 0.57]} position={[0, 0.66, 0.19]} color={color} radius={0.03} />
    <Box size={[0.96, 0.12, 0.19]} position={[0, 0.64, 0.35]} color="#8a957e" radius={0.02} />
    {[-0.24, 0.24].map((x) => <Box key={x} size={[0.4, 0.17, 0.22]} position={[x, 0.72, -0.27]} rotation={[-0.13, 0, 0]} color="#eae1d0" radius={0.06} />)}
  </group>
);
