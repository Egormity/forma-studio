import { FURNITURE_CATALOG } from './catalog';
import { fitItemToRoom, MAX_ITEMS } from './scene';
import type { FurnitureItem, SceneDocument } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const numberIn = (value: unknown, min: number, max: number): value is number => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
const text = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const invalid = () => new Error('This is not a valid Forma Studio scene. Please import a scene exported from this app.');

export const parseScene = (input: unknown): SceneDocument => {
  if (!isRecord(input) || input.version !== 1 || !text(input.name, 100) || !isRecord(input.room)) throw invalid();
  const room = input.room;
  if (!numberIn(room.width, 4, 12) || !numberIn(room.depth, 4, 10) || !numberIn(room.height, 2.2, 4)
    || !['chalk', 'sage', 'clay'].includes(String(room.wallFinish)) || !['oak', 'ash', 'walnut'].includes(String(room.floorFinish))) throw invalid();
  if (!Array.isArray(input.furniture) || input.furniture.length > MAX_ITEMS) throw invalid();
  const ids = new Set<string>();
  const furniture = input.furniture.map((value): FurnitureItem => {
    if (!isRecord(value) || !text(value.id, 100) || ids.has(value.id) || !text(value.name, 60)
      || !FURNITURE_CATALOG.some(({ kind }) => kind === value.kind) || !isRecord(value.size)
      || !numberIn(value.size.width, 0.1, 6) || !numberIn(value.size.depth, 0.1, 6) || !numberIn(value.size.height, 0.15, 4)
      || !Array.isArray(value.position) || value.position.length !== 2 || !value.position.every((v) => numberIn(v, -20, 20))
      || !numberIn(value.rotation, -360, 360) || typeof value.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(value.color)) throw invalid();
    ids.add(value.id);
    return {
      id: value.id, kind: value.kind as FurnitureItem['kind'], name: value.name,
      position: [value.position[0], value.position[1]], rotation: value.rotation,
      size: { width: value.size.width, depth: value.size.depth, height: value.size.height }, color: value.color,
    };
  });
  const result: SceneDocument = {
    version: 1, name: input.name,
    room: { width: room.width, depth: room.depth, height: room.height, wallFinish: room.wallFinish as SceneDocument['room']['wallFinish'], floorFinish: room.floorFinish as SceneDocument['room']['floorFinish'] },
    furniture,
  };
  result.furniture = furniture.map((item) => fitItemToRoom(item, result.room));
  return result;
};

export const downloadScene = (scene: SceneDocument) => {
  const blob = new Blob([JSON.stringify(scene, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${scene.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'forma-scene'}.forma.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
