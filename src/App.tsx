import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Playlist from './components/select-playlist';
import { useState } from 'react';
import Mosaic from './components/mosaic';
import ConnectToSpotify from './components/connect-to-spotify';
import { makeStyles } from '@material-ui/core';
import SelectImage from './components/select-image';

const App = () => {
  const [authState, setAuthState] = useState(
    Math.floor(Math.random() * 10000000)
  );
  const [imageSrc, setImageSrc] = useState<any>();
  const [fetchMoreUrl, setFetchMoreUrl] = useState<string | null>(null);
  const [uniqueTracks, setUniqueTracks] = useState<any[]>([]);
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([{ id: '', img: '', avgColour: null }]);
  const [returnToMosaic, setReturnToMosaic] = useState<boolean>(false);

  const createImg = (imageSrc: any) => {
    setImageSrc(imageSrc);
  };
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
        <Route path="/playlists">
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
        <Route path="/selectImage">
          <div className={classes.center}>
            <SelectImage createImg={(src: any) => createImg(src)} />
          </div>
        </Route>
        <Route path="/createMosaic">
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
            <ConnectToSpotify authState={authState} />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
