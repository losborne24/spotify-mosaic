import { Button, makeStyles } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollContainer from 'react-indiana-drag-scroll';
import axios from 'axios';
import * as constants from '../constants';
import FastAverageColor from 'fast-average-color';

const Mosaic = (props: any) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [offset, setOffset] = useState(100);
  const [isLoadingMosaic, setIsLoadingMosaic] = useState(true);
  const [selectedTrackImage, setSelectedTrackImage] = useState<any>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mosaicCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const history = useHistory();
  const [value, setValue] = useState<number>(10);
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
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
        setIsLoadingMosaic(false);
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
  const fetchMoreTracks = () => {
    axios
      .get(props.fetchMoreUrl, {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          client_id: constants.client_id,
          fields: 'items(track(album(images,id))),total',
          response_type: constants.response_type,
          limit: 100,
          offset: offset,
        },
      })
      .then((res: any) => {
        if (res.data?.items) {
          if (res.data.total > offset + 100) {
            setOffset(offset + 100);
          } else {
            props.setFetchMoreUrl(null);
          }
          const _tracks: { id: string; img: string; avgColour: any }[] = [];
          const fac = new FastAverageColor();
          const uniqueTracks: any[] = props.uniqueTracks;
          res.data.items.forEach((item: any) => {
            if (
              !uniqueTracks.find(
                (u) => u.track.album.id === item.track.album.id
              )
            ) {
              uniqueTracks.push(item);
            }
          });
          props.setUniqueTracks(uniqueTracks);
          uniqueTracks.forEach((item: any) => {
            fac.getColorAsync(item.track.album.images[2].url).then((color) => {
              _tracks.push({
                id: item.track.album.id,
                img: item.track.album.images[2].url,
                avgColour: color.value,
              });
              if (_tracks.length === uniqueTracks.length) {
                props.setTracks([...props.tracks, ..._tracks]);
                setIsLoadingMosaic(true);
              }
            });
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (props.imageSrc) {
      let img = new Image();
      img.src = props.imageSrc;
      img.onload = () => {
        selectImage(img);
      };
    }
  }, [props.img, props.tracks]);

  const useStyles = makeStyles({
    scrollContainer: {
      maxHeight: '100%',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    outerContainer: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      height: '100%',
    },
    mosaicContainer: {
      display: 'grid',
      gridTemplateRows: '1fr auto',
      height: '100%',
      minHeight: '0',
    },
    buttonContainer: {
      display: 'flex',
      margin: '2rem 1.5rem',
      overflowX: 'auto',
      '& > *': {
        margin: '0 0.5rem',
      },
    },
    sliderContainer: {
      margin: '2rem 4rem',
    },
    loadingContainer: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
    },
  });
  const classes = useStyles();

  return (
    <div className={classes.outerContainer}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.setReturnToMosaic(true);
            history.push('/playlists');
          }}
        >
          Select New Playlist
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push('/selectImage');
          }}
        >
          Upload New Image
        </Button>
        <Button
          disabled={isLoadingMosaic || props.fetchMoreUrl === null}
          variant="contained"
          color="primary"
          onClick={fetchMoreTracks}
        >
          Fetch More Tracks
        </Button>
        <Button
          disabled={isLoadingMosaic}
          variant="contained"
          color="primary"
          onClick={() => {
            const link = document.createElement('a');
            link.href = selectedTrackImage;
            link.setAttribute('download', 'mosaic.png'); //or any other extension
            document.body.appendChild(link);
            link.click();
          }}
        >
          Download Mosaic
        </Button>
      </div>

      <canvas hidden ref={canvasRef} width={width} height={height}></canvas>
      <canvas
        hidden
        ref={mosaicCanvasRef}
        width={width * 64}
        height={height * 64}
      ></canvas>
      {isLoadingMosaic ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.mosaicContainer}>
          <ScrollContainer className={classes.scrollContainer}>
            <img
              src={selectedTrackImage}
              width={width * value}
              height={height * value}
            ></img>
          </ScrollContainer>
          <div className={classes.sliderContainer}>
            <Slider
              value={value}
              onChange={handleChange}
              aria-labelledby="continuous-slider"
              min={1}
              max={64}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Mosaic;
