import react from 'react';

let accessToken = "";

export const setAccessToken = (s) => {
  accessToken = s;
};

export const getAccessToken = () => {
  return accessToken;
};