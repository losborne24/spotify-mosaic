import axios from 'axios';
import FastAverageColor from 'fast-average-color';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as constants from '../constants';
import Button from './button';

const Playlist = (props: any) => {
  const history = useHistory();

  const test = () => {
    axios
      .get(
        'https://api.spotify.com/v1/playlists/67kpF6n681k5BXimSJqYJh/tracks',
        {
          headers: { Authorization: `Bearer ${props?.token}` },
          params: {
            client_id: constants.client_id,
            fields: 'items(track(album(images),id))',
            response_type: constants.response_type,
            limit: 100,
            offset: 0,
          },
        }
      )
      .then((res: any) => {
        if (res.data?.items) {
          let _tracks: { id: string; img: string; avgColour: any }[] = [];
          const fac = new FastAverageColor();
          res.data.items.forEach((item: any) => {
            fac.getColorAsync(item.track.album.images[2].url).then((color) => {
              _tracks.push({
                id: item.track.id,
                img: item.track.album.images[2].url,
                avgColour: color.value,
              });
              console.log(
                '%c avgColour',
                `color: rgba(${color.value[0]},${color.value[1]},${color.value[2]},${color.value[3]}`
              );
            });
          });
          props.setTracks(_tracks);
          history.push('/selectImage');
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    props.setToken(
      window.location.hash.split(constants.access_token).pop()?.split('&')[0]
    );
  }, [props]);
  return (
    <>
      <Button onClick={test} name="Get tracks"></Button>
    </>
  );
};
export default Playlist;
