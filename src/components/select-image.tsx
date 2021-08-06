import { useEffect, useRef, useState } from 'react';
import temp from '../temp.jpg';

import Button from './button';
const SelectImage = (props: any) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let img = new Image();

  const selectImage = () => {
    img = new Image();
    img.onload = () => {
      let height = img.height;
      let width = img.width;
      if (width * height > 10000) {
        let size = width * height;
        let modifier = Math.sqrt(size / 10000);
        img.height /= modifier;
        img.width /= modifier;
        setHeight(img.height);
        setWidth(img.width);
      }
      const ctx = canvasRef.current?.getContext('2d');
      draw(ctx);
    };

    img.src = temp;
  };
  const draw = (ctx: any) => {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let images = [];
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let pixelA = ctx.getImageData(x, y, 1, 1).data;
        let closestId: any;
        let minDist;
        for (let i = 0; i < props.tracks.length; i++) {
          let pixelB = props.tracks[i].avgColour;
          pixelA[3] /= 255;
          pixelB[3] /= 255;
          for (let v = 0; v < 3; v++) {
            pixelA[v] = (pixelA[v] * pixelA[3]) / 255;
            pixelB[v] = (pixelB[v] * pixelB[3]) / 255;
          }
          let dist =
            Math.max(
              (pixelA[0] - pixelB[0]) ^ 2,
              (pixelA[0] - pixelB[0] - pixelA[3] + pixelB[3]) ^ 2
            ) +
            Math.max(
              (pixelA[1] - pixelB[1]) ^ 2,
              (pixelA[1] - pixelB[1] - pixelA[3] + pixelB[3]) ^ 2
            ) +
            Math.max(
              (pixelA[2] - pixelB[2]) ^ 2,
              (pixelA[2] - pixelB[2] - pixelA[3] + pixelB[3]) ^ 2
            );
          if (!minDist) {
            minDist = dist;
            closestId = props.tracks[i].id;
          } else if (dist < minDist) {
            minDist = dist;
            closestId = props.tracks[i].id;
          }
        }
        images.push(props.tracks.find((t: any) => t.id === closestId)[0].img);
      }
    }
    // images.foreach(image =>)
  };
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    draw(ctx);
  }, []);
  return (
    <>
      <Button onClick={selectImage} name="Select Image"></Button>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
    </>
  );
};
export default SelectImage;
