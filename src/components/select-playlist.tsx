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
  const [personalPlaylists, setPersonalPlaylists] = useState<any[]>([]);
  const [publicPlaylists, setPublicPlaylists] = useState<any[]>([]);
  const [inputPlaylistId, setInputPlaylistId] = useState<string>('');
  const [offsetPlaylists, setOffsetPlaylists] = useState<number>(0);
  const [isLoadMorePlaylists, setLoadMorePlaylists] = useState<boolean>(false);
  enum playlistType {
    public,
    personal,
  }
  enum trackType {
    playlist,
    top,
  }
  const fetchPlaylists = (pType: playlistType) => {
    const reqUrl =
      pType === playlistType.public
        ? 'https://api.spotify.com/v1/browse/categories/toplists/playlists'
        : 'https://api.spotify.com/v1/me/playlists';
    axios
      .get(reqUrl, {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: {
          client_id: constants.client_id,
          fields: 'items(name,images,id)',
          response_type: constants.response_type,
          limit: 10,
          offset: pType === playlistType.public ? 0 : offsetPlaylists,
        },
      })
      .then((res: any) => {
        let _playlists: { img: any; id: any; name: any }[] = [];
        if (res.data) {
          const items =
            pType === playlistType.public
              ? res.data?.playlists.items
              : res.data?.items;
          items.forEach((item: any) => {
            _playlists.push({
              img: item.images[0].url,
              id: item.id,
              name: item.name,
            });
          });
        }
        if (pType === playlistType.public) {
          setPublicPlaylists(_playlists);
        } else {
          setLoadMorePlaylists(offsetPlaylists + 10 < res.data?.total);
          setOffsetPlaylists(offsetPlaylists + 10);
          setPersonalPlaylists((playlists: any) => [
            ...playlists,
            ..._playlists,
          ]);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const fetchTracks = (tType: trackType, id: String) => {
    const reqUrl =
      tType === trackType.playlist
        ? `https://api.spotify.com/v1/playlists/${id}/tracks`
        : 'https://api.spotify.com/v1/me/top/tracks';
    const reqParams =
      tType === trackType.playlist
        ? {
            client_id: constants.client_id,
            fields: 'items(track(album(images,id))),total',
            response_type: constants.response_type,
            limit: 100,
            offset: 0,
          }
        : {
            time_range: id,
            limit: 50,
            offset: 0,
          };
    axios
      .get(reqUrl, {
        headers: { Authorization: `Bearer ${props?.token}` },
        params: reqParams,
      })
      .then((res: any) => {
        if (res.data?.items) {
          if (res.data.total > 100 && tType === trackType.playlist) {
            props.setFetchMoreUrl(
              `https://api.spotify.com/v1/playlists/${id}/tracks`
            );
          } else {
            props.setFetchMoreUrl(null);
          }
          const _tracks: { id: string; img: string; avgColour: any }[] = [];
          const fac = new FastAverageColor();
          const uniqueTracks: any[] = [];
          res.data.items.forEach((item: any) => {
            if (tType === trackType.playlist) {
              if (
                !uniqueTracks.find(
                  (u) => u.track.album.id === item.track.album.id
                )
              ) {
                uniqueTracks.push(item);
              }
            } else {
              if (!uniqueTracks.find((u) => u.album.id === item.album.id)) {
                uniqueTracks.push(item);
              }
            }
          });
          if (tType === trackType.playlist) props.setUniqueTracks(uniqueTracks);
          uniqueTracks.forEach((item: any) => {
            const trackItem = tType === trackType.playlist ? item.track : item;
            fac.getColorAsync(trackItem.album.images[2].url).then((color) => {
              _tracks.push({
                id: trackItem.album.id,
                img: trackItem.album.images[2].url,
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
    let stateRes: string | undefined = '';
    if (window.location.hash.includes(constants.state_res)) {
      stateRes = window.location.hash
        .split(constants.state_res)
        .pop()
        ?.split('&')[0];
    }
    if (
      stateRes === localStorage.getItem('authState') &&
      window.location.hash.includes(constants.access_token)
    ) {
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
      fetchPlaylists(playlistType.public);
      fetchPlaylists(playlistType.personal);
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
                    fetchTracks(trackType.top, item.id);
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
        {isLoadMorePlaylists ? (
          <SwiperSlide
            className={`${classes.swiperSlide}`}
            onClick={() => fetchPlaylists(playlistType.personal)}
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
          onClick={() => fetchTracks(trackType.playlist, inputPlaylistId)}
        >
          Confirm
        </Button>
      </div>
    </>
  );
};
export default Playlist;
