import { describe, expect, it } from 'vitest';
import { createInitialScene, updateRoomInScene } from '../domain/scene';
import { historyReducer, type History } from './history';

describe('edit history', () => {
  it('restores room and furniture together, and discards redo after a new edit', () => {
    const original = createInitialScene();
    const initial: History = { past: [], present: original, future: [] };
    const changed = historyReducer(initial, { type: 'commit', update: (scene) => updateRoomInScene(scene, { width: 4, depth: 4 }) });
    expect(changed.present.furniture).not.toEqual(original.furniture);
    const undone = historyReducer(changed, { type: 'undo' });
    expect(undone.present).toEqual(original);
    expect(historyReducer(undone, { type: 'redo' }).present).toEqual(changed.present);
    const fork = historyReducer(undone, { type: 'commit', update: (scene) => updateRoomInScene(scene, { floorFinish: 'walnut' }) });
    expect(fork.future).toEqual([]);
    expect(historyReducer(fork, { type: 'redo' })).toBe(fork);
  });

  it('does not create history for unchanged edits and caps retained snapshots', () => {
    let state: History = { past: [], present: createInitialScene(), future: [] };
    expect(historyReducer(state, { type: 'undo' })).toBe(state);
    expect(historyReducer(state, { type: 'commit', update: (scene) => scene })).toBe(state);
    for (let i = 0; i < 100; i++) state = historyReducer(state, { type: 'commit', update: (scene) => ({ ...scene, name: `Revision ${i}` }) });
    expect(state.past).toHaveLength(60);
    expect(state.present.name).toBe('Revision 99');
  });
});
