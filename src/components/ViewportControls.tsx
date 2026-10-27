import { Box, Grid2X2, House, Layers2, Maximize, Move, Ruler, Square } from 'lucide-react';
import type { CameraView } from '../domain/types';
import { IconButton } from './Controls';
import type { StudioModel } from './studio-model';

const CAMERAS: { id: CameraView; label: string; icon: typeof Box }[] = [
  { id: 'perspective', label: 'Perspective', icon: Box },
  { id: 'top', label: 'Top', icon: Square },
  { id: 'front', label: 'Front', icon: House },
];

export const ViewportControls = ({ studio }: { studio: StudioModel }) => (
  <>
    <div className="viewport-topbar">
      <div className="camera-controls" aria-label="Camera views">
        {CAMERAS.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={studio.view.camera === id} onClick={() => studio.setView({ camera: id })}><Icon size={14} /><span>{label}</span></button>)}
      </div>
      <div className="live-badge"><span />LIVE 3D</div>
    </div>
    <div className="viewport-bottom-controls">
      <div className="scene-toggles" aria-label="Scene display options">
        <IconButton label="Cutaway walls" aria-pressed={studio.view.cutaway} onClick={() => studio.setView({ cutaway: !studio.view.cutaway })}><Layers2 size={17} /></IconButton>
        <IconButton label="Show roof" aria-pressed={studio.view.roof} onClick={() => studio.setView({ roof: !studio.view.roof })}><House size={17} /></IconButton>
        <span className="toolbar-divider" />
        <IconButton label="Show floor grid" aria-pressed={studio.view.grid} onClick={() => studio.setView({ grid: !studio.view.grid })}><Grid2X2 size={17} /></IconButton>
        <IconButton label="Show dimensions" aria-pressed={studio.view.dimensions} onClick={() => studio.setView({ dimensions: !studio.view.dimensions })}><Ruler size={17} /></IconButton>
        <span className="toolbar-divider" />
        <IconButton label="Move selected object" aria-pressed={studio.view.move} onClick={() => studio.setView({ move: !studio.view.move })}><Move size={17} /></IconButton>
      </div>
      <div className="compass" aria-hidden="true"><span>N</span><Maximize size={18} strokeWidth={1.25} /></div>
    </div>
  </>
);
