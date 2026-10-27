import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CircleHelp, X } from 'lucide-react';
import { useStudio } from './state/useStudio';
import { Viewport } from './scene/Viewport';
import { StudioHeader } from './components/StudioHeader';
import { DesignPanel } from './components/DesignPanel';
import { Inspector } from './components/Inspector';
import { ViewportControls } from './components/ViewportControls';
import { IconButton } from './components/Controls';

export const App = () => {
  const studio = useStudio();
  const fileInput = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), toast.error ? 9000 : 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const exportScene = () => {
    try {
      studio.exportScene();
      setToast({ message: 'Scene exported. Take your ideas with you.' });
    } catch {
      setToast({ message: 'Could not export the scene. Please try again.', error: true });
    }
  };

  return (
    <div className="studio-app">
      <StudioHeader
        studio={studio}
        onImport={() => fileInput.current?.click()}
        onExport={exportScene}
      />
      <input
        ref={fileInput}
        type="file"
        className="visually-hidden"
        accept=".json,application/json"
        aria-label="Import scene file"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          try {
            await studio.importScene(file);
            setToast({ message: 'Your scene is ready to explore.' });
          } catch (error) {
            setToast({
              message: error instanceof Error ? error.message : 'This file could not be opened.',
              error: true,
            });
          }
        }}
      />
      <main id="workspace" className="studio-main">
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
            <CircleHelp size={16} />A quick look around
            <ArrowUpRight size={14} />
          </button>
        </div>
        {showHelp && (
          <div className="help-panel" id="studio-help">
            <p>
              <strong>Make yourself at home.</strong> Drag an empty area to orbit, scroll or pinch
              to zoom, and right-drag to pan. Select furniture to edit it. Turn on Move to drag its
              arrows along the floor. Try Top view for a precise layout.
            </p>
            <IconButton label="Close help" onClick={() => setShowHelp(false)}>
              <X size={16} />
            </IconButton>
          </div>
        )}
        <div className="workspace-grid">
          <DesignPanel
            studio={studio}
            onReset={() => {
              studio.reset();
              setToast({ message: 'Original space restored. You can undo this change.' });
            }}
          />
          <section className="viewport-panel" aria-label="Interactive 3D room">
            <div className="viewport-stage">
              <Viewport
                scene={studio.scene}
                view={studio.view}
                selectedId={studio.selectedId}
                onSelect={studio.select}
                onMove={studio.moveItem}
              />
              <ViewportControls studio={studio} />
              <div className="scene-caption">
                <span>THE COURTYARD COLLECTION</span>
                <strong>
                  Good spaces start
                  <br />
                  with a little curiosity.
                </strong>
              </div>
            </div>
            <div className="viewport-status">
              <span className="scene-object-count">
                <span className="tiny-dot" />
                {studio.scene.furniture.length} objects<span className="status-divider">/</span>
                {(studio.scene.room.width * studio.scene.room.depth).toFixed(1)} m²
              </span>
              <span className="viewport-hint">
                {studio.view.move
                  ? 'Drag the arrows to move your selection'
                  : 'Drag to orbit · Scroll to zoom · Click to select'}
              </span>
              <span className="units-badge">METRIC</span>
            </div>
          </section>
          <Inspector studio={studio} />
        </div>
        <footer className="studio-footer">
          <span>Built for the way you imagine.</span>
          <span>
            FORMA STUDIO<span className="footer-dot">·</span>Your space, your perspective.
          </span>
        </footer>
      </main>
      {toast && (
        <div
          className={`toast ${toast.error ? 'toast-error' : ''}`}
          role={toast.error ? 'alert' : 'status'}
        >
          <span>{toast.message}</span>
          <IconButton label="Dismiss notification" onClick={() => setToast(null)}>
            <X size={15} />
          </IconButton>
        </div>
      )}
    </div>
  );
};
