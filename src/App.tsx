import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playlist from './components/select-playlist';
import { useState } from 'react';
import SelectImage from './components/select-image';
import ConnectToSpotify from './components/connect-to-spotify';
import { makeStyles } from '@material-ui/core';
const App = () => {
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([{ id: '', img: '', avgColour: null }]);
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
    <Router>
      <Switch>
        <Route path="/playlists">
          <div className={classes.center}>
            <Playlist setToken={setToken} token={token} setTracks={setTracks} />
          </div>
        </Route>
        <Route path="/selectImage">
          <SelectImage tracks={tracks} />
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
