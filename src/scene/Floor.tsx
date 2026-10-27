import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import type { Room } from '../domain/types';
import { FLOOR_FINISHES } from '../domain/catalog';

export const Floor = ({ room }: { room: Room }) => {
  const ref = useRef<InstancedMesh>(null);
  const planks = useMemo(() => {
    const rows = Math.ceil(room.depth / 0.24);
    const rowDepth = room.depth / rows;
    return Array.from({ length: rows }, (_, row) => {
      const positions = [
        0,
        ...(row % 2 ? [0.85] : []),
        ...Array.from(
          { length: Math.ceil(room.width / 2) },
          (_, i) => (row % 2 ? 0.85 : 0) + (i + 1) * 2,
        ).filter((x) => x < room.width),
        room.width,
      ];
      return positions.slice(1).map((end, index) => ({
        x: (positions[index] + end) / 2 - room.width / 2,
        z: (row + 0.5) * rowDepth - room.depth / 2,
        width: end - positions[index],
        depth: rowDepth,
        shade: 0.92 + ((row * 7 + index * 3) % 9) * 0.016,
      }));
    }).flat();
  }, [room.width, room.depth]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const object = new Object3D();
    const base = new Color(FLOOR_FINISHES.find((finish) => finish.id === room.floorFinish)?.color);
    planks.forEach((plank, index) => {
      object.position.set(plank.x, -0.005, plank.z);
      object.scale.set(plank.width - 0.008, 0.025, plank.depth - 0.006);
      object.updateMatrix();
      ref.current!.setMatrixAt(index, object.matrix);
      ref.current!.setColorAt(index, base.clone().multiplyScalar(plank.shade));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [planks, room.floorFinish]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, planks.length]} receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.79} />
    </instancedMesh>
  );
};
