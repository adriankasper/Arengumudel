import React, { useEffect } from 'react';
import {useState} from 'react';
import axios from 'axios';
import Kysimusteplokk from './Kysimusteplokk';
import { toast } from 'react-toastify';

require('dotenv').config()
const SERVER_URL = process.env.REACT_APP_SERVER_URL
const kysimused_url = `${SERVER_URL}/getKysimused`;
const salvestamise_url = `${SERVER_URL}/kirjutaVastused`;

const Kysimustik = ({kysimustik_id, profiil_kysimustik_id}) => {
    const [kysimusedList, setKysimusedList] = useState([]);
    const [loading, isLoading] = useState(false);
    const [selectedPlokk, setKysimustePlokk] = useState(1);
    const [mituPlokki, setMituPlokki] = useState(0);
    const [kysimusteVastused, setKysimusteVastused] = useState([]);
    const [kysimusteIdArr, setKysimusteIdArr] = useState([]);
    const [curProtsentuaalneTulemus, setCurProtsentuaalneTulemus] = useState(0);
    const [tulemuseVaheleht, setTulemuseVaheleht] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState('');
    const [currentFeedbackId, setCurrentFeedbackId] = useState(0);
    const [questionBlockStats, setQuestionBlockStats] = useState([]);
    const [questionnaireEnd, setQuestionnaireEnd] = useState(false)
    const [finalResult, setFinalResult] = useState(0)


    useEffect(() => {
        isLoading(true);
        /*
        const plokkSelection = "?kysimusteplokk=";
        const kysimustikSelection = `&kysimustik=${kysimustik_id}`;
        axios.get(kysimused_url + plokkSelection + selectedPlokk + kysimustikSelection)
        .then((response) => {
            setKysimusedList(response.data);
            isLoading(false);
        })
        .catch((error) => {
            console.log(error);
        })
        */

        axios.post(kysimused_url, {kysimusteplokk_id: selectedPlokk, kysimustik_id: kysimustik_id})
        .then((response) => {
            setKysimusedList(response.data);
            isLoading(false);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [selectedPlokk])

    //Profiil_kysimustik_id KysimustikuValik komponendilt ja see edasi vastuste sisestamis funktsioonile

    useEffect(() => {
        axios.post(kysimused_url, {kysimusteplokk_id: selectedPlokk, kysimustik_id: kysimustik_id})
        .then((response) => {
            let praegunePlokk = [];
            for (let i = 0; i < response.data.length; ++i) {praegunePlokk = [...praegunePlokk, response.data[i].kysimus_id];}
            setKysimusteIdArr(praegunePlokk);
        })
        .catch((err) => console.log(err))
    }, [selectedPlokk]);

    useEffect(() => {
        /*
        const countSelection = "?count=true";
        axios.get(kysimused_url + countSelection)
        .then((response) => {
            setMituPlokki(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
        */
        axios.post(kysimused_url, {count: true})
        .then((response) => {
            setMituPlokki(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    useEffect(() => {
        kysimusedList.map((kysimus) => {
            setKysimusteVastused((prevState) => {
                return [...prevState, {id: kysimus.kysimus_id, vastus: null, enesehinnang: null}];
            })
        });
    }, [kysimusedList])

    useEffect(() => {
        if (curProtsentuaalneTulemus > 0) {
            setQuestionBlockStats([...questionBlockStats, {protsentuaalne_tagasiside: curProtsentuaalneTulemus,
            profiil_kysimustik_id: profiil_kysimustik_id, tagasiside_id: currentFeedbackId}])
        }
    }, [currentFeedbackId])

    useEffect(() => {
        if (curProtsentuaalneTulemus > 0 && tulemuseVaheleht) {
            getFeedback();
        }
    }, [tulemuseVaheleht])

    useEffect(() => {
        if (finalResult > 0) {
            axios.post(`${SERVER_URL}/saveFinalResult`, {percentage: finalResult, profiil_kysimustik_id: profiil_kysimustik_id})
            .catch((error) => console.log("Failed to write finalResult: " + error));
        }
        // 
    }, [finalResult]) 

    const getFeedback = async () => {
        if (curProtsentuaalneTulemus > 0) {
            await axios.post(`${SERVER_URL}/getFeedback`, {percentage: curProtsentuaalneTulemus, questionblock_id: selectedPlokk})
            .then((response) => {
                console.log(response.data);
                setCurrentFeedback(response.data.tagasiside_tekst);
                setCurrentFeedbackId(response.data.tagasiside_id);

            })
            .catch((error) => console.log(error));
        }
    }

    useEffect(() => {
        console.log(kysimusteVastused);
    }, [kysimusteVastused])

    if (loading) {
        return (
            <section className="kysimuse-container">
                <h3>Loading ...</h3>
            </section>
        );
    }
    const lopetaKysimustik = () => {
        //Saada profiil_kysimustik_id ja koik vastused backendi.
        axios.post(salvestamise_url, {profiil_kysimustik_id: profiil_kysimustik_id, vastused: kysimusteVastused, tagasisided: questionBlockStats})
        .then((response) => {
            if (response.data) {
                let summa = 0;
                for (let i = 0; i < questionBlockStats.length; ++i) {
                    summa += questionBlockStats[i].protsentuaalne_tagasiside;
                }

                summa /= questionBlockStats.length;
                setFinalResult(summa);
                setQuestionnaireEnd(true);
            }
        })
        .catch((err) => console.log(err));
    };




    const statPageBtnHandler = () => {
        if (selectedPlokk === mituPlokki) {
            return(<button className="next-block-button" id="end-button" onClick={() => {
                setKysimustePlokk(selectedPlokk + 1);
                lopetaKysimustik();
            }}>Lõpeta küsimustik</button>)
        } else {
            return(<button className="next-block-button" onClick={() => {
                setKysimustePlokk(selectedPlokk + 1);
                setTulemuseVaheleht(false);}}>Järgmine leht</button>)
        }
    };

    if (questionnaireEnd) {
        return (
            <section className="tulemuse_vaheleht-container">
                <h5>Lõpptulemus: {finalResult}</h5>
            </section>
        );
    }

    if (tulemuseVaheleht) {
        const roundedPercent = Math.round(curProtsentuaalneTulemus * 100, 1) / 100;
        return (
            <section className="tulemuse_vaheleht-container">
                <h2>Ploki tulemus: {roundedPercent} %</h2>
                <h3>Tagasiside</h3>
                <p>{currentFeedback}</p>
                {statPageBtnHandler()}
            </section>
        );
    }

    const arvutaMaxPunktid = () => {
        let summa = 0;
        for (let i = 0; i < kysimusteIdArr.length; ++i) { summa += 3 };
        return summa;
    };


    const displayPlokkButtons = () => {
        if (selectedPlokk <= mituPlokki) {
            return <button type="button" id="next-page-button" onClick={() => liiguEdasi()}>Järgmine leht</button>
        }
    };

    const kasOnTaidetud = () => {
        for (let i = 0; i < kysimusteVastused.length; ++i) {
            if (kysimusteVastused[i].vastus == null || kysimusteVastused[i].enesehinnang == null) {
                return false;
            }
        }
        /*
        kysimusteVastused.forEach(kysimus => {
            if (kysimus.vastus === null) {
                return false;
            }
        })
        */
        return true;
    };

    const arvutaTaidetudPunktid = () => {
        let summa = 0;
        for (let i = 0; i < kysimusteIdArr.length; ++i) {
            console.log(parseInt(kysimusteVastused[kysimusteIdArr[i] - 1].vastus));
            summa += parseInt(kysimusteVastused[kysimusteIdArr[i] - 1].vastus);
        }
        return summa;
    };

    //Saada protsent backendi ja kysi tagasiside teksti

    //

    const liiguEdasi = () => {
        if (kasOnTaidetud()) {

            const maxPunktid = arvutaMaxPunktid();
            const taidetudPunktid = arvutaTaidetudPunktid();

            // 39 - 100%
            // 28 - x%
            //(28 * 100) / 39

            const protsentuaalneTagasiside = (taidetudPunktid * 100) / maxPunktid;
            setCurProtsentuaalneTulemus(protsentuaalneTagasiside);

            setTulemuseVaheleht(true);
        } else {
            toast.error('Sul ei ole sellest küsimusteplokist kõik vastatud!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            console.log("Sul ei ole kysimused taidetud");
        }

    }




    return(
        <section className="kysimused-container">
            <h2>Küsimused</h2>
            <form>
                <Kysimusteplokk kysimused={kysimusedList} key={selectedPlokk} displayPlokkButtons={displayPlokkButtons} setKysimusteVastused={setKysimusteVastused} kysimusteVastused={kysimusteVastused}/>
            </form>
        </section>
    );
}

export default Kysimustik;
