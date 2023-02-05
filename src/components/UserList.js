import React from "react";
import User from "./User";
import './UserList.css'


function UserList({userList, roleList, token, setUserWasChanged}) {

    // Props

    return(
        <div className="UserList">
            {
                userList && userList.length > 0 && userList.map((user) => (
                    <div>
                        <User user={user} roleList={roleList} token={token} setUserWasChanged={setUserWasChanged} />
                    </div>
                ))
            }
        </div>
    )
}

export default UserList;