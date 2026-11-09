import { Box, Grid2X2, House, Layers2, Move, Ruler, Square } from 'lucide-react';
import type { CameraView } from '../domain/types';
import type { StudioModel } from './studio-model';

const CAMERAS: { id: CameraView; label: string; short: string; icon: typeof Box }[] = [
  { id: 'perspective', label: 'Perspective', short: '3D', icon: Box },
  { id: 'top', label: 'Top', short: 'Top', icon: Square },
  { id: 'front', label: 'Front', short: 'Front', icon: House },
];

export const ViewportControls = ({ studio }: { studio: StudioModel }) => (
  <>
    <div className="viewport-topbar">
      <div className="camera-controls" aria-label="Camera views">
        {CAMERAS.map(({ id, label, short, icon: Icon }) => (
          <button
            type="button"
            key={id}
            aria-label={label}
            aria-pressed={studio.view.camera === id}
            onClick={() => studio.setView({ camera: id })}
          >
            <Icon size={16} />
            <span>{short}</span>
          </button>
        ))}
      </div>
    </div>
    <div className="viewport-toolbar" aria-label="Scene display options">
      <button
        type="button"
        className="tool-toggle"
        aria-label="Cutaway walls"
        aria-pressed={studio.view.cutaway}
        onClick={() => studio.setView({ cutaway: !studio.view.cutaway })}
      >
        <Layers2 size={16} />
        <span>Walls</span>
      </button>
      <button
        type="button"
        className="tool-toggle"
        aria-label="Show roof"
        aria-pressed={studio.view.roof}
        onClick={() => studio.setView({ roof: !studio.view.roof })}
      >
        <House size={16} />
        <span>Roof</span>
      </button>
      <button
        type="button"
        className="tool-toggle"
        aria-label="Show floor grid"
        aria-pressed={studio.view.grid}
        onClick={() => studio.setView({ grid: !studio.view.grid })}
      >
        <Grid2X2 size={16} />
        <span>Grid</span>
      </button>
      <button
        type="button"
        className="tool-toggle"
        aria-label="Show dimensions"
        aria-pressed={studio.view.dimensions}
        onClick={() => studio.setView({ dimensions: !studio.view.dimensions })}
      >
        <Ruler size={16} />
        <span>Rulers</span>
      </button>
      <button
        type="button"
        className="tool-toggle"
        aria-label="Move selected object"
        aria-pressed={studio.view.move}
        onClick={() => studio.setView({ move: !studio.view.move })}
      >
        <Move size={16} />
        <span>Move</span>
      </button>
    </div>
  </>
);
