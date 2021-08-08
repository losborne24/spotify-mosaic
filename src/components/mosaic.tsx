import { useEffect, useRef, useState } from 'react';
const Mosaic = (props: any) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [selectedTrackImages, setSelectedTrackImages] = useState() as any[];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectImage = (img: any) => {
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
    draw(ctx, img);
  };

  const draw = (ctx: any, img: { width: number; height: number }) => {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let images = [];
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let pixelA = [...ctx.getImageData(x, y, 1, 1).data];
        pixelA[3] /= 255;
        for (let v = 0; v < 3; v++) {
          pixelA[v] = (pixelA[v] * pixelA[3]) / 255;
        }
        let minDist = -1;
        let index = 0;
        for (let i = 0; i < props.tracks.length; i++) {
          let pixelB = [...props.tracks[i].avgColour];
          pixelB[3] /= 255;
          for (let v = 0; v < 3; v++) {
            pixelB[v] = (pixelB[v] * pixelB[3]) / 255;
          }
          let dist =
            Math.max(
              Math.pow(pixelA[0] - pixelB[0], 2),
              Math.pow(pixelA[0] - pixelB[0] - pixelA[3] + pixelB[3], 2)
            ) +
            Math.max(
              Math.pow(pixelA[1] - pixelB[1], 2),
              Math.pow(pixelA[1] - pixelB[1] - pixelA[3] + pixelB[3], 2)
            ) +
            Math.max(
              Math.pow(pixelA[2] - pixelB[2], 2),
              Math.pow(pixelA[2] - pixelB[2] - pixelA[3] + pixelB[3], 2)
            );
          if (minDist === -1) {
            minDist = dist;
            index = i;
          } else if (dist < minDist) {
            minDist = dist;
            index = i;
          }
        }
        // console.log(
        //   '%cCOLOR' + '%cWINNINGCOLOR',
        //   `background-color:rgba(${pixelA[0] * 255},${pixelA[1] * 255},${
        //     pixelA[2] * 255
        //   },${pixelA[3] * 255})`,
        //   `background-color:rgba(${props.tracks[index].avgColour[0]},${props.tracks[index].avgColour[1]},${props.tracks[index].avgColour[2]},${props.tracks[index].avgColour[3]}`
        // );
        images.push(props.tracks[index].img);
      }
    }
    setSelectedTrackImages(images);
  };
  const grid = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width}, 1fr)`,
  };
  const renderImages = () => {
    if (selectedTrackImages) {
      return (
        <div style={grid}>
          {selectedTrackImages.map((item: string | undefined, index: any) => {
            return (
              <img
                className={index}
                key={`img-${index}`}
                src={item}
                alt="album cover"
              ></img>
            );
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    if (props.imageSrc) {
      let img = new Image();
      img.src = props.imageSrc;
      img.onload = () => {
        selectImage(img);
      };
    }
  }, [props.img]);
  return (
    <>
      <canvas hidden ref={canvasRef} width={width} height={height}></canvas>
      <div>{renderImages()}</div>
    </>
  );
};
export default Mosaic;
