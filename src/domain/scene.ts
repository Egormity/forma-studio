import { FURNITURE_CATALOG } from './catalog';
import type { FurnitureItem, FurnitureKind, Position, Room, SceneDocument } from './types';

export const MAX_ITEMS = 40;
export const STORAGE_KEY = 'forma-studio.scene.v1';
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const round = (value: number) => Math.round(value * 100) / 100;

export const createItem = (kind: FurnitureKind, id: string = crypto.randomUUID()): FurnitureItem => {
  const definition = FURNITURE_CATALOG.find((entry) => entry.kind === kind)!;
  return { id, kind, name: definition.name, position: [0, 0], rotation: 0, size: { ...definition.size }, color: definition.color };
};

export const createInitialScene = (): SceneDocument => {
  const placements: [FurnitureKind, string, Position, number][] = [
    ['sofa', 'sofa-1', [-2, -0.7], 0], ['table', 'table-1', [-1.85, 0.7], 0],
    ['armchair', 'armchair-1', [0.05, 0.55], 335], ['desk', 'desk-1', [1.8, -1.35], 0],
    ['plant', 'plant-1', [-3, -2.1], 0], ['shelf', 'shelf-1', [1.9, -2.58], 0],
  ];
  return {
    version: 1, name: 'The Courtyard',
    room: { width: 8, depth: 6, height: 2.8, wallFinish: 'chalk', floorFinish: 'oak' },
    furniture: placements.map(([kind, id, position, rotation]) => ({ ...createItem(kind, id), position, rotation })),
  };
};

export const footprint = (item: FurnitureItem) => {
  const radians = item.rotation * Math.PI / 180;
  const c = Math.abs(Math.cos(radians));
  const s = Math.abs(Math.sin(radians));
  return { width: c * item.size.width + s * item.size.depth, depth: s * item.size.width + c * item.size.depth };
};

export const fitItemToRoom = (item: FurnitureItem, room: Room): FurnitureItem => {
  const rotation = ((item.rotation % 360) + 360) % 360;
  const size = {
    width: clamp(item.size.width, 0.2, 6), depth: clamp(item.size.depth, 0.2, 6),
    height: clamp(item.size.height, 0.15, room.height - 0.15),
  };
  const bounds = footprint({ ...item, rotation, size });
  // Preserve the minimum dimensions while shrinking the remaining footprint.
  const minimumBounds = footprint({ ...item, rotation, size: { ...size, width: 0.2, depth: 0.2 } });
  const scale = Math.min(1,
    (room.width - 0.5 - minimumBounds.width) / Math.max(0.001, bounds.width - minimumBounds.width),
    (room.depth - 0.5 - minimumBounds.depth) / Math.max(0.001, bounds.depth - minimumBounds.depth));
  size.width = Math.floor((0.2 + (size.width - 0.2) * scale + 1e-9) * 100) / 100;
  size.depth = Math.floor((0.2 + (size.depth - 0.2) * scale + 1e-9) * 100) / 100;
  const fitted = footprint({ ...item, rotation, size });
  const maxX = Math.max(0, (room.width - fitted.width) / 2 - 0.2);
  const maxZ = Math.max(0, (room.depth - fitted.depth) / 2 - 0.2);
  return { ...item, rotation, size, position: [clamp(item.position[0], -maxX, maxX), clamp(item.position[1], -maxZ, maxZ)] };
};

export const updateRoomInScene = (scene: SceneDocument, patch: Partial<Room>): SceneDocument => {
  const room = { ...scene.room, ...patch };
  room.width = round(clamp(room.width, 4, 12));
  room.depth = round(clamp(room.depth, 4, 10));
  room.height = round(clamp(room.height, 2.2, 4));
  return { ...scene, room, furniture: scene.furniture.map((item) => fitItemToRoom(item, room)) };
};

export const updateItemInScene = (
  scene: SceneDocument, id: string, patch: Partial<Omit<FurnitureItem, 'id' | 'kind'>>,
): SceneDocument => ({
  ...scene,
  furniture: scene.furniture.map((item) => item.id === id ? fitItemToRoom({ ...item, ...patch }, scene.room) : item),
});

export const addItemToScene = (scene: SceneDocument, item: FurnitureItem): SceneDocument => {
  if (scene.furniture.length >= MAX_ITEMS) return scene;
  return { ...scene, furniture: [...scene.furniture, fitItemToRoom(item, scene.room)] };
};
