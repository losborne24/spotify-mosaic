import * as constants from '../constants';
import Button from '@material-ui/core/Button';
import spotifyMosaicImg from '../assets/spotify.png';
import ScrollContainer from 'react-indiana-drag-scroll';
import { makeStyles } from '@material-ui/core';

const ConnectToSpotify = (props: { authState: any }) => {
  const connectToSpotify = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${constants.client_id}&response_type=${constants.response_type}&scope=${constants.scopes}&state=${props.authState}&redirect_uri=${constants.redirect_uri}`;
  };
  const useStyles = makeStyles({
    scrollContainer: {
      maxHeight: '80%',
      maxWidth: '70%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spotifyImg: { height: '100vh', width: '100vh' },
    btnConnect: { margin: '2rem' },
  });
  const classes = useStyles();

  return (
    <>
      <h1>Spotify Mosaic</h1>
      <ScrollContainer className={classes.scrollContainer}>
        <img
          src={spotifyMosaicImg}
          className={classes.spotifyImg}
          alt="Spotify Mosaic"
        ></img>
      </ScrollContainer>

      <Button
        variant="contained"
        color="primary"
        onClick={connectToSpotify}
        className={classes.btnConnect}
      >
        Connect to Spotify
      </Button>
    </>
  );
};
export default ConnectToSpotify;
