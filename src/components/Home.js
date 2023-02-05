import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import Navbar from "./Navbar";
import SongsPage from "./SongsPage";


function Home({token, nameOfUser}) {

    const navigate = useNavigate();

    useEffect(() => {
        if(!token) {
            navigate("/unauthorized");
        }
    }, [])


    return( token &&
        <div className="Home">
            <Navbar token={token} nameOfUser={nameOfUser} />
            <div className="homeIntroMessage">This is your homepage!</div>
        </div>
    )
}

export default Home;