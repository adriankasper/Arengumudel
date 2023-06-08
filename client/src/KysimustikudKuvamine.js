import React from 'react'; 
import {Switch, Route} from 'react-router-dom';
import Profilecard from './Profilecard';

const KysimustikudKuvamine = () => {
    return (
        <section className='profile-about'>
            <Switch>
                <Profilecard/>
            </Switch>
            <section className='about'>
                <h2>Siia tuleb täidetud küsimustike kuvamine</h2>
                
            </section>
        </section>
    )
}

export default KysimustikudKuvamine;