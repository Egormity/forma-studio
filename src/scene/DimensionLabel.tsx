import { useEffect, useState } from 'react';
import { CanvasTexture, MathUtils, PerspectiveCamera, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';

export const DimensionLabel = ({ position, text }: { position: [number, number, number]; text: string }) => {
  const height = useThree((state) => state.size.height);
  const camera = useThree((state) => state.camera);
  const scale = 2 * Math.tan(MathUtils.degToRad(camera instanceof PerspectiveCamera ? camera.fov : 38) / 2) * 22 / Math.max(1, height);
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#f8f7f0';
    context.strokeStyle = '#d8d8cd';
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(3, 3, 250, 90, 18);
    context.fill();
    context.stroke();
    context.fillStyle = '#64675c';
    context.font = '600 43px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 128, 50);
    const next = new CanvasTexture(canvas);
    next.colorSpace = SRGBColorSpace;
    setTexture(next);
    return () => next.dispose();
  }, [text]);
  if (!texture) return null;
  return <sprite position={position} scale={[scale * 256 / 96, scale, 1]} renderOrder={10}>
    <spriteMaterial map={texture} sizeAttenuation={false} transparent depthTest={false} depthWrite={false} toneMapped={false} />
  </sprite>;
};
