import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Artist.css';
import jwt_decode from 'jwt-decode';




function Artist({token, artist, setArtistsChanged, setGlobalErrorMessage}) {

    const [errorMessage, setErrorMessage] = useState("");
    const [roles, setRoles] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        setRoles(jwt_decode(token).roles);
        setErrorMessage("");
    }, [])


    function deleteArtist() {
        let url = artist._links.removeArtist.href;

        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.ok) {
                setErrorMessage("");
                setArtistsChanged(true);
            } else {
                // Treat exceptions
                return res.text().then( text => { throw new Error(text) } )
            }
        })
        .catch(error => {
            let errorMessage = JSON.parse(error.message).message;
            setErrorMessage(errorMessage);

            let errorStatus = JSON.parse(error.message).status;
            setGlobalErrorMessage(errorMessage);
            if(errorStatus === "UNAUTHORIZED") {
                navigate("/unauthorized");
            } else if(errorStatus === "FORBIDDEN") {
                navigate("/forbidden");
            }
        });
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


    return (
        <div>
            <div className="Artist">
                <h4>{artist.artistName}</h4>
                <p>-- { artist.active === true ? "Active" : "Non-active" }</p>
                <hr />
                { hasContentManagerRole() && <button onClick={deleteArtist}>Delete</button> }
            </div>
            { errorMessage && errorMessage !== "" && <span className="error-msg">{errorMessage}</span> }
        </div>
        
        
    )
}

export default Artist;