import { Component, Suspense, useRef, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import type { ViewportProps } from '../domain/types';
import { House } from './House';
import { FurnitureObject, type InteractionLock } from './FurnitureObject';
import { SceneCamera } from './SceneCamera';
import { Dimensions } from './Dimensions';

const Fallback = () => <div role="status" style={{ height: '100%', display: 'grid', placeContent: 'center', padding: 36, textAlign: 'center', color: '#64665d', background: '#e9e8e2', fontSize: 14, lineHeight: 1.6 }}>
  <strong style={{ fontSize: 20, color: '#32382e' }}>Your space is still here.</strong>
  <p>The 3D view needs WebGL. Enable hardware acceleration in your browser, then reload.<br />You can still edit the room and save your project.</p>
</div>;

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Fallback /> : this.props.children; }
}

export const Viewport = ({ scene, view, selectedId, onSelect, onMove }: ViewportProps) => {
  const lock = useRef<InteractionLock>({ dragging: false, until: 0 });
  return <div style={{ width: '100%', height: '100%', position: 'relative' }} aria-label="Interactive 3D room preview">
    <CanvasBoundary>
      <Canvas shadows frameloop="demand" dpr={[1, 1.5]} camera={{ position: [11, 10, 11], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
        onPointerMissed={(event) => { if (event.type === 'click' && !lock.current.dragging && performance.now() > lock.current.until) onSelect(null); }}
        fallback={<Fallback />}>
        <color attach="background" args={['#e9e8e2']} />
        <fog attach="fog" args={['#e9e8e2', 30, 65]} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#f7f5ee', '#a1a891', 1.2]} />
        <directionalLight position={[3, 10, 6]} intensity={2.4} color="#fff4dc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-camera-near={0.5} shadow-camera-far={30} shadow-normalBias={0.025} shadow-bias={-0.00015} shadow-radius={3} />
        <directionalLight position={[-6, 6, -4]} intensity={0.7} color="#e8edff" />
        <Suspense fallback={null}>
          <House room={scene.room} view={view} />
          {scene.furniture.map((item) => <FurnitureObject key={item.id} item={item} room={scene.room} selected={item.id === selectedId} move={view.move} lock={lock} onSelect={onSelect} onMove={onMove} />)}
          {view.dimensions && <Dimensions room={scene.room} />}
        </Suspense>
        <mesh position={[0, -0.435, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#e9e8e2" roughness={1} />
        </mesh>
        {view.grid && <Grid position={[0, -0.43, 0]} args={[40, 40]} cellSize={0.5} cellThickness={0.45} cellColor="#c2c4b9" sectionSize={2} sectionThickness={0.7} sectionColor="#acb3a2" fadeDistance={24} fadeStrength={2} />}
        <SceneCamera room={scene.room} view={view.camera} />
      </Canvas>
    </CanvasBoundary>
  </div>;
};
