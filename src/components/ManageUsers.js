import React, { useEffect, useState } from 'react'
import './ManageUsers.css'
import Navbar from './Navbar';
import { getSoapAllRolesRequest, getSoapUsersWithRolesRequest } from 'utils/SoapUtil';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';


function ManageUsers({token, nameOfUser}) {

    const [users, setUsers] = useState();
    const [roleList, setRoleList] = useState();
    const [userWasChanged, setUserWasChanged] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        } else {
            getAllUsers();
            getAllRoles();
        }
    }, [])

    useEffect(() => {
        getAllUsers();
        setUserWasChanged(false);
    }, [userWasChanged])


    function getAllUsers() {
        var soapGetUsersWithRolesRequest = getSoapUsersWithRolesRequest(token);
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000"

        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var XMLParser = require('react-xml-parser');
                    var xmlResponse = new XMLParser().parseFromString(xhr.response);
                    const usersXmlResponse = xmlResponse.getElementsByTagName('tns:get_all_users_with_their_rolesResult');
                    var allUsers = [];

                    for(let user of usersXmlResponse) {
                        var roles = [];
                        var userId = user.getElementsByTagName('s0:userId')[0].value;
                        var userName = user.getElementsByTagName('s0:username')[0].value;
                        var rolesList = user.getElementsByTagName('s0:roles');
                        for(let role of rolesList) {
                            roles.push(role.value);
                        }
                        
                        var userObject = {
                            userId: userId,
                            username: userName,
                            roles: roles
                        }

                        allUsers.push(userObject);
                    }

                    setUsers(allUsers);
                } else {
                    console.log("ERROR - " + xhr.response);
                }
            }
        }

        xhr.send(soapGetUsersWithRolesRequest);
    }

    function getAllRoles() {
        var soapGetAllRolesRequest = getSoapAllRolesRequest(token);
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8000"

        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var XMLParser = require('react-xml-parser');
                    var xmlResponse = new XMLParser().parseFromString(xhr.response);
                    const rolesXmlResponse = xmlResponse.getElementsByTagName('tns:get_rolesResult');
                    var allRoles = [];

                    for(let role of rolesXmlResponse) {
                        var roleObject = {value: role.value, label: role.value};
                        allRoles.push(roleObject);
                    }
                    
                    setRoleList(allRoles);
                } else {
                    console.log("ERROR - " + xhr.response);
                }
            }
        }

        xhr.send(soapGetAllRolesRequest);
    }


    return ( token &&
        <div className="ManageUsers">
            <Navbar token={token} nameOfUser={nameOfUser} />
            <UserList userList={users} roleList={roleList} token={token} setUserWasChanged={setUserWasChanged} />
        </div>
    )
}

export default ManageUsers;