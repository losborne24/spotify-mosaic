import axios from 'axios';
import FastAverageColor from 'fast-average-color';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as constants from '../constants';
import { TextField, Button, makeStyles } from '@material-ui/core';

const Playlist = (props: any) => {
  const history = useHistory();
  const [playlistId, setPlaylistId] = useState('');
  const [personalPlaylists, setPersonalPlaylists] = useState([]) as any[];
  const fetchPersonalPlaylists = () => {
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          client_id: constants.client_id,
          fields: 'items(name,images,id)',
          response_type: constants.response_type,
          limit: 20,
          offset: 0,
        },
      })
      .then((res: any) => {
        if (res.data?.items) {
          let _playlists: { img: any; id: any; name: any }[] = [];
          res.data.items.forEach((item: any) => {
            _playlists.push({
              img: item.images[0].url,
              id: item.id,
              name: item.name,
            });
          });

          setPersonalPlaylists(_playlists);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const fetchPlaylist = () => {
    axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          client_id: constants.client_id,
          fields: 'items(track(album(images,id)))',
          response_type: constants.response_type,
          limit: 100,
          offset: 0,
        },
      })
      .then((res: any) => {
        if (res.data?.items) {
          const _tracks: { id: string; img: string; avgColour: any }[] = [];
          const fac = new FastAverageColor();
          const uniqueTracks: { id: string }[] = [];
          res.data.items.forEach((item: any) => {
            if (!uniqueTracks.find((u) => u.id === item.track.album.id)) {
              uniqueTracks.push({ id: item.track.album.id });
              fac
                .getColorAsync(item.track.album.images[2].url)
                .then((color) => {
                  _tracks.push({
                    id: item.track.album.id,
                    img: item.track.album.images[2].url,
                    avgColour: color.value,
                  });
                  // console.log(
                  //   '%c avgColour',
                  //   `color: rgba(${color.value[0]},${color.value[1]},${color.value[2]},${color.value[3]}`
                  // );
                });
            }
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
  }, []);
  useEffect(() => {
    if (props.token) fetchPersonalPlaylists();
  }, [props]);
  const useStyles = makeStyles({
    marginLeft: { marginLeft: '0.5rem' },
    marginRight: { marginRight: '0.5rem' },

    playlistImage: {
      maxHeight: '10vw',
      maxWidth: '10vw',
      margin: '1vw',
    },
    playlistInputContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    arrowContainer: {
      height: '10vw',
      width: '5vw',
      margin: '1vw',
      border: '0.1rem solid black',
      flexBasis: '5%',
      cursor: 'pointer',
    },
  });
  const classes = useStyles();
  return (
    <>
      {personalPlaylists.map((item: any, index: any) => {
        return (
          <img
            className={classes.playlistImage}
            key={`img-${index}`}
            src={item.img}
            alt="album cover"
          ></img>
        );
      })}
      <div className={classes.playlistInputContainer}>
        <TextField
          label="Enter Playlist ID"
          helperText="e.g. 37i9dQZEVXbNG2KDcFcKOF"
          onChange={(e) => setPlaylistId(e.target.value)}
          className={classes.marginRight}
        />
        <Button
          className={classes.marginLeft}
          variant="contained"
          color="primary"
          onClick={fetchPlaylist}
        >
          Confirm
        </Button>
      </div>
    </>
  );
};
export default Playlist;
