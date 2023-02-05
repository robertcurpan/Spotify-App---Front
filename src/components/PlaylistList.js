import React from 'react'
import Playlist from './Playlist'
import './PlaylistList.css'


function PlaylistList({token, playlistList, setPlaylistSongs, setPlaylistId, roles, setPlaylistsChanged}) {



    
    return (
        <div className="PlaylistList">
            {
                playlistList && playlistList.length > 0 && playlistList.map((playlist) => (
                    <div>
                        <Playlist token={token} playlist={playlist} setPlaylistSongs={setPlaylistSongs} setPlaylistId={setPlaylistId} roles={roles} setPlaylistsChanged={setPlaylistsChanged} />
                    </div>
                ))
            }
        </div>
    )
}

export default PlaylistList