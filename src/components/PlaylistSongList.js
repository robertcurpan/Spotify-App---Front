import React from 'react'
import PlaylistSong from './PlaylistSong'
import './PlaylistSongList.css'




function PlaylistSongList({token, playlistSongs, playlistId, roles, setPlaylistsChanged}) {
   
    

    return (
        <div className="PlaylistSongList">
            {
                playlistSongs && playlistSongs.length > 0 && playlistSongs.map((playlistSong) => (
                    <div>
                        <PlaylistSong token={token} playlistSong={playlistSong} playlistId={playlistId} roles={roles} setPlaylistsChanged={setPlaylistsChanged} />
                    </div>
                ))
            }
        </div>
    )
}

export default PlaylistSongList