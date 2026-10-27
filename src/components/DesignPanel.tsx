import { useState } from 'react';
import { ArrowUpRight, Check, RotateCcw, Shapes, SquareDashed } from 'lucide-react';
import { FLOOR_FINISHES, WALL_FINISHES } from '../domain/catalog';
import { MAX_ITEMS } from '../domain/scene';
import { NumberField, SectionLabel } from './Controls';
import { FurnitureLibrary } from './FurnitureLibrary';
import type { StudioModel } from './studio-model';

export const DesignPanel = ({ studio, onReset }: { studio: StudioModel; onReset: () => void }) => {
  const [tab, setTab] = useState<'space' | 'furniture'>('space');
  const { room } = studio.scene;

  return (
    <aside className="panel design-panel" aria-label="Design library">
      <div className="panel-heading"><span className="eyebrow">MAKE IT YOURS</span><h2>Design library</h2></div>
      <div className="panel-tabs" role="tablist" aria-label="Design tools">
        <button type="button" role="tab" aria-selected={tab === 'space'} aria-controls="space-panel" id="space-tab" onClick={() => setTab('space')}><SquareDashed size={15} />Space</button>
        <button type="button" role="tab" aria-selected={tab === 'furniture'} aria-controls="furniture-panel" id="furniture-tab" onClick={() => setTab('furniture')}><Shapes size={15} />Furniture</button>
      </div>
      <div className="panel-body">
        {tab === 'space' ? (
          <div id="space-panel" role="tabpanel" aria-labelledby="space-tab">
            <section className="panel-section">
              <SectionLabel aside="METRES">Room dimensions</SectionLabel>
              <div className="room-diagram" aria-hidden="true"><div className="room-diagram-inner"><span>{room.width.toFixed(1)} × {room.depth.toFixed(1)}</span><small>{(room.width * room.depth).toFixed(1)} m²</small></div><span className="diagram-north">N ↑</span></div>
              <div className="fields-three">
                <NumberField label="Width" accessibleLabel="Room width" value={room.width} min={4} max={12} onChange={(width) => studio.updateRoom({ width })} />
                <NumberField label="Depth" accessibleLabel="Room depth" value={room.depth} min={4} max={10} onChange={(depth) => studio.updateRoom({ depth })} />
                <NumberField label="Height" accessibleLabel="Room height" value={room.height} min={2.2} max={4} onChange={(height) => studio.updateRoom({ height })} />
              </div>
            </section>
            <section className="panel-section">
              <SectionLabel>Wall finish</SectionLabel>
              <div className="finish-options">
                {WALL_FINISHES.map((finish) => <button type="button" key={finish.id} className={`finish-option ${room.wallFinish === finish.id ? 'is-selected' : ''}`} onClick={() => studio.updateRoom({ wallFinish: finish.id })} aria-pressed={room.wallFinish === finish.id}><span className="finish-swatch" style={{ backgroundColor: finish.color }}>{room.wallFinish === finish.id && <Check size={14} />}</span><span>{finish.name}</span></button>)}
              </div>
            </section>
            <section className="panel-section">
              <SectionLabel>Floor finish</SectionLabel>
              <div className="floor-options">
                {FLOOR_FINISHES.map((finish) => <button type="button" key={finish.id} className={`floor-option ${room.floorFinish === finish.id ? 'is-selected' : ''}`} onClick={() => studio.updateRoom({ floorFinish: finish.id })} aria-pressed={room.floorFinish === finish.id}><span className="wood-swatch" style={{ backgroundColor: finish.color }}>{room.floorFinish === finish.id && <Check size={14} />}</span><span>{finish.name}</span></button>)}
              </div>
            </section>
            <button type="button" className="furnish-link" onClick={() => setTab('furniture')}><span><strong>Bring your space to life</strong><small>Explore the furniture collection</small></span><ArrowUpRight size={18} /></button>
          </div>
        ) : <div id="furniture-panel" role="tabpanel" aria-labelledby="furniture-tab"><FurnitureLibrary onAdd={studio.addItem} atLimit={studio.scene.furniture.length >= MAX_ITEMS} /></div>}
      </div>
      <div className="panel-footer"><button className="text-button" type="button" onClick={onReset}><RotateCcw size={13} />Reset space</button><span>1 m = 1 metre</span></div>
    </aside>
  );
};
