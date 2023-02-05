import React, { useEffect, useState } from "react";
import './Song.css';
import jwt_decode from 'jwt-decode';
import ReactSelect from "react-select";


function Song({token, song, roles, userPlaylists, setSongsChanged}) {

    const [artists, setArtists] = useState();
    const [albums, setAlbums] = useState();
    const [albumOfCurrentSong, setAlbumOfCurrentSong] = useState();
    const [assignToAlbumPopup, setAssignToAlbumPopup] = useState(false);
    const [assignToArtistPopup, setAssignToArtistPopup] = useState(false);
    const [removeFromArtistPopup, setRemoveFromArtistPopup] = useState(false);
    const [addSongToPlaylistPopup, setAddSongToPlaylistPopup] = useState(false);
    const [assignToArtistError, setAssignToArtistError] = useState("");
    const [removeFromArtistError, setRemoveFromArtistError] = useState("");
    const [assignToAlbumError, setAssignToAlbumError] = useState("");
    const [removeSongFromAlbumError, setRemoveSongFromAlbumError] = useState("");
    const [deleteSongError, setDeleteSongError] = useState("");
    const [addToPlaylistError, setAddToPlaylistError] = useState("");
    const [selectedArtist, setSelectedArtist] = useState(); 
    const [selectedAlbum, setSelectedAlbum] = useState();
    const [selectedPlaylist, setSelectedPlaylist] = useState();
    const [currentSongArtists, setCurrentSongArtists] = useState();
    const [addSongToPlaylistSuccess, setAddSongToPlaylistSuccess] = useState(false);


    useEffect(() => {
        getAllArtists();
        getAllAlbums();
        getAlbumOfCurrentSong();
    }, [])


    function getAlbumOfCurrentSong() {
        if(song.albumId) {
            let url = "http://localhost:8080/api/songcollection/songs/" + song.albumId;

            fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
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
                setAlbumOfCurrentSong(data);
            })
            .catch(error => {
                let errorMessage = JSON.parse(error.message).message;
            });
        }
    }


    function deleteSong() {
        // Trebuie sa apelez si metoda de scoatere a melodiei din playlisturi
        let url = song._links.removeSong.href;

        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.ok) {
                setSongsChanged(true);
                return res.json();
            } else {
                // Treat exceptions
                return res.text().then( text => { throw new Error(text) } )
            }
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            setDeleteSongError(errorMessage);
        });
    }


    function removeSongFromAlbum() {
        let url = "http://localhost:8080/api/songcollection/songs/" + song.songId + "/album";

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.ok) {
                setSongsChanged(true);
                setAlbumOfCurrentSong(null);
                return res.json();
            } else {
                // Treat exceptions
                return res.text().then( text => { throw new Error(text) } )
            }
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            setRemoveSongFromAlbumError(errorMessage);
        });
    }


    function getAllAlbums() {
        let url = "http://localhost:8080/api/songcollection/songs/albums";

        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
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
            let allAlbums = data._embedded.songDTOList;
            let albumsOptions = [];
            for(let album of allAlbums) {
                let albumObject = { value: album, label: album.name };
                albumsOptions.push(albumObject);
            }
            setAlbums(albumsOptions);
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
        });
    }


    function getAllArtists() {
        let url = "http://localhost:8080/api/songcollection/artists";

        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
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
            let allArtists = data._embedded.artistDTOList;
            let artistsOptions = [];
            for(let artist of allArtists) {
                let artistObject = { value: artist, label: artist.artistName };
                artistsOptions.push(artistObject);
            }
            setArtists(artistsOptions);
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
        });
    }


    function toggleAssignToAlbumPopup() {
        setAssignToAlbumPopup(!assignToAlbumPopup);
        setAssignToAlbumError("");
        setSelectedAlbum(null);
        getAlbumOfCurrentSong();
    }


    function assignSongToAlbum() {
        if(selectedAlbum) {
            let  url = "http://localhost:8080/api/songcollection/songs/" + song.songId + "/album/" + selectedAlbum.songId;

            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(res => {
                if(res.ok) {
                    setSongsChanged(true);
                    return res.json();
                } else {
                    // Treat exceptions
                    return res.text().then( text => { throw new Error(text) } )
                }
            })
            .catch(error => {
                let errorMessage = JSON.parse(error.message).message;
                setAssignToAlbumError(errorMessage);
            });
        }
    }


    function toggleAssignToArtistPopup() {
        setAssignToArtistPopup(!assignToArtistPopup);
        setAssignToArtistError("");
        setSelectedArtist(null);
    }


    function assignSongToArtist() {
        if(selectedArtist) {
            let url = "http://localhost:8080/api/songcollection/artists/" + selectedArtist.artistId + "/songs/" + song.songId;

            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(res => {
                if(res.ok) {
                    setSongsChanged(true);
                    return res.json();
                } else {
                    // Treat exceptions
                    return res.text().then( text => { throw new Error(text) } )
                }
            })
            .catch(error => {
                let errorMessage = JSON.parse(error.message).message;
                setAssignToArtistError(errorMessage);
            });
        }
    }


    function toggleRemoveFromArtistPopup() {
        let artistsOfCurrentSong = [];
        if(song.artistsOfSong) {
            for (let artist of song.artistsOfSong) {
                let artistObject = { value: artist, label: artist.artistName };
                artistsOfCurrentSong.push(artistObject);
            }
        }
        setCurrentSongArtists(artistsOfCurrentSong)
        
        setRemoveFromArtistPopup(!removeFromArtistPopup);
        setRemoveFromArtistError("");
        setSelectedArtist(null);
    }


    function removeSongFromArtist() {
        if(selectedArtist) {
            let url = "http://localhost:8080/api/songcollection/artists/" + selectedArtist.artistId + "/songs/" + song.songId;

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(res => {
                if(res.ok) {
                    setSongsChanged(true);
                    return res.json();
                } else {
                    // Treat exceptions
                    return res.text().then( text => { throw new Error(text) } )
                }
            })
            .catch(error => {
                let errorMessage = JSON.parse(error.message).message;
                setRemoveFromArtistError(errorMessage);
            });
        }
    }

    function toggleAddSongToPlaylistPopup() {
        setAddSongToPlaylistPopup(!addSongToPlaylistPopup);
        setSelectedPlaylist(null);
        setAddSongToPlaylistSuccess(false);
        setAddToPlaylistError("");
    }


    function addSongToPlaylist() {
        let usedId = jwt_decode(token).sub;
        if(selectedPlaylist) {
            let url = `http://localhost:8081/api/profiles/${usedId}/playlists/${selectedPlaylist.playlistId}/songs/${song.songId}`;

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(res => {
                if(res.ok) {
                    setAddSongToPlaylistSuccess(true);
                    setAddToPlaylistError("");
                    return res.json();
                } else {
                    // Treat exceptions
                    return res.text().then( text => { throw new Error(text) } )
                }
            })
            .catch(error => {
                let errorMessage = JSON.parse(error.message).message;
                setAddSongToPlaylistSuccess(false);
                setAddToPlaylistError(errorMessage);
            });
        }
    }


    function hasContentManagerRole() {
        if(roles) {
            for(let role of roles) {
                if(role === 'content_manager') {
                    return true;
                }
            }
        }
        return false;
    }


    function hasArtistRoleAndOwnsTheSong() {
        let username = jwt_decode(token).name;

        if(roles) {
            for(let role of roles) {
                if(role === 'artist' && song.artistsOfSong) {
                    for(let artist of song.artistsOfSong) {
                        if(artist.artistName === username) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    function setDefaultRemoveSongFromAlbumError() {
        setRemoveSongFromAlbumError("");
    }

    function setDefaultDeleteSongError() {
        setDeleteSongError("");
    }


    return(
        <div className="Song">
            <h4>{song.name}</h4>
            { song.artistsOfSong && song.artistsOfSong.length > 0 && song.artistsOfSong.map((artist, index) => (
                        index == song.artistsOfSong.length - 1 ? <span key={index}>- {artist.artistName}</span> : <span key={index}>- {artist.artistName}<br /></span>
                        ))
            }
            <hr />
            <p>-- {song.songType}</p>
            <p>Genre: {song.genre}</p>
            <p>Release year: {song.releaseYear}</p>
            <p>Album: {albumOfCurrentSong && <span>{albumOfCurrentSong.name}</span>}</p>
            <p><button onClick={toggleAddSongToPlaylistPopup}>Add to playlist</button></p>
            { (hasContentManagerRole() || hasArtistRoleAndOwnsTheSong()) && <p><button onClick={deleteSong}>Delete</button></p> }
            { hasContentManagerRole() && <p><button onClick={toggleAssignToAlbumPopup}>Assign to album</button></p> }
            { hasContentManagerRole() && <p><button onClick={removeSongFromAlbum}>Remove from album</button></p> }
            { hasContentManagerRole() && <p><button onClick={toggleAssignToArtistPopup}>Assign to artist</button></p> }
            { hasContentManagerRole() && <p><button onClick={toggleRemoveFromArtistPopup}>Remove from artist</button></p> }

            { assignToArtistPopup && 
                <div className="popup">
                    <div className="popup-content">
                        <h3>Select an artist to assign the song to</h3>
                        <ReactSelect options={artists} onChange={e => setSelectedArtist(e.value)} placeholder="Select artist" />
                        <button className="popupButton" onClick={toggleAssignToArtistPopup}>Close</button>
                        { assignToArtistError && assignToArtistError !== "" && <span className="errorMsg">{assignToArtistError}</span>}
                        <button className="finishButton" onClick={assignSongToArtist}>Assign to artist</button>
                    </div>
                </div>
            }

            { removeFromArtistPopup && 
                <div className="popup">
                    <div className="popup-content">
                        <h3>Select an artist to remove the song from</h3>
                        <ReactSelect options={currentSongArtists} onChange={e => setSelectedArtist(e.value)} placeholder="Select artist" />
                        <button className="popupButton" onClick={toggleRemoveFromArtistPopup}>Close</button>
                        { removeFromArtistError && removeFromArtistError !== "" && <span className="errorMsg">{removeFromArtistError}</span>}
                        <button className="finishButton" onClick={removeSongFromArtist}>Remove from artist</button>
                    </div>
                </div>
            }

            { assignToAlbumPopup && 
                <div className="popup">
                    <div className="popup-content">
                        <h3>Select an album to assign the song to</h3>
                        <ReactSelect options={albums} onChange={e => setSelectedAlbum(e.value)} placeholder="Select album" />
                        <button className="popupButton" onClick={toggleAssignToAlbumPopup}>Close</button>
                        { assignToAlbumError && assignToAlbumError !== "" && <span className="errorMsg">{assignToAlbumError}</span>}
                        <button className="finishButton" onClick={assignSongToAlbum}>Assign to album</button>
                    </div>
                </div>
            }

            { removeSongFromAlbumError && removeSongFromAlbumError !== "" &&
                <div className="popup">
                    <div className="popup-content">
                        <button className="popupButton" onClick={setDefaultRemoveSongFromAlbumError}>Close</button>
                        <span className="errorMsg">{removeSongFromAlbumError}</span>
                    </div>
                </div>
            }

            { deleteSongError && deleteSongError !== "" &&
                <div className="popup">
                    <div className="popup-content">
                        <button className="popupButton" onClick={setDefaultDeleteSongError}>Close</button>
                        <span className="errorMsg">{deleteSongError}</span>
                    </div>
                </div>
            }

            { addSongToPlaylistPopup && 
                <div className="popup">
                    <div className="popup-content">
                        <h3>Select a playlist to add the song to</h3>
                        <ReactSelect options={userPlaylists} onChange={e => setSelectedPlaylist(e.value)} placeholder="Select playlist" />
                        <button className="popupButton" onClick={toggleAddSongToPlaylistPopup}>Close</button>
                        { addToPlaylistError && addToPlaylistError !== "" && <span className="errorMsg">{addToPlaylistError}</span>}
                        { addSongToPlaylistSuccess && <p className="successMsg">Added successfully!</p> }
                        <button className="finishButton" onClick={addSongToPlaylist}>Add to playlist</button>
                    </div>
                </div>
            }

        </div>
    )
}

export default Song;

/*
{
    "songId": 1,
    "name": "Acapulco",
    "genre": "POP",
    "releaseYear": 2021,
    "songType": "SONG",
    "albumId": null,
    "artistsOfSong": [
        {
            "name": "Jason Derulo"
        }  
    ]
}
*/