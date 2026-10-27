import { createInitialScene, STORAGE_KEY } from '../domain/scene';
import { parseScene } from '../domain/serialization';
import type { SceneDocument } from '../domain/types';

export const RECOVERY_KEY = 'forma-studio.scene.recovery.v1';
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
export type SaveStatus = 'saved' | 'unavailable' | 'recovery';

export interface SavedScene {
  scene: SceneDocument;
  storage: StorageLike | undefined;
  recoveryRaw: string | null;
  status: SaveStatus;
}

export function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function loadSavedScene(storage: StorageLike | undefined): SavedScene {
  const fallback: SavedScene = {
    scene: createInitialScene(),
    storage,
    recoveryRaw: null,
    status: storage ? 'saved' : 'unavailable',
  };
  if (!storage) return fallback;
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    // If reading was blocked, we cannot know what a later write would replace.
    return { ...fallback, storage: undefined, status: 'unavailable' };
  }
  if (!raw) return fallback;
  try {
    return { ...fallback, scene: parseScene(JSON.parse(raw)) };
  } catch {
    return { ...fallback, recoveryRaw: raw, status: 'recovery' };
  }
}

export function saveScene(
  storage: StorageLike | undefined,
  scene: SceneDocument,
  recoveryRaw: string | null,
): boolean {
  if (!storage) return false;
  try {
    // A deliberate edit may replace an unreadable save only after preserving the original.
    if (recoveryRaw !== null) storage.setItem(RECOVERY_KEY, recoveryRaw);
    storage.setItem(STORAGE_KEY, JSON.stringify(scene));
    return true;
  } catch {
    return false;
  }
}
