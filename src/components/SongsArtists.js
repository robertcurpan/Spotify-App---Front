import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SongsPage from "./SongsPage";
import './SongsArtists.css';
import jwt_decode from 'jwt-decode';
import ArtistsPage from "./ArtistsPage";


function SongsArtists({token, nameOfUser, setGlobalErrorMessage}) {

    const [roles, setRoles] = useState();
    const [shouldRefreshSongs, setShouldRefreshSongs] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        }
    }, [])

    useEffect(() => {
        if(token) {
            setRoles(jwt_decode(token).roles);
        }
    }, [token])


    function goToCreateSongsArtists() {
        navigate("/create-songs-artists");
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


    return( token &&
        <div className="SongsArtists">
            <Navbar token={token} nameOfUser={nameOfUser} />
            { hasContentManagerRole() && <button className="createNew" onClick={goToCreateSongsArtists}>Create new songs/artists</button> }
            <h3 className="homeIntroMessage">Explore some songs...</h3>
            <SongsPage token={token} roles={roles} shouldRefreshSongs={shouldRefreshSongs} setShouldRefreshSongs={setShouldRefreshSongs} setGlobalErrorMessage={setGlobalErrorMessage} />
            <h3 className="homeIntroMessage">Explore some artists...</h3>
            <ArtistsPage token={token} setShouldRefreshSongs={setShouldRefreshSongs} setGlobalErrorMessage={setGlobalErrorMessage} />
        </div>
    )
}

export default SongsArtists;