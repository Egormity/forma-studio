import { useMemo } from 'react';
import { ExtrudeGeometry, Shape } from 'three';
import type { Room, ViewSettings } from '../domain/types';
import { WALL_FINISHES } from '../domain/catalog';
import { Box } from './primitives';
import { Floor } from './Floor';
import { WindowWall } from './WindowWall';

const Roof = ({ room, color }: { room: Room; color: string }) => {
  const rise = room.width * 0.19;
  const roofLength = Math.hypot(room.width / 2 + 0.25, rise);
  const angle = Math.atan2(rise, room.width / 2 + 0.25);
  const gable = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-room.width / 2, 0);
    shape.lineTo(0, rise);
    shape.lineTo(room.width / 2, 0);
    shape.closePath();
    return new ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: false });
  }, [room.width, rise]);
  return (
    <group position={[0, room.height, 0]}>
      {[-1, 1].map((side) => (
        <Box
          key={side}
          size={[roofLength, 0.1, room.depth + 0.5]}
          position={[(side * (room.width / 2 + 0.25)) / 2, rise / 2, 0]}
          rotation={[0, 0, -side * angle]}
          color="#5c625b"
          radius={0.008}
        />
      ))}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, 0, (side * room.depth) / 2 - 0.08]}
          geometry={gable}
          castShadow
        >
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
};

export const House = ({ room, view }: { room: Room; view: ViewSettings }) => {
  const { width, depth, height } = room;
  const wall = WALL_FINISHES.find((finish) => finish.id === room.wallFinish)?.color ?? '#e8e3d8';
  return (
    <group>
      <Box
        size={[width + 1.65, 0.14, depth + 1.65]}
        position={[0, -0.35, 0]}
        color="#afb79e"
        radius={0.16}
      />
      <Box
        size={[width + 0.42, 0.27, depth + 0.42]}
        position={[0, -0.16, 0]}
        color="#eeeade"
        radius={0.06}
      />
      <Box size={[width, 0.025, depth]} position={[0, -0.022, 0]} color="#a58b6c" radius={0} />
      <Floor room={room} />
      <group position={[0, 0, -depth / 2]}>
        <WindowWall length={width} height={height} color={wall} />
      </group>
      <group position={[-width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <WindowWall length={depth} height={height} color={wall} count={1} />
      </group>
      {!view.cutaway && (
        <>
          <group position={[width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <WindowWall length={depth} height={height} color={wall} count={1} />
          </group>
          <Box
            size={[width * 0.45, height, 0.18]}
            position={[-width * 0.275, height / 2, depth / 2]}
            color={wall}
            radius={0.008}
          />
          <Box
            size={[width * 0.4, height, 0.18]}
            position={[width * 0.3, height / 2, depth / 2]}
            color={wall}
            radius={0.008}
          />
          <Box
            size={[width * 0.15, height - 2.1, 0.18]}
            position={[width * 0.025, (height + 2.1) / 2, depth / 2]}
            color={wall}
            radius={0.008}
          />
          <Box
            size={[width * 0.15 - 0.08, 2.05, 0.08]}
            position={[width * 0.025, 1.025, depth / 2]}
            color="#9e7854"
          />
        </>
      )}
      {view.cutaway && (
        <>
          <Box
            size={[width, 0.055, 0.16]}
            position={[0, 0.028, depth / 2]}
            color="#eeeade"
            radius={0.008}
          />
          <Box
            size={[0.16, 0.055, depth]}
            position={[width / 2, 0.028, 0]}
            color="#eeeade"
            radius={0.008}
          />
        </>
      )}
      {view.roof && <Roof room={room} color={wall} />}
      <Box
        size={[Math.min(3.8, width * 0.5), 0.018, Math.min(3.3, depth * 0.6)]}
        position={[-width * 0.2, 0.018, 0.45]}
        color="#e3ded0"
        radius={0.06}
      />
      {[-1, 1].map((side) => (
        <Box
          key={side}
          size={[Math.min(3.6, width * 0.47), 0.003, 0.025]}
          position={[-width * 0.2, 0.029, 0.45 + side * Math.min(1.52, depth * 0.27)]}
          color="#c8bcaa"
          radius={0}
        />
      ))}
      {Array.from({ length: 5 }, (_, index) => (
        <Box
          key={index}
          size={[0.5, 0.03, 0.36]}
          position={[(index - 2) * 0.62, -0.255, depth / 2 + 0.52]}
          color="#dfded0"
          radius={0.035}
        />
      ))}
    </group>
  );
};
