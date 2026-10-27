import { Line } from '@react-three/drei';
import { DimensionLabel as Label } from './DimensionLabel';
import type { Room } from '../domain/types';

type Point = [number, number, number];
const Measure = ({ from, to }: { from: Point; to: Point }) => (
  <group>
    <Line points={[from, to]} color="#92988a" lineWidth={1} />
    {[from, to].map((point, i) => <Line key={i} points={[[point[0] - 0.08, point[1], point[2] - 0.08], [point[0] + 0.08, point[1], point[2] + 0.08]]} color="#92988a" lineWidth={1} />)}
  </group>
);

export const Dimensions = ({ room }: { room: Room }) => {
  const { width, depth, height } = room;
  return <group>
    <Measure from={[-width / 2, -0.25, depth / 2 + 1.1]} to={[width / 2, -0.25, depth / 2 + 1.1]} />
    <Label position={[0, -0.25, depth / 2 + 1.1]} text={`${width.toFixed(1)} m`} />
    <Measure from={[width / 2 + 1.1, -0.25, -depth / 2]} to={[width / 2 + 1.1, -0.25, depth / 2]} />
    <Label position={[width / 2 + 1.1, -0.25, 0]} text={`${depth.toFixed(1)} m`} />
    <Measure from={[-width / 2 - 0.45, 0, -depth / 2]} to={[-width / 2 - 0.45, height, -depth / 2]} />
    <Label position={[-width / 2 - 0.45, height / 2, -depth / 2]} text={`${height.toFixed(1)} m`} />
  </group>;
};
