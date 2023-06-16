import React, { useEffect } from 'react';
import {useState} from 'react';
import axios from 'axios';
import Kysimusteplokk from './Kysimusteplokk';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import GaugeChart from "react-gauge-chart";
Chart.register(...registerables);


require('dotenv').config()
const SERVER_URL = process.env.REACT_APP_SERVER_URL
const kysimused_url = `${SERVER_URL}/getKysimused`;
const kysimustePlokkNames_url = `${SERVER_URL}/getKysimustePlokk`;
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
    const [questionnaireEnd, setQuestionnaireEnd] = useState(false);
    const [finalResult, setFinalResult] = useState(0);
    const [kysimustePlokkNames, setKysimustePlokkNames] = useState([]);

    useEffect(() => {
        axios.get(kysimustePlokkNames_url + "?kysimusteplokk_id=1")
            .then((response) => {
                if (response.data) {
                    setKysimustePlokkNames(response.data);
                }
            })
            .catch((err) => console.log(err));
    }, [])


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
        }) gssgsgsgs
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
                setFinalResult(summa.toFixed(2));
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



    const plokkideTulemused = () => {
        for (let i = 0; i < questionBlockStats.length; ++i) {

            //summa += <p> questionBlockStats[i].protsentuaalne_tagasiside </p>;
            console.log(questionBlockStats[i].protsentuaalne_tagasiside);
        }
    }

    const HorizontalBarChartComponent = () => {
        const plokkArray = [];
        const percentageArray = [];
        const colorArray = [];
        let percentage;
        let word;
        let color;
        //let testKysimustePlokkNames = ["Õppija toetamine", "Õpi- ja õpetamistegevuse kavandamine", "Õpetamine", "Refleksioon ja professionaalne enesearendamine", "Arendus, loome- ja teadustegevus"];
        //let testPercentage = [100, 66.667, 0, 33.334, 75, 50];

        for (let i = 1; i <= questionBlockStats.length; i++) {
            word = i + ". " + kysimustePlokkNames[i-1]['kysimusteplokk_nimi'] + " | " + questionBlockStats[i-1].protsentuaalne_tagasiside.toFixed(2) + "%";
            //word = i + ". " + testKysimustePlokkNames[i-1] + " | " + testPercentage[i-1] + "%";
            plokkArray.push(word);

            percentage = questionBlockStats[i-1].protsentuaalne_tagasiside;
            //percentage = testPercentage[i-1];
            percentageArray.push(percentage);

            //color = 'rgba(71, 145, 89, 1)';
            if (percentage < 35){
                color = 'rgb(244,49,50)';
            } else if (percentage < 66) {
                color = 'rgb(249,213,74)';
            } else {
                color = 'rgba(71, 145, 89, 1)';
            }
            colorArray.push(color);
        }
        const data = {
            labels: plokkArray,
            datasets: [
                {
                    label: '',
                    data: percentageArray,
                    backgroundColor: colorArray,
                },
            ],
        };

        const options = {
            indexAxis: 'y',
            scales: {
                y: {
                    ticks: {
                        font: {
                            size: 20,
                        }
                    }
                },
                x: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        };

        return (
            <div>
                <h2>Õpetaja kutsealune kompetentsus</h2>
                <Bar data={data} options={options} />
            </div>
        );
    }
    const GaugeChartComponent = () => {

        let score = (Math.round(curProtsentuaalneTulemus * 100, 1) / 100);
        const gageCalc = score => {
            var result = 0;
            if (score >= 0 && score <= 35) {
                result = getPercentage(score, 0, 33, 0);
            } else if (score > 33 && score < 66) {
                result = getPercentage(score, 33, 66, 0.33);
            } else if (score >= 66 && score <= 100) {
                result = getPercentage(score, 66, 100, 0.66);
            }
            return result;
        };

        function getPercentage(score, lowerBound, upperBound, segmentAdjustment) {
            return (
                (score - lowerBound) / (upperBound - lowerBound) / 3 + segmentAdjustment
            );
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'}}>

                <GaugeChart
                    id="gauge-chart"
                    percent={gageCalc(score)}
                    nrOfLevels={3}
                    colors={["#FF0000", "#FFFF00", "#479159"]}
                    hideText={true}
                    style={{ width: '300px'}}
                    arcWidth={0.3}

                />
            </div>
        );
    }

    if (questionnaireEnd) {
        return (
            <section className="tulemuse_vaheleht-container">
                <h5>Keskmine lõpptulemus: {finalResult}%</h5>
                {HorizontalBarChartComponent()}
            </section>
        );
    }


    if (tulemuseVaheleht) {
        const roundedPercent = Math.round(curProtsentuaalneTulemus * 100, 1) / 100;
        return (

            <section className="tulemuse_vaheleht-container">
                <h2>Ploki tulemus: {roundedPercent} %</h2>
                {GaugeChartComponent()}
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
