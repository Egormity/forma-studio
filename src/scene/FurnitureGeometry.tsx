import type { FurnitureItem } from '../domain/types';
import { Bed, Sofa } from './SoftFurniture';
import { Shelf, Table } from './WoodFurniture';
import { Plant } from './Plant';

export const FurnitureGeometry = ({ item }: { item: FurnitureItem }) => {
  const { width, height, depth } = item.size;
  return (
    <group scale={[width, height, depth]}>
      {item.kind === 'sofa' && <Sofa color={item.color} />}
      {item.kind === 'armchair' && <Sofa color={item.color} single />}
      {item.kind === 'table' && <Table color={item.color} />}
      {item.kind === 'desk' && <Table color={item.color} dining />}
      {item.kind === 'bed' && <Bed color={item.color} />}
      {item.kind === 'shelf' && <Shelf color={item.color} />}
      {item.kind === 'plant' && <Plant color={item.color} />}
    </group>
  );
};
