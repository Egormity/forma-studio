import { useState } from 'react';
import { Check, Plus, RotateCcw, Shapes, SquareDashed } from 'lucide-react';
import { FLOOR_FINISHES, WALL_FINISHES } from '../domain/catalog';
import { MAX_ITEMS } from '../domain/scene';
import { NumberField, SectionLabel } from './Controls';
import { FurnitureLibrary } from './FurnitureLibrary';
import type { StudioModel } from './studio-model';

interface FinishOptionsProps<T extends string> {
  label: string;
  options: readonly { id: T; name: string; color: string }[];
  value: T;
  variant: 'wall' | 'floor';
  onChange: (value: T) => void;
}

const FinishOptions = <T extends string>({
  label,
  options,
  value,
  variant,
  onChange,
}: FinishOptionsProps<T>) => (
  <section className="panel-section">
    <SectionLabel>{label}</SectionLabel>
    <div className="swatch-grid">
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            type="button"
            key={option.id}
            className={`swatch-option ${selected ? 'is-selected' : ''}`}
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
          >
            <span
              className={`swatch-chip swatch-chip-${variant}`}
              style={{ backgroundColor: option.color }}
            >
              {selected && <Check size={18} strokeWidth={3} />}
            </span>
            <span className="swatch-name">{option.name}</span>
          </button>
        );
      })}
    </div>
  </section>
);

export const DesignPanel = ({ studio, onReset }: { studio: StudioModel; onReset: () => void }) => {
  const [tab, setTab] = useState<'space' | 'furniture'>('space');
  const { room } = studio.scene;

  return (
    <aside className="panel design-panel" aria-label="Design library">
      <div className="panel-tabs" role="tablist" aria-label="Design tools">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'space'}
          aria-controls="space-panel"
          id="space-tab"
          onClick={() => setTab('space')}
        >
          <SquareDashed size={16} />
          Space
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'furniture'}
          aria-controls="furniture-panel"
          id="furniture-tab"
          onClick={() => setTab('furniture')}
        >
          <Shapes size={16} />
          Furniture
        </button>
      </div>
      <div className="panel-body">
        {tab === 'space' ? (
          <div id="space-panel" role="tabpanel" aria-labelledby="space-tab">
            <section className="panel-section">
              <SectionLabel aside={`${(room.width * room.depth).toFixed(1)} m²`}>
                Room size
              </SectionLabel>
              <div className="fields-three">
                <NumberField
                  label="Width"
                  accessibleLabel="Room width"
                  value={room.width}
                  min={4}
                  max={12}
                  onChange={(width) => studio.updateRoom({ width })}
                />
                <NumberField
                  label="Depth"
                  accessibleLabel="Room depth"
                  value={room.depth}
                  min={4}
                  max={10}
                  onChange={(depth) => studio.updateRoom({ depth })}
                />
                <NumberField
                  label="Height"
                  accessibleLabel="Room height"
                  value={room.height}
                  min={2.2}
                  max={4}
                  onChange={(height) => studio.updateRoom({ height })}
                />
              </div>
            </section>
            <FinishOptions
              label="Walls"
              options={WALL_FINISHES}
              value={room.wallFinish}
              variant="wall"
              onChange={(wallFinish) => studio.updateRoom({ wallFinish })}
            />
            <FinishOptions
              label="Floor"
              options={FLOOR_FINISHES}
              value={room.floorFinish}
              variant="floor"
              onChange={(floorFinish) => studio.updateRoom({ floorFinish })}
            />
            <button
              type="button"
              className="button button-dark button-block"
              onClick={() => setTab('furniture')}
            >
              <Plus size={16} />
              Add furniture
            </button>
          </div>
        ) : (
          <div id="furniture-panel" role="tabpanel" aria-labelledby="furniture-tab">
            <FurnitureLibrary
              onAdd={studio.addItem}
              atLimit={studio.scene.furniture.length >= MAX_ITEMS}
            />
          </div>
        )}
      </div>
      <div className="panel-footer">
        <button className="text-button" type="button" onClick={onReset}>
          <RotateCcw size={15} />
          Reset space
        </button>
      </div>
    </aside>
  );
};
