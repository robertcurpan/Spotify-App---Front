import React from 'react';
import Artist from './Artist';
import './ArtistList.css';



function ArtistList({token, artists, setArtistsChanged, setGlobalErrorMessage}) {



    return (
        <div className="ArtistList">
            {
                artists && artists.length > 0 && artists.map((artist) => (
                    <div>
                        <Artist token={token} artist={artist} setArtistsChanged={setArtistsChanged} setGlobalErrorMessage={setGlobalErrorMessage} />
                    </div>
                ))
            }
        </div>
    )
}

export default ArtistList;