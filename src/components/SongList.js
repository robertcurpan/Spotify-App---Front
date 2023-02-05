import React from "react";
import Song from "./Song";
import './SongList.css';


function SongList({token, songList, roles, userPlaylists, setSongsChanged}) {

    // Props

    return(
        <div className="SongList">
            {
                songList && songList.length > 0 && songList.map((song) => (
                    <div>
                        <Song token={token} song={song} roles={roles} userPlaylists={userPlaylists} setSongsChanged={setSongsChanged} />
                    </div>
                ))
            }
        </div>
    )
}

export default SongList;