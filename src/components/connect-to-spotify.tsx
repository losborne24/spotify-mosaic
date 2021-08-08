import { useState } from 'react';
import * as constants from '../constants';
import Button from '@material-ui/core/Button';

// const axios = require('axios');

const ConnectToSpotify = () => {
  const [authState, setAuthState] = useState(
    Math.floor(Math.random() * 10000000)
  );

  const connectToSpotify = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${constants.client_id}&redirect_uri=${constants.redirect_uri}&response_type=${constants.response_type}&scope=${constants.scopes}&state=${authState}`;

    setAuthState(Math.floor(Math.random() * 10000000));
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={connectToSpotify}>
        Connect to Spotify
      </Button>
    </>
  );
};
export default ConnectToSpotify;
