import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Playlist from './components/select-playlist';
import { useEffect, useState } from 'react';
import Mosaic from './components/mosaic';
import ConnectToSpotify from './components/connect-to-spotify';
import { makeStyles } from '@material-ui/core';
import SelectImage from './components/select-image';
import * as constants from './constants';
import ReactGA from 'react-ga4';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
history.listen((location) => {
  console.log(location);
  ReactGA.send(location);
});
const App = () => {
  const [imageSrc, setImageSrc] = useState<any>();
  const [fetchMoreUrl, setFetchMoreUrl] = useState<string | null>(null);
  const [uniqueTracks, setUniqueTracks] = useState<any[]>([]);
  const [token, setToken] = useState<string>('');
  const [tracks, setTracks] = useState<any[]>([
    { id: '', img: '', avgColour: null },
  ]);
  const [returnToMosaic, setReturnToMosaic] = useState<boolean>(false);

  const createImg = (imageSrc: any) => {
    setImageSrc(imageSrc);
  };
  useEffect(() => {
    ReactGA.initialize('G-JQQCW8E695');
  }, []);
  const useStyles = makeStyles({
    center: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
  });
  const classes = useStyles();
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path={constants.select_playlist_url}>
          <div className={classes.center}>
            <Playlist
              setToken={setToken}
              token={token}
              setTracks={setTracks}
              returnToMosaic={returnToMosaic}
              setFetchMoreUrl={setFetchMoreUrl}
              setUniqueTracks={setUniqueTracks}
            />
          </div>
        </Route>
        <Route path="/:access_token(access_token=.*)">
          <div className={classes.center}>
            <Playlist
              setToken={setToken}
              token={token}
              setTracks={setTracks}
              returnToMosaic={returnToMosaic}
              setFetchMoreUrl={setFetchMoreUrl}
              setUniqueTracks={setUniqueTracks}
            />
          </div>
        </Route>
        <Route path={constants.select_image_url}>
          <div className={classes.center}>
            <SelectImage createImg={(src: any) => createImg(src)} />
          </div>
        </Route>
        <Route path={constants.create_mosaic_url}>
          <Mosaic
            fetchMoreUrl={fetchMoreUrl}
            setFetchMoreUrl={setFetchMoreUrl}
            token={token}
            tracks={tracks}
            imageSrc={imageSrc}
            setReturnToMosaic={setReturnToMosaic}
            setUniqueTracks={setUniqueTracks}
            uniqueTracks={uniqueTracks}
            setTracks={setTracks}
          />
        </Route>
        <Route path="/">
          <div className={classes.center}>
            <ConnectToSpotify />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
