import { describe, expect, it } from 'vitest';
import { addItemToScene, createInitialScene, createItem, fitItemToRoom, footprint, MAX_ITEMS, updateItemInScene, updateRoomInScene } from './scene';
import { parseScene } from './serialization';
import type { FurnitureItem, Room } from './types';

const expectInside = (item: FurnitureItem, room: Room) => {
  const bounds = footprint(item);
  expect(Math.abs(item.position[0]) + bounds.width / 2).toBeLessThanOrEqual(room.width / 2 - 0.1999);
  expect(Math.abs(item.position[1]) + bounds.depth / 2).toBeLessThanOrEqual(room.depth / 2 - 0.1999);
  expect(item.size.height).toBeLessThanOrEqual(room.height - 0.15);
};

describe('room placement', () => {
  it('fits rotated and oversized furniture within a resized room', () => {
    const initial = createInitialScene();
    for (const rotation of [0, 25, 45, 90, 135, 270, -45]) {
      const edited = updateItemInScene(initial, 'sofa-1', {
        rotation, size: { width: 6, depth: 5, height: 3.8 }, position: [20, -20],
      });
      const small = updateRoomInScene(edited, { width: 4, depth: 4, height: 2.2 });
      small.furniture.forEach((item) => expectInside(item, small.room));
    }
  });

  it('does not change dimensions after repeated normalization and save/import', () => {
    const scene = createInitialScene();
    const fitted = updateRoomInScene(scene, {});
    let current = fitted;
    for (let i = 0; i < 10; i++) current = parseScene(JSON.parse(JSON.stringify(current)));
    expect(current).toEqual(fitted);
    expect(current.furniture[0].size.width).toBe(2.3);
    const thin = fitItemToRoom({ ...createItem('shelf'), rotation: 45, size: { width: 6, depth: 0.2, height: 1 } }, { ...scene.room, width: 4, depth: 4 });
    expect(thin.size.depth).toBeGreaterThanOrEqual(0.2);
    expect(fitItemToRoom(thin, { ...scene.room, width: 4, depth: 4 })).toEqual(thin);
  });

  it('limits the scene to forty objects', () => {
    let scene = createInitialScene();
    while (scene.furniture.length < MAX_ITEMS) scene = addItemToScene(scene, createItem('plant'));
    expect(addItemToScene(scene, createItem('plant'))).toBe(scene);
  });
});

describe('scene import', () => {
  it('loads exports and strips unrecognized properties', () => {
    const scene = updateRoomInScene(createInitialScene(), {});
    expect(parseScene({ ...scene, script: 'untrusted' })).toEqual(scene);
  });

  it.each(['version', 'dimensions', 'duplicate', 'color', 'unknown-kind', 'nonfinite', 'too-many'])('rejects malformed data: %s', (kind) => {
    const scene = createInitialScene();
    const invalid = scene as unknown as Record<string, unknown>;
    if (kind === 'version') invalid.version = 2;
    if (kind === 'dimensions') scene.room.width = -3;
    if (kind === 'duplicate') scene.furniture.push({ ...scene.furniture[0] });
    if (kind === 'color') scene.furniture[0].color = 'url(https://example.invalid)';
    if (kind === 'unknown-kind') Object.assign(scene.furniture[0], { kind: 'script' });
    if (kind === 'nonfinite') scene.furniture[0].position[0] = NaN;
    if (kind === 'too-many') scene.furniture = Array.from({ length: MAX_ITEMS + 1 }, (_, i) => createItem('plant', `plant-${i}`));
    expect(() => parseScene(invalid)).toThrow('not a valid Forma Studio scene');
  });
});
