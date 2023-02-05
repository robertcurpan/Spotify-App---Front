import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { getSoapLoginRequest } from 'utils/SoapUtil';
import jwt_decode from 'jwt-decode'


function Login({setToken, setNameOfUser}) {

    // Props
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();

        var soapLoginRequest = getSoapLoginRequest(username, password);
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000"

        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var XMLParser = require('react-xml-parser');
                    var xmlResponse = new XMLParser().parseFromString(xhr.response);
                    const jws = xmlResponse.getElementsByTagName('tns:loginResult')[0].value;
                    setToken(jws);
                    setNameOfUser(jwt_decode(jws).name);
                    navigate("/home");
                } else {
                    console.log("ERROR - " + xhr.response);
                }
            }
        }

        xhr.send(soapLoginRequest);
    }

    function registerNewUser() {
        navigate("/register");
    }


    return(
        <div className="Login">
            <h1 className="center">Welcome to Spotify!</h1>

            <form onSubmit={login}>
                <div className="center">
                    <input type="text" id="user" placeholder="Username" onChange={ e => setUsername(e.target.value)} className="inputTextBox" />
                    <br />
                    <input type="password" id="pass" placeholder="Password" onChange={ e => setPassword(e.target.value)} className="inputTextBox" />
                    <br />
                    <input type="submit" value="Login" className="loginButton" />
                    <button className="loginButton" onClick={registerNewUser}>Register</button>
                </div>
            </form>
        </div>
    )
}

export default Login;