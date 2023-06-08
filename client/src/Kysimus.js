import React, { useEffect, useState } from 'react';
import axios from 'axios';
require('dotenv').config()

const SERVER_URL = process.env.REACT_APP_SERVER_URL


const kysimusteValikud = [{
    valik_tekst: "Hästi",
    value: 3
},
{
    valik_tekst: "Keskmiselt",
    value: 2
},
{
    valik_tekst: "Halvasti",
    value: 1
}];

const Kysimus = ({kysimus, setKysimusteVastused, kysimusteVastused}) => {
    const [soovitused, setSoovitused] = useState([]);;

    useEffect(() => {
        /*
        const kysimusSelector = "?kysimusid=" + kysimus.kysimus_id;
        axios.get(soovitusAPI + kysimusSelector).then((response) => {
            setSoovitused((prevState) => {
                return [...prevState, response.data]});
        })
        .catch((err) => {
            console.log(err);
        })
        */
        axios.post(`${SERVER_URL}/getSoovitused/`, {kysimusid: kysimus.kysimus_id}).then((response) => {
            setSoovitused((prevState) => {
                return [...prevState, response.data]});
        })
        .catch((error) => console.log(error));
    }, []);

    const kuvaSoovitused = () => {
        return(
            <div className="soovitused-container">
                {
                    soovitused.map((soovitus, index) => {
                        if (soovitus.soovitus_tekst) {
                            return <p className="soovitus">{index + 1}. {soovitus.soovitus_tekst}</p>;
                        }
                    })
                }
            </div>
        );
    }

    const setVastus = (e) => {
        const vastus = {
            kysimus_id: kysimus.kysimus_id,
            vastus: e.target.value
        };
        setKysimusteVastused(prevState => {
            let newState = [...prevState];
            /*
            if (prevState[kysimus.kysimus_id - 1]) {
                newState[kysimus.kysimus_id - 1].vastus = vastus.vastus;
            } else {
                newState[kysimus.kysimus_id - 1] = vastus;
            }
            */
            newState[kysimus.kysimus_id  - 1].vastus = vastus.vastus;
            return newState;
        });
    };

    const setEnesehinnang = (e) => {
        const enesehinnang = {
            kysimus_id: kysimus.kysimus_id,
            enesehinnang: e.target.value
        }

        setKysimusteVastused(prevState => {
            let newState = [...prevState];
            newState[kysimus.kysimus_id - 1].enesehinnang = enesehinnang.enesehinnang;
            return newState;
        })
    }

    const kasOnTaidetud = (valik) => {
        if (kysimusteVastused !== undefined) {
            if (kysimusteVastused[kysimus.kysimus_id - 1].vastus == valik) {
                return true;
            }
        }
        return false;
    };

    const getHalfFeedback = () => {
        if (kysimusteVastused[kysimus.kysimus_id - 1].enesehinnang !== undefined) {
            return kysimusteVastused[kysimus.kysimus_id - 1].enesehinnang;
        }
        return ""
    };

    return(
        <article className="kysimus-plokk">
            <p className="kysimus">{kysimus.kysimus_tekst}</p>
            <label className="vastuse-valik-title">Vastus:</label>
            <div className="vastuse-valik-container" /*onChange={(e) => setVastus(e)}*/>
                {
                    kysimusteValikud.map((valik, index) => {
                        return (
                            <React.Fragment key={index}>
                                <label>{valik.valik_tekst}</label>
                                <input type="radio" value={valik.value} id="vastus" name={`vastus${kysimus.kysimus_id}`} onChange={(e) => setVastus(e)} checked={kasOnTaidetud(valik.value)}/>
                            </React.Fragment>
                        );
                    })
                }
            </div>
            {soovitused.length > 0 && kuvaSoovitused()}
            <label className="enesehinnang-label">Enesehinnang:</label>
            <textarea id="enesehinnangText" className="enesehinnangText" onChange={(e) => setEnesehinnang(e)} rows="4" cols="50" value={getHalfFeedback()}></textarea>
        </article>
    );
}

export default Kysimus;
