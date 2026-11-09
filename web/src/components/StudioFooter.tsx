import { useState } from 'react';
import { ArrowUpRight, CircleHelp, X } from 'lucide-react';
import { IconButton } from './Controls';
import type { StudioModel } from './studio-model';

export const StudioFooter = ({ studio }: { studio: StudioModel }) => {
  const [showHelp, setShowHelp] = useState(false);
  const area = (studio.scene.room.width * studio.scene.room.depth).toFixed(1);

  return (
    <footer className="studio-footer">
      <div className="workspace-intro">
        <div>
          <span className="eyebrow intro-eyebrow">A LITTLE ROOM FOR POSSIBILITY</span>
          <h1>
            A space to make your own<span>.</span>
          </h1>
          <p>Shape a room. Find your pieces. See it all come together.</p>
        </div>
        <button
          type="button"
          className="help-button"
          aria-expanded={showHelp}
          aria-controls="studio-help"
          onClick={() => setShowHelp(!showHelp)}
        >
          <CircleHelp size={18} />
          A quick look around
          <ArrowUpRight size={16} />
        </button>
      </div>
      {showHelp && (
        <div className="help-panel" id="studio-help">
          <p>
            <strong>Getting around.</strong> Drag an empty area to orbit, scroll or pinch to zoom,
            and right-drag to pan. Select a piece to edit it, then turn on Move to drag it across
            the floor. Top view is best for a precise layout.
          </p>
          <IconButton label="Close help" onClick={() => setShowHelp(false)}>
            <X size={18} />
          </IconButton>
        </div>
      )}
      <div className="footer-meta">
        <span className="footer-brand">FORMA STUDIO</span>
        <span>
          {studio.scene.furniture.length} pieces<span className="footer-dot">·</span>
          {area} m²<span className="footer-dot">·</span>Your space, your perspective.
        </span>
      </div>
    </footer>
  );
};
