const db = require('./database').db;
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

exports.kysimusteplokkNimi = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var phone = req.body.phone;
    var job = req.body.job;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var kasutajaid = req.body.userid;

    var kysimusteplokkNimi = req.body.kysimusteplokk_nimi;
}
    db.query(`SELECT kysimusteplokk_nimi FROM kysimusteplokk WHERE kysimustik_id = 1`, (error, results) => {
        if (error) {
            throw error;
        }
    }