import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Playlist from './components/select-playlist';
import { useState } from 'react';
import Mosaic from './components/mosaic';
import ConnectToSpotify from './components/connect-to-spotify';
import { makeStyles } from '@material-ui/core';
import SelectImage from './components/select-image';
const App = () => {
  const [imageSrc, setImageSrc] = useState<any>();
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([{ id: '', img: '', avgColour: null }]);
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
            <Playlist setToken={setToken} token={token} setTracks={setTracks} />
          </div>
        </Route>
        <Route path="/selectImage">
          <div className={classes.center}>
            <SelectImage createImg={(src: any) => createImg(src)} />
          </div>
        </Route>
        <Route path="/createMosaic">
          <Mosaic tracks={tracks} imageSrc={imageSrc} />
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
