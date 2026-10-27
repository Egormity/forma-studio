import { Copy, MousePointer2, Move, RotateCw, Trash2 } from 'lucide-react';
import { FURNITURE_CATALOG, FURNITURE_COLORS } from '../domain/catalog';
import { MAX_ITEMS } from '../domain/scene';
import { NumberField, ObjectNameField, SectionLabel } from './Controls';
import { FURNITURE_ICONS } from './FurnitureLibrary';
import type { StudioModel } from './studio-model';

export const Inspector = ({ studio }: { studio: StudioModel }) => {
  const item = studio.selectedItem;
  const Icon = item ? FURNITURE_ICONS[item.kind] : MousePointer2;
  const definition = FURNITURE_CATALOG.find((entry) => entry.kind === item?.kind);

  return (
    <aside className="panel inspector-panel" aria-label="Object properties">
      <div className="panel-heading">
        <span className="eyebrow">THE FINER DETAILS</span>
        <h2>Object properties</h2>
      </div>
      {item ? (
        <div className="panel-body inspector-body" key={item.id}>
          <div className="selected-summary">
            <span className="selected-preview" style={{ color: item.color }}>
              <Icon size={39} strokeWidth={1.2} />
            </span>
            <div>
              <span className="eyebrow">SELECTED OBJECT</span>
              <h3>{definition?.name}</h3>
              <span className="object-subtitle">{definition?.description}</span>
            </div>
          </div>
          <section className="panel-section">
            <ObjectNameField
              value={item.name}
              onChange={(name) => studio.updateItem(item.id, { name })}
            />
          </section>
          <section className="panel-section">
            <SectionLabel aside="METRES">Dimensions</SectionLabel>
            <div className="fields-three">
              {(['width', 'depth', 'height'] as const).map((axis) => (
                <NumberField
                  key={axis}
                  label={axis[0].toUpperCase() + axis.slice(1)}
                  accessibleLabel={`Object ${axis}`}
                  value={item.size[axis]}
                  min={axis === 'height' ? 0.15 : 0.2}
                  max={axis === 'height' ? studio.scene.room.height - 0.15 : 6}
                  onChange={(value) =>
                    studio.updateItem(item.id, { size: { ...item.size, [axis]: value } })
                  }
                />
              ))}
            </div>
          </section>
          <section className="panel-section">
            <SectionLabel>Position & rotation</SectionLabel>
            <div className="fields-three">
              <NumberField
                label="X axis"
                accessibleLabel="Object X position"
                value={item.position[0]}
                min={-studio.scene.room.width / 2}
                max={studio.scene.room.width / 2}
                onChange={(value) => studio.moveItem(item.id, [value, item.position[1]])}
              />
              <NumberField
                label="Z axis"
                accessibleLabel="Object Z position"
                value={item.position[1]}
                min={-studio.scene.room.depth / 2}
                max={studio.scene.room.depth / 2}
                onChange={(value) => studio.moveItem(item.id, [item.position[0], value])}
              />
              <NumberField
                label="Rotation"
                accessibleLabel="Object rotation"
                value={item.rotation}
                min={0}
                max={360}
                step={15}
                unit="°"
                onChange={(rotation) => studio.updateItem(item.id, { rotation })}
              />
            </div>
            <div className="object-position-actions">
              <button
                type="button"
                className={`button button-soft ${studio.view.move ? 'is-active' : ''}`}
                aria-pressed={studio.view.move}
                onClick={() => studio.setView({ move: !studio.view.move })}
              >
                <Move size={14} />
                Move in scene
              </button>
              <button
                type="button"
                className="button button-soft"
                onClick={() => studio.updateItem(item.id, { rotation: (item.rotation + 90) % 360 })}
                aria-label="Rotate object 90 degrees"
              >
                <RotateCw size={14} />
                90°
              </button>
            </div>
          </section>
          <section className="panel-section">
            <SectionLabel>Colour palette</SectionLabel>
            <div className="color-options">
              {FURNITURE_COLORS.map((color, index) => (
                <button
                  type="button"
                  className={`color-swatch ${item.color === color ? 'is-selected' : ''}`}
                  key={color}
                  style={{ backgroundColor: color }}
                  aria-label={`Object colour ${['sage', 'sand', 'terracotta', 'linen', 'slate', 'charcoal', 'oak'][index]}`}
                  aria-pressed={item.color === color}
                  title={['Sage', 'Sand', 'Terracotta', 'Linen', 'Slate', 'Charcoal', 'Oak'][index]}
                  onClick={() => studio.updateItem(item.id, { color })}
                />
              ))}
            </div>
          </section>
          <div className="object-actions">
            <button
              type="button"
              className="button button-outline"
              disabled={studio.scene.furniture.length >= MAX_ITEMS}
              title={
                studio.scene.furniture.length >= MAX_ITEMS
                  ? 'The space has reached its 40 object limit'
                  : 'Duplicate selected object'
              }
              onClick={() => studio.duplicateItem(item.id)}
            >
              <Copy size={14} />
              Duplicate
            </button>
            <button
              type="button"
              className="button button-danger"
              onClick={() => studio.removeItem(item.id)}
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
          <div className="inspector-note">
            <span className="tiny-dot" />
            <span>
              Your ideas, in real dimensions.
              <br />
              Changes appear in the scene instantly.
            </span>
          </div>
        </div>
      ) : (
        <div className="empty-inspector">
          <MousePointer2 size={30} strokeWidth={1.2} />
          <h3>A little attention to detail.</h3>
          <p>Select a piece in your space to change its size, colour, and position.</p>
          <span>Click any object to begin</span>
        </div>
      )}
    </aside>
  );
};
