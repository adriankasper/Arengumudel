const express = require('express');
const respond = require('express-respond');

const app = express();
app.use(respond);

function sendRefreshToken (respond, token) {
    res.cookie("jid", token, {httpOnly: true, path: "/refresh_token"});
}

exports.sendRefreshToken = sendRefreshToken;