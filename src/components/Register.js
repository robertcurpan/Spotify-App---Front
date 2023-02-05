import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getSoapRegisterRequest } from 'utils/SoapUtil';
import './Register.css'


function Register() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [successful, setSuccessful] = useState(false);
    const navigate = useNavigate();

    function register(event) {
        event.preventDefault();

        var soapRegisterRequest = getSoapRegisterRequest(username, password);
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000"

        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var XMLParser = require('react-xml-parser');
                    var xmlResponse = new XMLParser().parseFromString(xhr.response);
                    const newUserId = xmlResponse.getElementsByTagName('tns:create_new_userResult')[0].value;
                    setSuccessful(true);
                    // De facut cerere pt creat profile cu acest nou id si cu username ca nume
                    createUserProfile(newUserId);
                } else {
                    console.log("ERROR - " + xhr.response);
                }
            }
        }

        xhr.send(soapRegisterRequest);
    }

    function createUserProfile(userId) {
        if(userId) {
            let url = "http://localhost:8081/api/profiles/" + userId;

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {userName: username} )
            })
            .then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    // Treat exceptions
                    return res.text().then( text => { throw new Error(text) } )
                }
            })
            .catch(error => {
                let errorMessage = JSON.parse(error.message).message;
            });
        }
    }


    return (
        <div className="Register">
            <h1>Register!</h1>

            <form onSubmit={register}>
                <div className="registerForm">
                    <input className="registerInput" type="text" id="user" placeholder="Username" onChange={ e => setUsername(e.target.value)} />
                    <br />
                    <input className="registerInput" type="password" id="pass" placeholder="Password" onChange={ e => setPassword(e.target.value)} />
                    <br />
                    <input className="registerButton" type="submit" value="Register" />
                </div>
            </form>
            { successful && successful === true && <p className="successRegistration">Registration successful!</p>}
        </div>
    )
}

export default Register;