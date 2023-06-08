import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import { BsFillBellFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import {useUserContext} from './userContext';
import { GoThreeBars } from "react-icons/go";
require('dotenv').config()

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Header = () => {

    const history = useHistory();

    const { userEmail, userId, accessToken, setAccessToken, setUserEmail} = useUserContext();
    const [isLogged, setIsLogged] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [body, setBody] = useState();

    const [showHamburger, setShowHamburger] = React.useState(false);
    const [showNotif, setShowNotif] = React.useState(false);
    const [showDrop, setShowDrop] = React.useState(false);

    const [profiilAndmed, setProfiilAndmed] = useState({});

    useEffect(() => {
        if(userId !== undefined) {
            setIsLogged(true);
            axios.post(`${SERVER_URL}/getKasutaja`, {
                kasutajaid: userId
            }).then((response) => {
                setProfiilAndmed(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }

        if(userId == undefined) {
            setIsLogged(false);
        }
        
    }, [userId]);

    const profileRouteChange = () =>{ 
        let path = "/profile"; 
        history.push(path);
    }

    const contactRouteChange = () =>{ 
        let path = "/contact"; 
        history.push(path);
    }

    const buttonStyle = {
        textDecoration: "none",
        color: "rgba(255, 255, 255, 0.7)"
    };

    const buttonStyleSecondary = {
        textDecoration: "none",
        color: "white"
    };

    const activePage = {
        color: '#fff',
        textDecoration: 'underline'
    };

    function showBurgerMenu() {
        setShowHamburger(!showHamburger);
        if (showDrop == true) {
            setShowDrop(false);
        }
        if (showNotif == true) {
            setShowNotif(false);
        }
    }
    
    function toggleDrop() {
        setShowDrop(!showDrop);
    };

    function wrapperToggleDrop() {
        setShowDrop(!showDrop)
        if (showNotif == true) {
            setShowNotif(false);
        }
        if (showHamburger == true) {
            setShowHamburger(false);
        }
    }
    function wrapperToggleNotif() {
        setShowNotif(!showNotif)
        if (showDrop == true) {
            setShowDrop(false);
        }
        if (showHamburger == true) {
            setShowHamburger(false);
        }
    }

    function logout () {
        axios.post('/logout').then((response) => {
            history.push("/login");
            window.location.reload();
            console.log(response.data + "on respond");
        })
        //setAccessToken("");
        //setLoggedIn(false);
    }

    const burgerAway = () => {
        if(window.innerWidth > 776 && showHamburger == true) {
            setShowHamburger(false);
        }
    }
    useEffect(() => {
        window.addEventListener("resize", burgerAway);
    }

    )

    return (
        <header>
            <div className="navbar-content">
                <div id="hamburger-icon" onClick={showBurgerMenu}>  
                    <GoThreeBars />
                </div>
                <h1><NavLink id="navbar-logo" to="/profile" style={buttonStyleSecondary}>Logo</NavLink></h1>
                
                <div id="nav-item">
                    <NavLink activeStyle={activePage} to="/profile" style={buttonStyle}>Profiil</NavLink>
                </div>
                <div id="nav-item">
                    <NavLink activeStyle={activePage} to="/kysimustikud" style={buttonStyle}>Küsimustikud</NavLink>
                </div>
                <div id="nav-item">
                    <NavLink activeStyle={activePage} exact to="/" style={buttonStyle}>Teated</NavLink>
                </div>
                <div id="nav-item">
                    <NavLink activeStyle={activePage} exact to="/contact" style={buttonStyle}>Kontakt</NavLink>
                </div>
                <div id="nav-item">
                    <NavLink activeStyle={activePage} to="/about" style={buttonStyle}>Meist</NavLink>
                </div>
                {accessToken != "" ? 
                <div className="profile-elements">
                    <div id="profile-1">
                        <button id="notification-button" onClick={wrapperToggleNotif}><BsFillBellFill /></button>
                        { showNotif && 
                        <div className="notifications">
                            <p>Teil pole ühtegi teadet!</p>
                        </div>
                        }
                    </div>
                    <div id="profile-2">
                        <h3><NavLink id="navbar-name" to="/profile" style={buttonStyleSecondary}>{profiilAndmed.eesnimi}</NavLink></h3>
                        <button id="dropdown-button" onClick = {wrapperToggleDrop}><IoIosArrowDown /></button>
                    </div>
                </div> : <div className='nav-item'>
                            <NavLink to="/login" id="login-button-2" style={buttonStyleSecondary}>Logi sisse</NavLink>
                            </div>
                        
                }

            </div>

            { showDrop &&
            <div className="dropdown">
               <div id="drop-1" onClick = {toggleDrop}>
                    <button onClick={profileRouteChange} >Minu profiil</button>
               </div>
                <div id="drop-2" onClick = {toggleDrop}>
                    <button onClick={contactRouteChange}>Kontakt</button>
                </div>
                <div id="drop-3" onClick = {toggleDrop}>
                <button onClick={async () => {await logout(); setAccessToken(""); setUserEmail(""); localStorage.removeItem('loggedIn'); console.log(accessToken + "See on getaccestoken")}}>Logi välja</button>
                </div>
            </div>
            }

            { showHamburger && 
            <div className="hamburger-menu">
                <div>
                    <Link to="/profile" style={buttonStyleSecondary} onClick={() => setShowHamburger(!showHamburger)}>Profiil</Link>
                </div>
                <div>
                    <Link to="/kysimustikud" style={buttonStyleSecondary} onClick={() => setShowHamburger(!showHamburger)}>Küsimustikud</Link>
                </div>
                <div>
                    <Link to="/" style={buttonStyleSecondary} onClick={() => setShowHamburger(!showHamburger)}>Teated</Link>
                </div>
                <div>
                    <Link to="/contact" style={buttonStyleSecondary} onClick={() => setShowHamburger(!showHamburger)}>Kontakt</Link>    
                </div>
                <div>
                    <Link to="/about" style={buttonStyleSecondary} onClick={() => setShowHamburger(!showHamburger)}>Meist</Link>
                </div>
            </div> }
            
            {/* <div>
           
            <div>
                <Link to="/register">Register</Link>
            </div>
            <div>
                <Link id="loginLink" to="/login">Login</Link>
            </div>
            <div>
                <Link to="/Contact">Kontakt</Link>
            </div>
             */}

            {/* <div>
                {isLogged ? <section className="profile-elements">
                    <button id="notification-button"><BsFillBellFill /></button>
                    <h2><NavLink id="navbar-name" to="/profile" style={buttonStyleSecondary}>{profiilAndmed.eesnimi}</NavLink></h2>
                    <button id="dropdown-button"><IoIosArrowDown /></button>
                    </section> :
                    <div id="nav-item">
                     <NavLink to="/login" style={buttonStyleSecondary}>Logi sisse</NavLink>
                    </div>}
    
            </div>
            <div>
                {accessToken != "" ? (<button onClick={async () => {await logout(); setAccessToken(""); setUserEmail(""); console.log(accessToken + "See on getaccestoken")}}>Logi valja</button>) : null}
            </div> */}
            {/* <div>
                {userEmail}
                <br />
                {userId}
            </div> */}
        </header>
    )
}

export default Header;