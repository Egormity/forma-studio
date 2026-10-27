import { useCallback, useEffect, useReducer, useState } from 'react';
import { addItemToScene, createInitialScene, createItem, MAX_ITEMS, STORAGE_KEY, updateItemInScene, updateRoomInScene } from '../domain/scene';
import { downloadScene, parseScene } from '../domain/serialization';
import type { FurnitureItem, FurnitureKind, Position, Room, SceneDocument, ViewSettings } from '../domain/types';
import { historyReducer } from './history';

const readInitial = () => {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return parseScene(JSON.parse(raw)); } catch { /* Restore the starter scene if the local save cannot be read. */ }
  return createInitialScene();
};

export const useStudio = () => {
  const [history, dispatch] = useReducer(historyReducer, null, () => ({ past: [], present: readInitial(), future: [] }));
  const scene = history.present;
  const [selectedId, select] = useState<string | null>('sofa-1');
  const [view, changeView] = useState<ViewSettings>({ camera: 'perspective', roof: false, cutaway: true, grid: true, dimensions: true, move: false });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unavailable'>('saved');
  const commit = useCallback((update: (scene: SceneDocument) => SceneDocument) => dispatch({ type: 'commit', update }), []);
  const selectedItem = scene.furniture.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(scene)); setSaveStatus('saved'); }
    catch { setSaveStatus('unavailable'); }
  }, [scene]);

  const updateRoom = useCallback((patch: Partial<Room>) => commit((current) => updateRoomInScene(current, patch)), [commit]);
  const updateItem = useCallback((id: string, patch: Partial<Omit<FurnitureItem, 'id' | 'kind'>>) => {
    commit((current) => updateItemInScene(current, id, patch));
  }, [commit]);
  const addItem = useCallback((kind: FurnitureKind) => {
    if (scene.furniture.length >= MAX_ITEMS) return;
    const item = createItem(kind);
    item.position = [0.25 * (scene.furniture.length % 3), 0.25 * (scene.furniture.length % 4)];
    commit((current) => addItemToScene(current, item)); select(item.id);
  }, [scene.furniture.length, commit]);
  const removeItem = useCallback((id: string) => {
    commit((current) => ({ ...current, furniture: current.furniture.filter((item) => item.id !== id) }));
    select((selected) => selected === id ? null : selected);
  }, [commit]);
  const duplicateItem = useCallback((id: string) => {
    const original = scene.furniture.find((item) => item.id === id);
    if (!original || scene.furniture.length >= MAX_ITEMS) return;
    const item: FurnitureItem = { ...structuredClone(original), id: crypto.randomUUID(), name: `${original.name.slice(0, 54)} copy`, position: [original.position[0] + 0.5, original.position[1] + 0.5] };
    commit((current) => addItemToScene(current, item)); select(item.id);
  }, [scene, commit]);
  const moveItem = useCallback((id: string, position: Position) => updateItem(id, { position }), [updateItem]);
  const setView = useCallback((patch: Partial<ViewSettings>) => changeView((current) => ({ ...current, ...patch, ...(patch.roof === true ? { cutaway: false } : {}), ...(patch.cutaway === true ? { roof: false } : {}) })), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const reset = useCallback(() => { commit(() => createInitialScene()); select('sofa-1'); }, [commit]);
  const exportScene = useCallback(() => downloadScene(scene), [scene]);
  const importScene = useCallback(async (file: File) => {
    if (file.size > 250_000) throw new Error('This scene file is too large. The limit is 250 KB.');
    let value: unknown;
    try { value = JSON.parse(await file.text()); } catch { throw new Error('Could not read this JSON file. Choose a Forma Studio scene.'); }
    const imported = parseScene(value);
    commit(() => imported); select(imported.furniture[0]?.id ?? null);
  }, [commit]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); if (event.shiftKey) redo(); else undo(); }
      if (event.key === 'Escape') { select(null); changeView((current) => ({ ...current, move: false })); }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) { event.preventDefault(); removeItem(selectedId); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, removeItem, undo, redo]);

  return { scene, view, selectedId, selectedItem, saveStatus, canUndo: history.past.length > 0, canRedo: history.future.length > 0, select, updateRoom, updateItem, addItem, removeItem, duplicateItem, moveItem, setView, undo, redo, reset, exportScene, importScene };
};

export type StudioModel = ReturnType<typeof useStudio>;
