import { useEffect, useRef, type ComponentRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import type { CameraView, Room } from '../domain/types';

export const SceneCamera = ({ room, view }: { room: Room; view: CameraView }) => {
  const ref = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const target = new Vector3(0, view === 'top' ? 0 : room.height * 0.22, 0);
    const direction =
      view === 'top'
        ? new Vector3(0, 1, 0.0001)
        : view === 'front'
          ? new Vector3(0, 0.12, 1)
          : new Vector3(1, 0.95, 1);
    direction.normalize();
    const right = new Vector3().crossVectors(new Vector3(0, 1, 0), direction).normalize();
    const up = new Vector3().crossVectors(direction, right).normalize();
    const tanVertical = Math.tan(MathUtils.degToRad(camera.fov) / 2);
    const tanHorizontal = (tanVertical * width) / Math.max(1, height);
    let distance = 0;
    // Include exterior dimension lines, the plinth and the optional pitched roof.
    for (const x of [-room.width / 2 - 1.25, room.width / 2 + 1.25]) {
      for (const z of [-room.depth / 2 - 1.25, room.depth / 2 + 1.25]) {
        for (const y of [-0.45, room.height + room.width * 0.19]) {
          const point = new Vector3(x, y, z).sub(target);
          distance = Math.max(
            distance,
            Math.abs(point.dot(right)) / tanHorizontal + point.dot(direction),
            Math.abs(point.dot(up)) / tanVertical + point.dot(direction),
          );
        }
      }
    }
    camera.position.copy(target).addScaledVector(direction, distance * 1.08);
    camera.lookAt(target);
    ref.current?.target.copy(target);
    ref.current?.update();
    invalidate();
  }, [camera, invalidate, room.width, room.depth, room.height, view, width, height]);
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableDamping
      dampingFactor={0.085}
      minDistance={3}
      maxDistance={65}
      maxPolarAngle={Math.PI / 2 - 0.03}
      enableRotate={view !== 'top'}
      zoomSpeed={0.7}
      panSpeed={0.6}
    />
  );
};
