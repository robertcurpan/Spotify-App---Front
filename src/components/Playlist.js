import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Playlist.css'
import PlaylistSongList from './PlaylistSongList';



function Playlist({token, playlist, setPlaylistSongs, setPlaylistId, roles, setPlaylistsChanged}) {

    const [deletePlaylistError, setDeletePlaylistError] = useState("");
    const navigate = useNavigate();
    

    function openPlaylist() {
        setPlaylistId(playlist.playlistId);
        setPlaylistSongs(playlist.playlistSongs);
        navigate("/playlist-song-page")
    }

    function deletePlaylist() {
        let url = playlist._links.removePlaylist.href;

        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.ok) {
                setPlaylistsChanged(true);
            } else {
                // Treat exceptions
                return res.text().then( text => { throw new Error(text) } )
            }
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            setDeletePlaylistError(errorMessage);
        });
    }

    function hasClientRole() {
        if(roles) {
            for(let role of roles) {
                if(role === 'client') {
                    return true;
                }
            }
        }
        return false;
    }

    function setDefaultDeletePlaylistError() {
        setDeletePlaylistError("");
    }

    
    return (
        <div>
            <div className="Playlist">
            <h4>{playlist.playlistName}</h4>
            <p>--&gt; {playlist.playlistSongs.length} songs</p>
            { hasClientRole() && <p><button onClick={openPlaylist}>Open</button></p> }
            { hasClientRole() && <p><button onClick={deletePlaylist}>Delete</button></p> }

            { deletePlaylistError && deletePlaylistError !== "" &&
                <div className="popup">
                    <div className="popup-content">
                        <button className="popupButton" onClick={setDefaultDeletePlaylistError}>Close</button>
                        <span className="errorMsg">{deletePlaylistError}</span>
                    </div>
                </div>
            }

            </div>
        </div>
        
    )
}

export default Playlist