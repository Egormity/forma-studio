export type FurnitureKind = 'sofa' | 'armchair' | 'table' | 'desk' | 'bed' | 'plant' | 'shelf';
export type Position = [number, number];
export interface Size { width: number; depth: number; height: number }
export interface FurnitureItem { id: string; kind: FurnitureKind; name: string; position: Position; rotation: number; size: Size; color: string }
export type WallFinish = 'chalk' | 'sage' | 'clay';
export type FloorFinish = 'oak' | 'ash' | 'walnut';
export interface Room { width: number; depth: number; height: number; wallFinish: WallFinish; floorFinish: FloorFinish }
export interface SceneDocument { version: 1; name: string; room: Room; furniture: FurnitureItem[] }
export type CameraView = 'perspective' | 'top' | 'front';
export interface ViewSettings { camera: CameraView; roof: boolean; cutaway: boolean; grid: boolean; dimensions: boolean; move: boolean }
export interface FurnitureDefinition { kind: FurnitureKind; name: string; description: string; size: Size; color: string }
export interface ViewportProps { scene: SceneDocument; view: ViewSettings; selectedId: string | null; onSelect: (id: string | null) => void; onMove: (id: string, position: Position) => void }
