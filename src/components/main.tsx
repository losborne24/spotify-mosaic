import { useState } from 'react';
import * as constants from '../constants';
import Button from './button';

// const axios = require('axios');

const Main = () => {
  const [authState, setAuthState] = useState(
    Math.floor(Math.random() * 10000000)
  );

  const connectWithSpotify = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${constants.client_id}&redirect_uri=${constants.redirect_uri}&response_type=${constants.response_type}&state=${authState}`;

    setAuthState(Math.floor(Math.random() * 10000000));
  };
  return (
    <>
      <Button name="Connect with Spotify" onClick={connectWithSpotify}></Button>
    </>
  );
};
export default Main;
