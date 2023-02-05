import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PlaylistsPage from "./PlaylistsPage";
import jwt_decode from 'jwt-decode';


function Playlists({token, nameOfUser, setPlaylistSongs, setPlaylistId, playlistsChanged, setPlaylistsChanged}) {

    const [roles, setRoles] = useState();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        } else {
            setRoles(jwt_decode(token).roles);
        }
    }, [])


    function goToCreatePlaylists() {
        navigate("/create-playlists");
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


    return( token &&
        <div className="Playlists">
            <Navbar token={token} nameOfUser={nameOfUser} />
            { hasClientRole() && <button className="createNew" onClick={goToCreatePlaylists}>Create new playlists</button> }
            <h3 className="homeIntroMessage">Explore some playlists...</h3>
            <PlaylistsPage token={token} roles={roles} setPlaylistSongs={setPlaylistSongs} setPlaylistId={setPlaylistId} playlistsChanged={playlistsChanged} setPlaylistsChanged={setPlaylistsChanged} />
        </div>
    )
}

export default Playlists;