import React from 'react';
import {useContext, useState, useEffect} from 'react';
import jwtDecode from 'jwt-decode';
import { useHistory } from 'react-router';
import axios from 'axios';
const UserContext = React.createContext();
require('dotenv').config()
const SERVER_URL = process.env.REACT_APP_SERVER_URL

axios.defaults.withCredentials = true;

export const UserProvider = ({children}) => {
    const history = useHistory();
    const [error, setError] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState();
    const [accessToken, setAccessToken] = useState(0);
    const [userEmail, setUserEmail] = useState('');

    function isAuthenticated() {

        if (!accessToken) {
            return true;
        }

        try {
        const { exp } = jwtDecode(accessToken);
        if (Date.now() >= exp * 1000) {
            return false;
        } else {
            return true;
        }
        } catch (error) {
            throw error;
        }
    }


    const fetchAccessToken = () => {
        axios.post(`${SERVER_URL}/refresh_token`)
        .then((response) => {
            console.log(response.data)
            if (response.data.ok) {
                const { accessToken } = response.data.accessToken;
                setAccessToken(accessToken);
                setLoading(false);
                setIsLoggedIn(true);

                const {id, email} = jwtDecode(response.data.accessToken);
                console.log("TOUKENTOUKEN: " + accessToken);
                setUserId(id);
                setUserEmail(email);
            } else {
                console.log("Midagi l2ks valesti");
            }
        })
        .catch((error) => {
            console.log(error);
            setError("Your refresh token is invalid. Try to relogin");
        });
    }

    useEffect(() => {

        if (isAuthenticated()) {
            fetchAccessToken();
        }
        else {
            setIsLoggedIn(false);
            history.push("/login");
            window.location.reload();
        }


    }, []);

    return (
        <UserContext.Provider value={{userId
        ,userEmail
        ,accessToken
        ,isLoggedIn
        ,setAccessToken
        ,setUserEmail
        ,isLoggedIn}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};