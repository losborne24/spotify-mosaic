import axios from 'axios';
import FastAverageColor from 'fast-average-color';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as constants from '../constants';
import { TextField, Button, makeStyles } from '@material-ui/core';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import './custom-swiper.scss';

import SwiperCore, { Navigation } from 'swiper/core';
// install Swiper modules
SwiperCore.use([Navigation]);
const Playlist = (props: any) => {
  const history = useHistory();
  const [personalPlaylists, setPersonalPlaylists] = useState([]) as any[];
  const [inputPlaylistId, setInputPlaylistId] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoadMore, setLoadMore] = useState(false);
  const fetchPersonalPlaylists = () => {
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          client_id: constants.client_id,
          fields: 'items(name,images,id)',
          response_type: constants.response_type,
          limit: 10,
          offset: offset,
        },
      })
      .then((res: any) => {
        let _playlists: { img: any; id: any; name: any }[] = [];
        if (res.data?.items) {
          console.log(res.data?.total);
          res.data.items.forEach((item: any) => {
            _playlists.push({
              img: item.images[0].url,
              id: item.id,
              name: item.name,
            });
          });
        }
        if (offset + 10 >= res.data?.total) {
          setLoadMore(false);
        } else {
          setLoadMore(true);
        }
        setOffset((offset) => (offset += 10));
        setPersonalPlaylists((playlists: any) => [...playlists, ..._playlists]);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const fetchPlaylist = (playlistId: String) => {
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
  }, [props.token]);
  const useStyles = makeStyles({
    marginLeft: { marginLeft: '0.5rem' },
    marginRight: { marginRight: '0.5rem' },
    width: { width: '100%' },
    playlistImage: {
      maxHeight: '15vw',
      maxWidth: '15vw',
    },
    playlistInputContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    txtFlex: {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
    },
    swiperSlide: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    loadMore: {
      border: '0.1rem solid black',
      height: '15vw',
      width: '15vw',
    },
  });
  const classes = useStyles();
  return (
    <>
      <h2>Personal Playlists</h2>
      <Swiper slidesPerView={6} navigation={true} className={classes.width}>
        {personalPlaylists.map((item: any, index: any) => {
          return (
            <SwiperSlide
              className={`${classes.swiperSlide}`}
              key={`swiper-slider-${index} `}
              onClick={() => {
                setInputPlaylistId(item.id);
              }}
            >
              <img
                className={`${classes.playlistImage}`}
                key={`img-${index}`}
                src={item.img}
                alt="album cover"
              ></img>
              <p className={classes.txtFlex}>{item.name}</p>
            </SwiperSlide>
          );
        })}
        {isLoadMore ? (
          <SwiperSlide
            className={`${classes.swiperSlide}`}
            onClick={() => fetchPersonalPlaylists()}
          >
            <div className={`${classes.loadMore} ${classes.txtFlex}`}>
              <p>Load More</p>
            </div>
            <p></p>
          </SwiperSlide>
        ) : (
          <></>
        )}
      </Swiper>
      <div className={classes.playlistInputContainer}>
        <TextField
          label="Enter Playlist ID"
          helperText="e.g. 37i9dQZEVXbNG2KDcFcKOF"
          onChange={(e) => setInputPlaylistId(e.target.value)}
          className={classes.marginRight}
          value={inputPlaylistId}
        />
        <Button
          className={classes.marginLeft}
          variant="contained"
          color="primary"
          onClick={() => fetchPlaylist(inputPlaylistId)}
        >
          Confirm
        </Button>
      </div>
    </>
  );
};
export default Playlist;
