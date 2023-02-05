import React, { useEffect } from 'react'
import { useState } from 'react'
import PlaylistSongList from './PlaylistSongList'
import './PlaylistSongPage.css'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'



function PlaylistSongPage({token, nameOfUser, playlistSongs, playlistId, setPlaylistsChanged}) {

    const [roles, setRoles] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        if(!token) {
            navigate("/");
        } else {
            setRoles(jwt_decode(token).roles);
        }
    }, [])


    return (
        <div className="PlaylistSongPage">
            <Navbar token={token} nameOfUser={nameOfUser} />
            { playlistSongs && <PlaylistSongList token={token} playlistSongs={playlistSongs} playlistId={playlistId} roles={roles} setPlaylistsChanged={setPlaylistsChanged} /> }
        </div>
    )
}

export default PlaylistSongPage