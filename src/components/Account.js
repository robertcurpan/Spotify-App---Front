import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import decode_jwt from 'jwt-decode'
import './Account.css';
import { useNavigate } from "react-router-dom";


function Account({token, nameOfUser}) {

    const [roles, setRoles] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        }
    }, []) 

    useEffect(() => {
        if(token) {
            var decodedJws = decode_jwt(token);
            setRoles(decodedJws.roles);
        }
    }, [token])


    return( token &&
        <div className="Account">
            <Navbar token={token} nameOfUser={nameOfUser} />
            <div className="userInfo">
                <label>Your name is:</label>
                <span>{nameOfUser}</span>
                <br />
                <label>Your roles are: </label>
                { roles && roles.map((value, index) => index == roles.length - 1 ? <span key={index}>{value}</span> : <span key={index}>{value},</span>) }
            </div>
        </div>
    )
}

export default Account;