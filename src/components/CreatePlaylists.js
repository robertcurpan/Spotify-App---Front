import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePlaylists.css';
import Navbar from './Navbar';
import jwt_decode from 'jwt-decode';


function CreatePlaylists({token, nameOfUser}) {
    
    const [playlistName, setPlaylistName] = useState();
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    

    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        }
    }, [])


    function createNewPlaylist() {
        let userId = jwt_decode(token).sub;
        let url = `http://localhost:8081/api/profiles/${userId}/playlists`;
        let playlistBody = {
            playlistName: playlistName
        }

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(playlistBody)
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
            console.log(data);
            setSuccessMessage(true);
            setErrorMessage("");
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            setSuccessMessage(false);
            setErrorMessage(errorMessage);
        });
    }
    
    
    return (
        <div className="CreatePlaylists">
            <Navbar token={token} nameOfUser={nameOfUser} />

            <div className="createPlaylistDiv">
                <span className="title">Create Playlist</span>
                <br />
                <label>Playlist name:</label>
                <br />
                <input className="playlistInput" type="text" onChange={e => setPlaylistName(e.target.value)} />
                <br />
                <button className="submitPlaylist" onClick={createNewPlaylist} >Create Playlist</button>
            </div>

            { successMessage && successMessage === true && <p className="success">Created successfully!</p> }
            { errorMessage && errorMessage !== "" && <p className="error">{errorMessage}</p> }

        </div>
    )
}

export default CreatePlaylists;