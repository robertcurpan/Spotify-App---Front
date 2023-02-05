import React, { useState } from "react";
import './User.css';
import { getSoapAssignRoleToUserRequest, getSoapRemoveUserRequest } from "utils/SoapUtil";
import ReactSelect from "react-select";
import { getErrorMessageFromResponse } from "utils/SoapUtil";


function User({user, roleList, token, setUserWasChanged}) {

    const [popup, setPopup] = useState(false);
    const [assignRoleException, setAssignRoleException] = useState("");
    const [selectedRole, setSelectedRole] = useState();


    function deleteUser() {
        var soapRemoveUserRequest = getSoapRemoveUserRequest(user.userId, token);
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000"

        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var XMLParser = require('react-xml-parser');
                    var xmlResponse = new XMLParser().parseFromString(xhr.response);
                    setUserWasChanged(true);
                } else {
                    console.log("ERROR - " + xhr.response);
                }
            }
        }

        xhr.send(soapRemoveUserRequest);
    }

    function assignRoleToUser() {
        if(selectedRole) {
            let listOfRoles = [selectedRole];
            var soapAssignRoleToUserRequest = getSoapAssignRoleToUserRequest(user.userId, listOfRoles, token);
            var xhr = new XMLHttpRequest();
            var url = "http://localhost:8000"

            xhr.open('POST', url);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        var XMLParser = require('react-xml-parser');
                        var xmlResponse = new XMLParser().parseFromString(xhr.response);
                        setUserWasChanged(true);
                        setAssignRoleException("");
                    } else {
                        let errorMessage = getErrorMessageFromResponse(xhr.response);
                        setAssignRoleException(errorMessage);
                    }
                }
            }

            xhr.send(soapAssignRoleToUserRequest);
        }
    }

    function togglePopup() {
        setPopup(!popup);
        setAssignRoleException("");
    }


    return(
        <div>
            <div className="User">
                <div className="userInfo">
                    <label>Username:</label>
                    <span>{user.username}</span>
                    <br />
                    <label>Roles:</label>
                    <br />
                    {user.roles && user.roles.length > 0 && user.roles.map((role, index) => (
                        index == user.roles.length - 1 ? <span key={index}>- {role}</span> : <span key={index}>- {role}<br /></span>
                    ))}
                </div>
                <div className="userFunctionalities">
                    <button className="userButton" onClick={deleteUser}>Delete user</button>
                    <br />
                    <button className="userButton" onClick={togglePopup}>Assign roles</button>
                </div>
            </div>
            
            { popup && 
                <div className="assignRolesPopup">
                    <div className="assignRolesPopup-content">
                        <h3>Select a role to assign</h3>
                        <ReactSelect options={roleList} onChange={e => setSelectedRole(e.value)} placeholder="Select role" />
                        <button className="popupButton" onClick={togglePopup}>Close</button>
                        { assignRoleException && assignRoleException !== "" && <span className="errorMsg">{assignRoleException}</span>}
                        <button className="assignRoleButton" onClick={assignRoleToUser}>Assign role</button>
                    </div>
                </div>
            }
        </div>
        
    )
}

export default User;