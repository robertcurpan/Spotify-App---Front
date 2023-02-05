import React, { useEffect, useState } from 'react'
import './PlaylistSong.css'
import jwt_decode from 'jwt-decode'




function PlaylistSong({token, playlistSong, playlistId, roles, setPlaylistsChanged}) {

    const [removeSongFromPlaylistError, setRemoveSongFromPlaylistError] = useState("");


    function removeSongFromPlaylist() {
        let userId = jwt_decode(token).sub;
        let url = `http://localhost:8081/api/profiles/${userId}/playlists/${playlistId}/${playlistSong.songId}`;

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.ok) {
                setPlaylistsChanged(true);
                return res.json();
            } else {
                // Treat exceptions
                return res.text().then( text => { throw new Error(text) } )
            }
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            setRemoveSongFromPlaylistError(errorMessage);
        });
    }

    function setDefaultRemoveSongFromPlaylistError() {
        setRemoveSongFromPlaylistError("");
    }


    return (
        <div className="PlaylistSong">
            <h4>{playlistSong.name}</h4>
            { playlistSong.artistsOfSong && playlistSong.artistsOfSong.length > 0 && playlistSong.artistsOfSong.map((artist, index) => (
                        index == playlistSong.artistsOfSong.length - 1 ? <span key={index}>- {artist.artistName}</span> : <span key={index}>- {artist.artistName}<br /></span>
                        ))
            }
            <hr />
            <button onClick={removeSongFromPlaylist}>Remove from playlist</button><br />

            { removeSongFromPlaylistError && removeSongFromPlaylistError !== "" &&
                <div className="popup">
                    <div className="popup-content">
                        <button className="popupButton" onClick={setDefaultRemoveSongFromPlaylistError}>Close</button>
                        <span className="errorMsg">{removeSongFromPlaylistError}</span>
                    </div>
                </div>
            }
            
        </div>
    )
}

export default PlaylistSong