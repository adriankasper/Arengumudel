import React, {useEffect, useState} from 'react';
import Kysimus from './Kysimus';

const kuvamiseLimit = 5;

const Kysimusteplokk = ({kysimused, displayPlokkButtons, setKysimusteVastused, kysimusteVastused}) => {
    const [kasOnAlamPlokke, setKasOnAlamPlokke] = useState(false);
    const [kuvatavadKysimused, setKuvatavadKysimused] = useState([]);
    const [selectedAlamPlokk, setSelectedAlamPlokk] = useState(0);
    const [kysimusedAlamPlokkidena, setKysimusedAlamPlokkidena] = useState([]);
    const [mituAlamPlokki, setMituAlamPlokki] = useState(0);


    useEffect(() => {
        if (kysimused.length > kuvamiseLimit) {
            setKysimusedAlamPlokkidena(jagaKysimusedAlamplokkideks());
            setKasOnAlamPlokke(true);
        } else {
            setKuvatavadKysimused(kysimused);
        }
    }, [])

    useEffect(() => {
        if (kasOnAlamPlokke) {
            const kuvatavPlokk = kysimusedAlamPlokkidena.filter((kysimus) => kysimus.alamplokk_id === selectedAlamPlokk);
            setKuvatavadKysimused(kuvatavPlokk);
        }
    }, [selectedAlamPlokk, kasOnAlamPlokke]);


    const jagaKysimusedAlamplokkideks = () => {
        const tempKysimused = kysimused;
        const mituPlokki = Math.ceil(tempKysimused.length / kuvamiseLimit);
        setMituAlamPlokki(mituPlokki);
        let kuvatavadKysimused = [];
        for (let i = 0; i < mituPlokki; ++i) {
            for (let j = 0; j < kuvamiseLimit; ++j) {
                if (kysimused[j] !== undefined) {
                    kuvatavadKysimused = [...kuvatavadKysimused, {...tempKysimused[j], alamplokk_id:i}];
                }
            }
            if (tempKysimused.length > kuvamiseLimit) {
                tempKysimused.splice(0, kuvamiseLimit);
            }
        }
        return kuvatavadKysimused;
    }

    //Lisa checkimine, et iga kysimus oleks taidetud
    //Kui alamplokkide lopus muuda nupp submitiks ja muuda selectedplokki

    //Kas veebilehel peaks olema voimalus liikuda edasi ja tagasi kysimusteplokkide vahel, kui hindamine toimub peale ploki l2bimist siis t2hendab, et opetajal ei saa koiki oma vastuseid yle vaadata


    const displayButtons = () => {
        if (selectedAlamPlokk === 0) {
            return <button type="button" className="kysimuste-plokk-button" onClick={() => setSelectedAlamPlokk(selectedAlamPlokk + 1)}>Jargmine alamplokk</button>;
        } else if (selectedAlamPlokk === mituAlamPlokki - 1) {
            return <button type="button" className="kysimuste-plokk-button" onClick={() => setSelectedAlamPlokk(selectedAlamPlokk - 1)}>Eelmine alamplokk</button>;
        } else {
            return(
                <React.Fragment>
                    <button type="button" className="kysimuste-plokk-button"  onClick={() => setSelectedAlamPlokk(selectedAlamPlokk - 1)}>Eelmine alamplokk</button>
                    <button type="button" className="kysimuste-plokk-button"  onClick={() => setSelectedAlamPlokk(selectedAlamPlokk + 1)}>Jargmine alamplokk</button>
                </React.Fragment>
            );
        }
    };

    const displayJargminePlokk = () => {
        if (selectedAlamPlokk === mituAlamPlokki - 1) {
            return displayPlokkButtons();
        }
        if (mituAlamPlokki === 0) {
            return displayPlokkButtons();
        }
    };
    

    return(
        <React.Fragment>
            {kuvatavadKysimused.map((kysimus, index) => {
                return(
                    <Kysimus kysimus={kysimus} key={kysimus.kysimus_id} setKysimusteVastused={setKysimusteVastused}
                    kysimusteVastused={kysimusteVastused}/>
                );
            })}
            {kasOnAlamPlokke && displayButtons()}
            {displayJargminePlokk()}
        </React.Fragment>
    );
}

export default Kysimusteplokk;
