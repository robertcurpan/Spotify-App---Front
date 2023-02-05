import Login from './components/Login';
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Home from 'components/Home';
import Account from 'components/Account';
import SongsArtists from 'components/SongsArtists';
import Playlists from 'components/Playlists';
import ManageUsers from 'components/ManageUsers';
import Register from 'components/Register';
import CreateSongsArtists from 'components/CreateSongsArtists';
import CreatePlaylists from 'components/CreatePlaylists';
import PlaylistSongPage from 'components/PlaylistSongPage';
import Unauthorized from 'components/Unauthorized';
import Forbidden from 'components/Forbidden';

function App() {

  const [token, setToken] = useState('');
  const [nameOfUser, setNameOfUser] = useState();
  const [globalErrorMessage, setGlobalErrorMessage] = useState();

  const [playlistsChanged, setPlaylistsChanged] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState();
  const [playlistId, setPlaylistId] = useState();


  return (
    <BrowserRouter>
      <div className="App">

        <main>
          <Routes>
            <Route path="/" element = { <Login setToken={setToken} setNameOfUser={setNameOfUser} /> } />
            <Route path="home" element = { <Home token={token} nameOfUser={nameOfUser} /> } />
            <Route path="profile" element = { <Account token={token} nameOfUser={nameOfUser} /> } />
            <Route path="songs-artists" element = { <SongsArtists token={token} nameOfUser={nameOfUser} setGlobalErrorMessage={setGlobalErrorMessage} /> } />
            <Route path="playlists" element = { <Playlists token={token} nameOfUser={nameOfUser} setPlaylistSongs={setPlaylistSongs} setPlaylistId={setPlaylistId} playlistsChanged={playlistsChanged} setPlaylistsChanged={setPlaylistsChanged} /> } />
            <Route path="manage-users" element = { <ManageUsers token={token} nameOfUser={nameOfUser} /> } />
            <Route path="register" element = { <Register /> } />
            <Route path="create-songs-artists" element = { <CreateSongsArtists token={token} nameOfUser={nameOfUser} /> } />
            <Route path="create-playlists" element = { <CreatePlaylists token={token} nameOfUser={nameOfUser} /> } />
            <Route path="playlist-song-page" element = { <PlaylistSongPage token={token} nameOfUser={nameOfUser} playlistSongs={playlistSongs} playlistId={playlistId} setPlaylistsChanged={setPlaylistsChanged} /> } />
            <Route path="unauthorized" element = { <Unauthorized globalErrorMessage={globalErrorMessage} /> } />
            <Route path="forbidden" element = { <Forbidden globalErrorMessage={globalErrorMessage} /> } />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
