import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import type { Group } from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import type { FurnitureItem, Position, Room } from '../domain/types';
import { fitItemToRoom } from '../domain/scene';
import type { InteractionLock } from './FurnitureObject';

interface Props {
  object: RefObject<Group>;
  item: FurnitureItem;
  room: Room;
  lock: MutableRefObject<InteractionLock>;
  onMove: (id: string, position: Position) => void;
}

export const MoveControls = ({ object, item, room, lock, onMove }: Props) => {
  const id = item.id;
  const latest = useRef({ item, room });
  useEffect(() => {
    latest.current = { item, room };
  }, [item, room]);
  const { camera, gl, scene, invalidate, controls: orbit } = useThree();
  const commit = useRef(onMove);
  useEffect(() => {
    commit.current = onMove;
  }, [onMove]);
  useEffect(() => {
    const controls = new TransformControls(camera, gl.domElement);
    controls.attach(object.current);
    let dragOrigin = object.current.position.clone();
    controls.setMode('translate');
    controls.setSpace('world');
    controls.setTranslationSnap(0.25);
    controls.setSize(0.75);
    controls.showY = false;
    controls.minY = 0;
    controls.maxY = 0;
    const helper = controls.getHelper();
    scene.add(helper);
    const setOrbit = (enabled: boolean) => {
      if (orbit && 'enabled' in orbit) orbit.enabled = enabled;
    };
    const dragChanged = (event: { value: unknown }) => {
      if (event.value) dragOrigin = object.current.position.clone();
      lock.current.dragging = Boolean(event.value);
      setOrbit(!event.value);
    };
    const finish = () => {
      lock.current.until = performance.now() + 250;
      const fitted = fitItemToRoom(
        {
          ...latest.current.item,
          position: [object.current.position.x, object.current.position.z],
        },
        latest.current.room,
      );
      object.current.position.set(fitted.position[0], 0, fitted.position[1]);
      commit.current(id, fitted.position);
    };
    const floorConstraint = () => {
      object.current.position.y = 0;
    };
    const changed = () => invalidate();
    controls.addEventListener('change', changed);
    controls.addEventListener('dragging-changed', dragChanged);
    controls.addEventListener('mouseUp', finish);
    controls.addEventListener('objectChange', floorConstraint);
    invalidate();
    return () => {
      controls.removeEventListener('change', changed);
      controls.removeEventListener('dragging-changed', dragChanged);
      controls.removeEventListener('mouseUp', finish);
      controls.removeEventListener('objectChange', floorConstraint);
      if (controls.dragging && object.current) object.current.position.copy(dragOrigin);
      controls.detach();
      controls.dispose();
      scene.remove(helper);
      lock.current.dragging = false;
      lock.current.until = performance.now() + 100;
      gl.domElement.style.touchAction = '';
      setOrbit(true);
      invalidate();
    };
  }, [camera, gl, scene, invalidate, orbit, object, id, lock]);
  return null;
};
