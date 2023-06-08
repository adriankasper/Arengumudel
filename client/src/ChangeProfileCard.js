import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { NavLink } from "react-router-dom";
import {useUserContext} from './userContext';
require('dotenv').config()

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Profilecard = () => {

    //const {userId} = useUserIdContext();
    const [profiilAndmed, setProfiilAndmed] = useState({});
    const {userId} = useUserContext();

    useEffect(() => {

        axios.post(`${SERVER_URL}/getKasutaja`, {
            kasutajaid: userId
        }).then((response) => {
            setProfiilAndmed(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    useEffect(() => {
        console.log(profiilAndmed);
    }, [profiilAndmed]);

    return(
        <React.Fragment>
            <section className="profile-card">
                <img src='https://via.placeholder.com/300.png/09f/fff' alt='profilepic'></img>
                <h2>{profiilAndmed.eesnimi} {profiilAndmed.perenimi}</h2>
                <h4>{profiilAndmed.kasutajaroll}</h4>
                <br/>
                <NavLink className="profile-button" to="/profile">Profiil</NavLink>
                <NavLink className="profile-button" to="/lisa-oppematerjal">Õppematerjalid</NavLink>
                <NavLink className="profile-button" to="/">Minu küsimustikud</NavLink>
                <NavLink className="profile-button" to='/muudaprofiili'>Muuda profiili</NavLink>
            </section>
        </React.Fragment>
    );

}

export default Profilecard;
