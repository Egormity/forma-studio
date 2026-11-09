import { Armchair, BedDouble, Columns3, LampDesk, Plus, Sofa, Sprout, Table2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FURNITURE_CATALOG } from '../domain/catalog';
import { MAX_ITEMS } from '../domain/scene';
import type { FurnitureKind } from '../domain/types';

export const FURNITURE_ICONS: Record<FurnitureKind, LucideIcon> = {
  sofa: Sofa,
  armchair: Armchair,
  table: Table2,
  desk: LampDesk,
  bed: BedDouble,
  plant: Sprout,
  shelf: Columns3,
};

export const FurnitureLibrary = ({
  onAdd,
  atLimit,
}: {
  onAdd: (kind: FurnitureKind) => void;
  atLimit: boolean;
}) => (
  <div className="furniture-library">
    <p className="panel-hint">
      {atLimit
        ? `You've reached ${MAX_ITEMS} pieces. Remove one to add another.`
        : 'Pick a piece to add it to your room.'}
    </p>
    <div className="catalog-grid">
      {FURNITURE_CATALOG.map((item) => {
        const Icon = FURNITURE_ICONS[item.kind];
        return (
          <button
            type="button"
            key={item.kind}
            className="catalog-card"
            onClick={() => onAdd(item.kind)}
            disabled={atLimit}
            aria-label={`Add ${item.name.toLowerCase()}`}
          >
            <span className="catalog-illustration" style={{ color: item.color }}>
              <Icon size={42} strokeWidth={1.35} />
            </span>
            <span className="catalog-card-footer">
              <strong>{item.name}</strong>
              <span className="catalog-add" aria-hidden="true">
                <Plus size={15} />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
