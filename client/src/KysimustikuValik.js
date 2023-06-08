import React from 'react';
import axios from 'axios';
import Kysimustik from './Kysimustik';
import {useState, useEffect} from 'react';
import {useUserContext} from './userContext';
import Profilecard from './Profilecard';
import { Switch } from "react-router-dom";
require('dotenv').config()
const SERVER_URL = process.env.REACT_APP_SERVER_URL
const kysimustikudURL = `${SERVER_URL}/getKysimused`;
const tekitaURL = `${SERVER_URL}/tekitaKysimustik`;

const KysimustikuValik = () => {
    const [kysimustikud, setKysimustikud] = useState([]);
    const [selectedKysimustik, setSelectedKysimustik] = useState(0);
    const [profiilKysimustikId, setProfiilKysimustikId] = useState(0);
    const {userId} = useUserContext();



    //Saada kasutajaid ja kysimustikid /tekitaKysimustik api kutsele (POST REQUEST!!!!!!)

    //Response saada edasi Kysimustik komponendile

    const kysimustikuNupp = (kysimustik_id) => {
        axios.post(tekitaURL, {kasutaja_id: userId, kysimustik_id: kysimustik_id}).then((response) => {
            if (response.data.status) {
                console.log(response.data);
                setSelectedKysimustik(kysimustik_id);
                setProfiilKysimustikId(response.data.profiil_kysimustik_id);
                //testi
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        /*
        axios.get(kysimustikudURL).then((response) => {
            setKysimustikud(response.data);
        }).catch((error) => {
            console.log(error);
        });
        */
        axios.post(kysimustikudURL, {kysimustikud: true})
        .then((response) => {
            setKysimustikud(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, []);
    
    const kuvaKysimustikud = () => {
        return(
            <section className="kysimustikud-container">
                {
                    kysimustikud.map((kysimustik) => {
                        const {kysimustik_id, kysimustik_pealkiri} = kysimustik;
                        return(
                            <article className="kysimustik">
                                <h5>{kysimustik_pealkiri}</h5>
                                <button className="kysimustik-button" onClick={() => kysimustikuNupp(kysimustik_id)}>Täida</button>
                                <br />
                            </article>
                        );
                    })
                }
            </section>
        );
    };

    const kuvaKysimustik = (kysimustik_id) => {
        return <Kysimustik kysimustik_id={kysimustik_id} profiil_kysimustik_id={profiilKysimustikId}/>
    };



    return(
        <section className="profile-kysimustik">
            <Switch>
                <Profilecard/>
            </Switch>
            <section className="kysimustik-container">
                <React.Fragment>
                    {selectedKysimustik === 0 ? kuvaKysimustikud() : kuvaKysimustik(selectedKysimustik)}
                </React.Fragment>
            </section>
        </section>
    );
};

export default KysimustikuValik;