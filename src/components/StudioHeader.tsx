import { ArrowDownToLine, ArrowUpFromLine, Check, Redo2, Undo2 } from 'lucide-react';
import { IconButton } from './Controls';
import type { StudioModel } from './studio-model';

interface StudioHeaderProps {
  studio: StudioModel;
  onImport: () => void;
  onExport: () => void;
}

export const StudioHeader = ({ studio, onImport, onExport }: StudioHeaderProps) => (
  <header className="studio-header">
    <a className="brand" href="#workspace" aria-label="Forma Studio workspace">
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="brand-name">
        FORMA<span>STUDIO</span>
      </span>
    </a>
    <div className="header-divider" />
    <div className="project-name">
      <span className="project-indicator" />
      {studio.scene.name}
      <span className="project-type">Personal project</span>
    </div>
    <div
      className={`save-status ${studio.saveStatus !== 'saved' ? 'save-warning' : ''}`}
      role="status"
    >
      {studio.saveStatus === 'saved' && <Check size={13} />}
      {studio.saveStatus === 'saved'
        ? 'Saved on this device'
        : studio.saveStatus === 'recovery'
          ? 'Previous save preserved'
          : 'Export to save your work'}
    </div>
    <div className="header-actions">
      <div className="history-actions">
        <IconButton label="Undo" onClick={studio.undo} disabled={!studio.canUndo}>
          <Undo2 size={17} />
        </IconButton>
        <IconButton label="Redo" onClick={studio.redo} disabled={!studio.canRedo}>
          <Redo2 size={17} />
        </IconButton>
      </div>
      <button
        className="button button-quiet"
        type="button"
        aria-label="Import scene"
        title="Import scene"
        onClick={onImport}
      >
        <ArrowUpFromLine size={15} />
        <span className="button-label-desktop">Import</span>
      </button>
      <button
        className="button button-dark"
        type="button"
        aria-label="Export scene"
        onClick={onExport}
      >
        <ArrowDownToLine size={15} />
        <span className="button-label-desktop">Export scene</span>
        <span className="button-label-mobile">Export</span>
      </button>
    </div>
  </header>
);
