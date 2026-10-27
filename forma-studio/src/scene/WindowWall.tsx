import { DoubleSide } from 'three';
import { Box } from './primitives';

export const WindowWall = ({
  length,
  height,
  color,
  count = 2,
}: {
  length: number;
  height: number;
  color: string;
  count?: number;
}) => {
  const windowWidth = Math.min(1.65, length * (count === 2 ? 0.21 : 0.35));
  const bottom = Math.min(0.85, height * 0.3);
  const top = height - 0.32;
  const positions = count === 2 ? [-length / 4, length / 4] : [0];
  const boundaries = [
    -length / 2,
    ...positions.flatMap((x) => [x - windowWidth / 2, x + windowWidth / 2]),
    length / 2,
  ];
  return (
    <group>
      <Box
        size={[length + 0.18, bottom, 0.18]}
        position={[0, bottom / 2, 0]}
        color={color}
        radius={0.008}
      />
      <Box
        size={[length + 0.18, height - top, 0.18]}
        position={[0, (height + top) / 2, 0]}
        color={color}
        radius={0.008}
      />
      {boundaries
        .filter((_, index) => index % 2 === 0)
        .map((start, index) => {
          const end = boundaries[index * 2 + 1];
          return (
            <Box
              key={index}
              size={[end - start, top - bottom, 0.18]}
              position={[(start + end) / 2, (top + bottom) / 2, 0]}
              color={color}
              radius={0.008}
            />
          );
        })}
      {positions.map((x) => (
        <group key={x} position={[x, (top + bottom) / 2, 0]}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <Box
                size={[0.055, top - bottom, 0.23]}
                position={[(side * windowWidth) / 2, 0, 0]}
                color="#f1eee5"
                radius={0.004}
              />
              <Box
                size={[windowWidth, 0.055, 0.23]}
                position={[0, (side * (top - bottom)) / 2, 0]}
                color="#f1eee5"
                radius={0.004}
              />
            </group>
          ))}
          <Box size={[0.038, top - bottom, 0.1]} color="#e7e4db" radius={0.003} />
          <Box
            size={[windowWidth, 0.038, 0.1]}
            position={[0, (top - bottom) * 0.15, 0]}
            color="#e7e4db"
            radius={0.003}
          />
          <Box
            size={[windowWidth + 0.12, 0.055, 0.32]}
            position={[0, -(top - bottom) / 2, 0.03]}
            color="#f3f0e6"
            radius={0.008}
          />
          <mesh>
            <planeGeometry args={[windowWidth - 0.06, top - bottom - 0.06]} />
            <meshStandardMaterial
              color="#bed4d1"
              transparent
              opacity={0.15}
              roughness={0.1}
              metalness={0.2}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      <Box
        size={[length, 0.09, 0.04]}
        position={[0, 0.045, 0.115]}
        color="#f3f0e7"
        radius={0.002}
      />
    </group>
  );
};
