import { describe, expect, it } from 'vitest';
import { createInitialScene, STORAGE_KEY } from '../domain/scene';
import { loadSavedScene, RECOVERY_KEY, saveScene } from './persistence';

const memory = (raw: string | null = null) => {
  const values = new Map<string, string>(raw === null ? [] : [[STORAGE_KEY, raw]]);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
};

describe('local scene recovery', () => {
  it('leaves an unreadable save intact and preserves it before an explicit replacement', () => {
    const storage = memory('{broken');
    const loaded = loadSavedScene(storage);
    expect(loaded.status).toBe('recovery');
    expect(storage.getItem(STORAGE_KEY)).toBe('{broken');
    expect(storage.getItem(RECOVERY_KEY)).toBeNull();
    expect(saveScene(storage, loaded.scene, loaded.recoveryRaw)).toBe(true);
    expect(storage.getItem(RECOVERY_KEY)).toBe('{broken');
    expect(loadSavedScene(storage).scene).toEqual(loaded.scene);
  });

  it('does not replace the only copy if recovery storage is full', () => {
    const storage = memory('{broken');
    const blocked = {
      getItem: storage.getItem,
      setItem: (key: string, value: string) => {
        if (key === RECOVERY_KEY) throw new Error('Quota exceeded');
        storage.setItem(key, value);
      },
    };
    expect(saveScene(blocked, createInitialScene(), '{broken')).toBe(false);
    expect(storage.getItem(STORAGE_KEY)).toBe('{broken');
  });

  it('keeps the editor usable when browser storage is blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('Blocked');
      },
      setItem: () => {
        throw new Error('Blocked');
      },
    };
    expect(loadSavedScene(blocked).status).toBe('unavailable');
    expect(loadSavedScene(blocked).storage).toBeUndefined();
    expect(loadSavedScene(undefined).scene).toEqual(createInitialScene());
    expect(saveScene(undefined, createInitialScene(), null)).toBe(false);
    expect(saveScene(blocked, createInitialScene(), null)).toBe(false);
  });
});
