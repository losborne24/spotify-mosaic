import Main from './components/main';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playlist from './components/select-playlist';
import { useState } from 'react';
import SelectImage from './components/select-image';
const App = () => {
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([{ id: '', img: '', avgColour: null }]);
  return (
    <Router>
      <Switch>
        <Route path="/playlists">
          <Playlist
            setTokenValue={setToken}
            token={token}
            setTracks={setTracks}
          />
        </Route>
        <Route path="/selectImage">
          <SelectImage tracks={tracks} />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
