import { useLayoutEffect, useRef, type MutableRefObject } from 'react';
import { Line } from '@react-three/drei';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { Group } from 'three';
import type { FurnitureItem, Position, Room } from '../domain/types';
import { FurnitureGeometry } from './FurnitureGeometry';
import { MoveControls } from './MoveControls';

export interface InteractionLock { dragging: boolean; until: number }
interface Props {
  item: FurnitureItem;
  room: Room;
  selected: boolean;
  move: boolean;
  lock: MutableRefObject<InteractionLock>;
  onSelect: (id: string) => void;
  onMove: (id: string, position: Position) => void;
}

export const FurnitureObject = ({ item, room, selected, move, lock, onSelect, onMove }: Props) => {
  const ref = useRef<Group>(null!);
  const canvas = useThree((state) => state.gl.domElement);
  const { width, depth } = item.size;
  const x = width / 2 + 0.065;
  const z = depth / 2 + 0.065;
  useLayoutEffect(() => {
    ref.current.position.set(item.position[0], 0, item.position[1]);
    ref.current.rotation.y = item.rotation * Math.PI / 180;
  }, [item.position, item.rotation]);
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta < 4 && !lock.current.dragging && performance.now() > lock.current.until) onSelect(item.id);
  };
  return <>
    <group ref={ref} onClick={select} onPointerOver={(event) => { event.stopPropagation(); canvas.style.cursor = 'pointer'; }} onPointerOut={() => { canvas.style.cursor = ''; }}>
      <FurnitureGeometry item={item} />
      {selected && <group position={[0, 0.035, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width + 0.13, depth + 0.13]} />
          <meshBasicMaterial color="#bd6249" transparent opacity={0.08} depthWrite={false} />
        </mesh>
        <Line points={[[-x, 0, -z], [x, 0, -z], [x, 0, z], [-x, 0, z], [-x, 0, -z]]} color="#b56048" lineWidth={1.5} />
      </group>}
    </group>
    {selected && move && <MoveControls object={ref} item={item} room={room} lock={lock} onMove={onMove} />}
  </>;
};
