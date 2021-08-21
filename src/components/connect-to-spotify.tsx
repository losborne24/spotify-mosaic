import { useState } from 'react';
import * as constants from '../constants';
import Button from '@material-ui/core/Button';
import spotifyMosaicImg from '../assets/spotify.png';
import ScrollContainer from 'react-indiana-drag-scroll';
import { makeStyles } from '@material-ui/core';

// const axios = require('axios');

const ConnectToSpotify = () => {
  const [authState, setAuthState] = useState(
    Math.floor(Math.random() * 10000000)
  );

  const connectToSpotify = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${constants.client_id}&response_type=${constants.response_type}&scope=${constants.scopes}&state=${authState}&redirect_uri=${constants.redirect_uri}`;

    setAuthState(Math.floor(Math.random() * 10000000));
  };
  const useStyles = makeStyles({
    scrollContainer: {
      maxHeight: '80%',
      maxWidth: '80%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spotifyImg: { height: '100vh', width: '100vh' },
  });
  const classes = useStyles();

  return (
    <>
      <ScrollContainer className={classes.scrollContainer}>
        <img src={spotifyMosaicImg} className={classes.spotifyImg}></img>
      </ScrollContainer>

      <h1>Spotify Mosaic</h1>
      <Button variant="contained" color="primary" onClick={connectToSpotify}>
        Connect to Spotify
      </Button>
    </>
  );
};
export default ConnectToSpotify;
