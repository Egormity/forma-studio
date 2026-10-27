import { Armchair, BedDouble, Columns3, LampDesk, Plus, Sofa, Sprout, Table2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FURNITURE_CATALOG } from '../domain/catalog';
import { MAX_ITEMS } from '../domain/scene';
import type { FurnitureKind } from '../domain/types';
import { SectionLabel } from './Controls';

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
    <SectionLabel aside={`${FURNITURE_CATALOG.length} objects`}>The essentials</SectionLabel>
    <p className="panel-hint">
      {atLimit
        ? `This space has ${MAX_ITEMS} objects. Remove one to add another.`
        : 'A few good pieces. Endless possibilities.'}
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
              <Icon size={36} strokeWidth={1.25} />
              <Plus size={13} className="catalog-add" />
            </span>
            <strong>{item.name}</strong>
            <span>
              {item.size.width} × {item.size.depth} m
            </span>
          </button>
        );
      })}
    </div>
    <div className="library-note">
      <Sprout size={15} />
      <span>Every piece is editable. Choose a finish, resize it, and find its place.</span>
    </div>
  </div>
);
