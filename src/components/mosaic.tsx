import { Button } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Slider from '@material-ui/core/Slider';

const Mosaic = (props: any) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [selectedTrackImage, setSelectedTrackImage] = useState() as any[];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mosaicCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const history = useHistory();
  const [value, setValue] = useState<number>(30);
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
    console.log(newValue);
  };
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
  let count = 0;
  const onLoadCallback = (img: any) => {
    count++;
    if (count === img.width * img.height) {
      if (mosaicCanvasRef.current) {
        setSelectedTrackImage(mosaicCanvasRef.current.toDataURL());
        count = 0;
      }
    }
  };
  const draw = (ctx: any, img: { width: number; height: number }) => {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const mosaicCanvas = mosaicCanvasRef.current?.getContext('2d');
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
        let album = new Image();
        album.crossOrigin = 'anonymous';
        album.src = props.tracks[index].img;
        album.onload = () => {
          mosaicCanvas?.drawImage(
            album,
            x * 64,
            y * 64,
            album.width,
            album.height
          );
          onLoadCallback(img);
        };
      }
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
      <Button
        onClick={() => {
          history.push('/playlists');
        }}
      >
        Select New Playlist
      </Button>

      <Button
        onClick={() => {
          history.push('/selectImage');
        }}
      >
        Upload New Image
      </Button>
      <canvas hidden ref={canvasRef} width={width} height={height}></canvas>
      <canvas
        hidden
        ref={mosaicCanvasRef}
        width={width * 64}
        height={height * 64}
      ></canvas>
      <img
        src={selectedTrackImage}
        width={width * value}
        height={height * value}
      ></img>
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby="continuous-slider"
        min={1}
        max={64}
      />
    </>
  );
};
export default Mosaic;
