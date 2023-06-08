import { useState } from 'react';

export default function useLoginToken() {


  const getLoginToken = () => {
    const loginTokenString = sessionStorage.getItem('loginToken');
    const userLoginToken = JSON.parse(loginTokenString);
    return userLoginToken?.loginToken
  };

  const [loginToken, setLoginToken] = useState(getLoginToken());

  const saveLoginToken = (userLoginToken) => {
    sessionStorage.setItem('loginToken', JSON.stringify(userLoginToken));
    setLoginToken(userLoginToken.loginToken);
  }

  return {
    setLoginToken: saveLoginToken,
    loginToken
  }

}