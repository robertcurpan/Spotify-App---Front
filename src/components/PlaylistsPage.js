import React, { useEffect, useState } from 'react'
import './PlaylistsPage.css'
import jwt_decode from 'jwt-decode';
import PlaylistList from './PlaylistList';



function PlaylistsPage({token, roles, setPlaylistSongs, setPlaylistId, playlistsChanged, setPlaylistsChanged}) {

    const [playlists, setPlaylists] = useState();
    


    useEffect(() => {
        getPlaylists();
    }, [])

    useEffect(() => {
        getPlaylists();
        setPlaylistsChanged(false);
    }, [playlistsChanged])


    function getPlaylists() {
        let userId = jwt_decode(token).sub;
        let url = `http://localhost:8081/api/profiles/${userId}/playlists`;

        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            } else {
                // Treat exceptions
                return res.text().then( text => { throw new Error(text) } )
            }
        })
        .then(data => {
            setPlaylists(data._embedded.playlistList);
        })
        .catch(error => {
            // verificat 401, 403
            setPlaylists([]);
        });
    }


    return (
        <div className="PlaylistsPage">
            { playlists && <PlaylistList token={token} playlistList={playlists} setPlaylistSongs={setPlaylistSongs} setPlaylistId={setPlaylistId} roles={roles} setPlaylistsChanged={setPlaylistsChanged} /> }
        </div>
    )
}

export default PlaylistsPage