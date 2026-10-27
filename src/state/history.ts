import type { SceneDocument } from '../domain/types';

export interface History { past: SceneDocument[]; present: SceneDocument; future: SceneDocument[] }
export type HistoryAction = { type: 'commit'; update: (scene: SceneDocument) => SceneDocument } | { type: 'undo' } | { type: 'redo' };
export const historyReducer = (state: History, action: HistoryAction): History => {
  if (action.type === 'undo') {
    const previous = state.past.at(-1);
    return previous ? { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] } : state;
  }
  if (action.type === 'redo') {
    const next = state.future[0];
    return next ? { past: [...state.past, state.present], present: next, future: state.future.slice(1) } : state;
  }
  const next = action.update(state.present);
  return JSON.stringify(next) === JSON.stringify(state.present) ? state : { past: [...state.past.slice(-59), state.present], present: next, future: [] };
};
