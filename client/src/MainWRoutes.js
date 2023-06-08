import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from 'react-router-dom';
import Login from './Login.js';
import Register from './Register';
import About from './About.js';
import Home from './Home.js';
import { setAccessToken } from "./accessToken";
import { getAccessToken } from "./accessToken";
import jwtDecode from "jwt-decode";
import Routes from "./Routes";
import axios from 'axios';
//import useLoginToken from './components/useLoginToken';

//Manual merge see App() ja alumine() koos depidega


function MainWRoutes() {

  const history = useHistory();
  const [error, setError] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwt, setJwt] = useState();

  function isAuthenticated() {
    const token = getAccessToken();

    if (!token) {
      return true;
    }

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }


  const fetchAccessToken = () => {
    fetch("/refresh_token", {
      method: "POST",
      credentials: "include"
    }).then(async x => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
      console.log(getAccessToken() + "ACCTOKEN");
    }, (error) => {
      if (error) {
        console.log(error);
        setError("Your refresh token is invalid. Try to relogin");
      }
    })
  }

  useEffect(() => {

    if (isAuthenticated()) {
      fetchAccessToken();
    } 
    // else {
    //   history.push("/login");
    //   window.location.reload();
    // }
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return(
    <div className="main">
      <Routes />
      <p> {Error} </p>
    </div>
    
  ) 
}
  
export default MainWRoutes;