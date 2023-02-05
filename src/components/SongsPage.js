import React, { useEffect, useState } from "react";
import SongList from "./SongList";
import './SongsPage.css';
import jwt_decode from 'jwt-decode';


function SongsPage({token, roles, shouldRefreshSongs, setShouldRefreshSongs, setGlobalErrorMessage}) {

    // Props
    const [currentLinks, setCurrentLinks] = useState();
    const [songs, setSongs] = useState();
    const [title, setTitle] = useState();
    const [genre, setGenre] = useState();
    const [year, setYear] = useState();
    const [songsChanged, setSongsChanged] = useState(false);
    const [songsNotFoundPopup, setSongsNotFoundPopup] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState();


    useEffect(() => {
        getAllSongs();
        getUserPlaylists();
        setGenre("POP");
    }, [])

    useEffect(() => {
        getAllSongs();
        setSongsChanged(false);
    }, [songsChanged])

    useEffect(() => {
        getAllSongs();
        setShouldRefreshSongs(false);
    }, [shouldRefreshSongs])


    function getUserPlaylists() {
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
            let playlistsList = data._embedded.playlistList;
            let playlistsOptions = [];
            for(let playlist of playlistsList) {
                let playlistObject = {value: playlist, label: playlist.playlistName};
                playlistsOptions.push(playlistObject);
            }
            setUserPlaylists(playlistsOptions);
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
        });
    }
    
    function getAllSongs() {
        var requestUrl = "http://localhost:8080/api/songcollection/songs"
        retrieveSongs(requestUrl);
    }

    function getSongsByTitle() {
        if(title && title !== "") {
            var requestUrl = "http://localhost:8080/api/songcollection/songs?title=" + title + "&match=exact";
            retrieveSongs(requestUrl);
        }
    }

    function getSongsByGenre() {
        if(genre && genre !== "") {
            var requestUrl = "http://localhost:8080/api/songcollection/songs?genre=" + genre;
            retrieveSongs(requestUrl);
        }
    }

    function getSongsByYear() {
        if(year && year !== "") {
            var requestUrl = "http://localhost:8080/api/songcollection/songs?releaseYear=" + year;
            retrieveSongs(requestUrl);
        }
    }

    function prevPage() {
        var prevPageRequestUrl = currentLinks.prevPage.href;
        retrieveSongs(prevPageRequestUrl);
    }

    function nextPage() {
        var nextPageRequestUrl = currentLinks.nextPage.href;
        retrieveSongs(nextPageRequestUrl);
    }

    function retrieveSongs(requestUrl) {
        var xhr = new XMLHttpRequest();
    
        xhr.open('GET', requestUrl);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var response = xhr.response;
                    var jsonResponse = JSON.parse(response);
                    setCurrentLinks(jsonResponse._links);
                    setSongs(jsonResponse._embedded.songDTOList);
                } else if(xhr.status === 404) {
                    setSongs([]);
                    toggleSongsNotFoundPopup();
                }
            }
        }
        xhr.send();
    }

    function toggleSongsNotFoundPopup() {
        setSongsNotFoundPopup(!songsNotFoundPopup);
    }


    return(
        <div className="SongsPage">
            <hr />
            <div className="searchContainer">
                <div className="searchItem">
                    <button className="searchButton" onClick={getAllSongs}>Get all songs</button>
                </div>
                <div className="searchItem">
                    <input className="searchInput" type="text" id="searchByTitleInput" placeholder="Song title..."
                            onChange={event => setTitle(event.target.value)}/>
                    <button className="searchButton" onClick={getSongsByTitle}>Get songs by title</button>
                </div>
                <div className="searchItem">
                    <select className="searchInput" id="searchByGenreInput" onChange={event => setGenre(event.target.value)}>
                        <option value="POP">POP</option>
                        <option value="ROCK">ROCK</option>
                        <option value="HIPHOP">HIPHOP</option>
                        <option value="HOUSE">HOUSE</option>
                    </select>
                    <button className="searchButton" onClick={getSongsByGenre}>Get songs by genre</button>
                </div>
                <div className="searchItem">
                    <input className="searchInput" type="number" id="searchByYearInput" placeholder="Song release year..."
                            onChange={event => setYear(event.target.value)}/>
                    <button className="searchButton" onClick={getSongsByYear}>Get songs by year</button>
                </div>
            </div>
            <hr />
            <SongList token={token} songList={songs} roles={roles} userPlaylists={userPlaylists} setSongsChanged={setSongsChanged} />
            <br />
            <div className="pageButtonsContainer">
                {
                    currentLinks && currentLinks.prevPage && <button className="pageButton left" onClick={prevPage}>Prev Page</button>
                }
                {
                    currentLinks && currentLinks.nextPage && <button className="pageButton right" onClick={nextPage}>Next Page</button>
                }
            </div>

            { songsNotFoundPopup && 
                <div className="popup">
                    <div className="popup-content">
                        <h3>Songs not found!</h3>
                        <button className="popupButton" onClick={toggleSongsNotFoundPopup}>Close</button>
                    </div>
                </div>
            }

        </div>
    )
}

export default SongsPage;