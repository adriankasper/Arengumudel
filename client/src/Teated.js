import React from 'react'; 
import {Switch} from 'react-router-dom';
import Profilecard from './Profilecard';

const Teated = () => {
    return (
        <section className='profile-about'>
            <Switch>
                <Profilecard/>
            </Switch>
            <section className='about'>
                <h2>See on teadete ja tagasiside leht</h2>
                <p>Siia peaks tulevikus tulema kasutajale antud tagasiside ja muud teated</p>
            </section>
        </section>
    )
}

export default Teated;