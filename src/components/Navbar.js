import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import jwt_decode from 'jwt-decode'


function Navbar({token, nameOfUser}) {

    // Props
    const [roles, setRoles] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if(token) {
            setRoles(jwt_decode(token).roles);
        }
    }, [token])

    function logout() {
        navigate("/");
        // set token to null
    }

    function hasAdminRole() {
        if(roles) {
            for(let role of roles) {
                if(role === 'administrator_aplicatie') {
                    return true;
                }
            }
        }
        return false;
    }


    return( token &&
        <div className="Navbar">
            <button onClick={() => navigate("/home")}>Home</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => navigate("/songs-artists")}>Songs&Artists</button>
            <button onClick={() => navigate("/playlists")}>Playlists</button>
            { hasAdminRole() && <button onClick={() => navigate("/manage-users")}>Manage Users</button> }

            <button onClick={logout}>Logout</button>
            <div className="loggedInMessage">Welcome, <span className="navbarUsername">{nameOfUser}</span></div>
        </div>
    )
}

export default Navbar;