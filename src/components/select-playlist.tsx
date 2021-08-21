import axios from 'axios';
import FastAverageColor from 'fast-average-color';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as constants from '../constants';
import { TextField, Button, makeStyles } from '@material-ui/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import '../styles/custom-swiper.scss';

import SwiperCore, { Navigation } from 'swiper/core';
SwiperCore.use([Navigation]);
const Playlist = (props: any) => {
  const history = useHistory();
  const [personalPlaylists, setPersonalPlaylists] = useState([]) as any[];
  const [publicPlaylists, setPublicPlaylists] = useState([]) as any[];
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
  const fetchPublicPlaylists = () => {
    axios
      .get('https://api.spotify.com/v1/browse/categories/toplists/playlists', {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          client_id: constants.client_id,
          fields: 'items(name,images,id)',
          response_type: constants.response_type,
          limit: 10,
          offset: 0,
        },
      })
      .then((res: any) => {
        let _playlists: { img: any; id: any; name: any }[] = [];
        if (res.data?.playlists.items) {
          res.data.playlists.items.forEach((item: any) => {
            _playlists.push({
              img: item.images[0].url,
              id: item.id,
              name: item.name,
            });
          });
        }

        setPublicPlaylists(_playlists);
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
          const uniqueTracks: any[] = [];
          res.data.items.forEach((item: any) => {
            if (
              !uniqueTracks.find(
                (u) => u.track.album.id === item.track.album.id
              )
            ) {
              uniqueTracks.push(item);
            }
          });
          uniqueTracks.forEach((item: any) => {
            fac.getColorAsync(item.track.album.images[2].url).then((color) => {
              _tracks.push({
                id: item.track.album.id,
                img: item.track.album.images[2].url,
                avgColour: color.value,
              });
              if (_tracks.length === uniqueTracks.length) {
                props.setTracks(_tracks);
                if (props.returnToMosaic) {
                  history.push('/createMosaic');
                } else {
                  history.push('/selectImage');
                }
              }
            });
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const fetchTopTracks = (period: String) => {
    axios
      .get('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          time_range: period,
          limit: 50,
          offset: 0,
        },
      })
      .then((res: any) => {
        if (res.data?.items) {
          const _tracks: { id: string; img: string; avgColour: any }[] = [];
          const fac = new FastAverageColor();
          const uniqueTracks: any[] = [];
          res.data.items.forEach((item: any) => {
            if (!uniqueTracks.find((u) => u.album.id === item.album.id)) {
              uniqueTracks.push(item);
            }
          });
          uniqueTracks.forEach((item: any) => {
            fac.getColorAsync(item.album.images[2].url).then((color) => {
              _tracks.push({
                id: item.album.id,
                img: item.album.images[2].url,
                avgColour: color.value,
              });
              if (_tracks.length === uniqueTracks.length) {
                props.setTracks(_tracks);
                if (props.returnToMosaic) {
                  history.push('/createMosaic');
                } else {
                  history.push('/selectImage');
                }
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
    if (window.location.hash.includes(constants.access_token)) {
      const token = window.location.hash
        .split(constants.access_token)
        .pop()
        ?.split('&')[0];
      if (token) localStorage.setItem('token', token);
      props.setToken(token);
    } else {
      props.setToken(localStorage.getItem('token'));
    }
  }, []);
  useEffect(() => {
    if (props.token) {
      fetchPersonalPlaylists();
      fetchPublicPlaylists();
    }
  }, [props.token]);
  const useStyles = makeStyles({
    marginLeft: { marginLeft: '0.5rem' },
    marginRight: { marginRight: '0.5rem' },
    width100: { width: '100%' },
    widthXL: { width: '83%' },
    widthXS: { width: '17%' },
    playlistImage: {
      maxHeight: '14vw',
      maxWidth: '14vw',
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
      height: '14vw',
      width: '14vw',
    },
    playlistContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    publicContainer: {
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '83%',
    },
    topTracksContainer: {
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      width: '17%',
      height: '100%',
    },
    btnTopTrackContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
    },
    btnTopTracks: { width: '100%', margin: '0.5rem' },
  });
  const classes = useStyles();
  const yourTopTrackStrings = [
    { id: 'short_term', text: 'Short Term' },
    { id: 'medium_term', text: 'Medium Term' },
    { id: 'long_term', text: 'Long Term' },
  ];
  return (
    <>
      <div className={classes.playlistContainer}>
        <div className={`${classes.publicContainer} `}>
          <h2>Public Playlists</h2>
          <Swiper
            slidesPerView={5}
            navigation={true}
            className={classes.width100}
          >
            {publicPlaylists.map((item: any, index: any) => {
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
          </Swiper>
        </div>
        <div className={`${classes.topTracksContainer} `}>
          <h2>Your Top Tracks</h2>
          <div className={classes.btnTopTrackContainer}>
            {yourTopTrackStrings.map((item: any, index: any) => {
              return (
                <Button
                  className={`${classes.btnTopTracks}`}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    fetchTopTracks(item.id);
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </div>
        </div>{' '}
      </div>{' '}
      <h2>Your Playlists</h2>
      <Swiper slidesPerView={6} navigation={true} className={classes.width100}>
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
      </Swiper>{' '}
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
