import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import './CreateSongsArtists.css'
import Navbar from './Navbar';
import {v4 as uuidv4} from 'uuid';


function CreateSongsArtists({token, nameOfUser}) {

    const [name, setName] =  useState();
    const [genre, setGenre] = useState();
    const [releaseYear, setReleaseYear] = useState();
    const [songType, setSongType] = useState();
    const [artistName, setArtistName] = useState();
    const [active, setActive] = useState();
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const genreOptions = [
        { value: "POP", label: "POP" },
        { value: "ROCK", label: "ROCK" },
        { value: "HIPHOP", label: "HIPHOP" },
        { value: "HOUSE", label: "HOUSE" }
    ];

    const songTypeOptions = [
        { value: "ALBUM", label: "ALBUM" },
        { value: "SINGLE", label: "SINGLE" }
    ];

    const activeOptions = [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" }
    ]
    

    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        }
    }, [])


    function createNewSong() {
        if(name && genre && releaseYear && songType) {
            let url = "http://localhost:8080/api/songcollection/songs";
            let songBody = {
                name: name,
                genre: genre,
                releaseYear: releaseYear,
                songType: songType
            }

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(songBody)
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
    }

    function createNewArtist() {
        if(artistName && active) {
            let uuid = uuidv4();
            let url = `http://localhost:8080/api/songcollection/artists/${uuid}`;
            let artistBody = {
                artistName: artistName,
                active: active
            }
    
            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(artistBody)
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
    }


    return (
        <div className="CreateSongsArtists">
            <Navbar token={token} nameOfUser={nameOfUser} />

            <div className="formsContainer">
                <div className="song">
                    <span className="title">Create Song</span>
                    <br />
                    <label>Name:</label>
                    <br />
                    <input className="songInput" type="text" onChange={e => setName(e.target.value)} />
                    <br />
                    <label>Genre:</label>
                    <ReactSelect className="combobox" options={genreOptions} onChange={e => setGenre(e.value)} placeholder="Select genre" />
                    <br />
                    <label>Release year:</label>
                    <br />
                    <input className="songInput" type="number" onChange={e => setReleaseYear(e.target.value)} />
                    <br />
                    <label>Type:</label>
                    <ReactSelect className="combobox" options={songTypeOptions} onChange={e => setSongType(e.value)} placeholder="Select song type" />
                    <br />
                    <button className="submitSong" onClick={createNewSong} >Create Song</button>
                </div>

                <div className="artist">
                    <span className="title">Create Artist</span>
                    <br />
                    <label>Artist name:</label>
                    <br />
                    <input className="artistInput" type="text" onChange={e => setArtistName(e.target.value)} />
                    <br />
                    <label>Active:</label>
                    <ReactSelect className="combobox" options={activeOptions} onChange={e => setActive(e.value)} placeholder="Is artist active?" />
                    <br />
                    <button className="submitArtist" onClick={createNewArtist}>Create Artist</button>
                </div>
            </div>

            { successMessage && successMessage === true && <p className="success">Added successfully!</p> }
            { errorMessage && errorMessage !== "" && <p className="error">{errorMessage}</p> }
        </div>
    )
}

export default CreateSongsArtists;