import React from 'react';
import {BrowserRouter as Link} from "react-router-dom";

const Navbar = (props) => {
    return(
        <React.Fragment>
            <section className="navbar-content-container">
                <article className="navbar-logo">
                    <img src="" alt="Logo"></img>
                </article>
                <nav>
                    <Link to="/">Profile</Link>
                    <Link to="/kysimustikud">Kysimustikud</Link>
                    <Link to="/teated">Teated</Link>
                    <Link to="/kontakt">Kontakt</Link>
                </nav>
            </section>
        </React.Fragment>
    );
}

export default Navbar;
