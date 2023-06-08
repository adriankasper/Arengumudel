import React from 'react'; 
import Profilecard from './Profilecard';
import {Switch} from 'react-router-dom';

const About = () => {
    return (
        <section className="profile-about">
            <Switch>
                <Profilecard/>
            </Switch>
            <section className='about'>
                <h2>Infot meie kohta</h2>
                <p>Oleme neljaliikmeline tiim, kes arendab projekti nimega "Õpetaja professionaalne areng" nii kaugele kui suvepraktika ajaraames jõuab.</p>
            </section>
        </section>
    )
}

export default About;