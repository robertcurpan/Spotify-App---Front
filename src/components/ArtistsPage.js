import React, { useEffect, useState } from 'react';
import ArtistList from './ArtistList';
import './ArtistsPage.css';



function ArtistsPage({token, setShouldRefreshSongs, setGlobalErrorMessage}) {

    const [artists, setArtists] = useState();
    const [artistsChanged, setArtistsChanged] = useState(false);


    useEffect(() => {
        getAllArtists();
    }, [])

    useEffect(() => {
        getAllArtists();
        setArtistsChanged(false);
        setShouldRefreshSongs(true);
    }, [artistsChanged])


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
            setArtists(data._embedded.artistDTOList);
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            console.log(errorMessage);
            setArtists(null);
        });
    }


    return (
        <div className="ArtistsPage">
            <button className="getArtistsButton" onClick={getAllArtists}>Get all artists</button>
            <ArtistList token={token} artists={artists} setArtistsChanged={setArtistsChanged} setGlobalErrorMessage={setGlobalErrorMessage} />
        </div>
    )
}

export default ArtistsPage;