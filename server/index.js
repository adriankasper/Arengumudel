require('dotenv').config();


const express = require('express');
const app = express();
const cors = require('cors');
const respond = require('express-respond');
const router = express.Router();
const cookieParser = require('cookie-parser');
const routes = require('./kysimustikRoutes');
const token = require('./token');
const profile = require('./profile')
const fileUpload = require('./fileUpload')
const contact = require('./contact.js')
//const path = require('path');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/", router);
const port = 3001;
app.use(cors({credentials: true, origin: true}));
app.use(respond);


//Kysimustik routes
app.post('/getKasutaja', routes.getKasutaja);
app.post('/kirjutaVastused', routes.kirjutaVastused, routes.kirjutaVastusedHandler);
app.post('/tekitaKysimustik', routes.tekitaVastused, routes.tekitaVastusedHandler);
app.post('/getKysimused', routes.getKysimused, routes.getKysimusedHandler);
app.post('/getSoovitused', routes.getSoovitused, routes.getSoovitusedHandler);
app.post('/getFeedback', routes.getFeedback, routes.getFeedbackHandler);
app.post('/saveFeedback', routes.saveFeedback);
app.post('/saveFinalResult', routes.saveFinalResult)

//Login/token routes
app.post('/login', token.loginRoute);
app.post('/refresh_token', token.refreshToken);
app.post('/logout', token.logoutRoute);
app.post('/token', token.tokenRoute);
app.post('/register', token.register);

app.get('/jwt', token.jwtRoute);
app.get('/about', token.aboutRoute);

app.delete('/logout', (req, res) => {
  refreshTokens
})

//Profile routes
app.post('/changeprofile', profile.changeProfile);
app.post('/uploadimage', profile.upload.single("file"), profile.uploadImage);

//Oppematerjalid
app.post("/uploadfile", fileUpload.upload.single("file"), fileUpload.uploadFile);
app.post("/deleteFile", fileUpload.deleteFile);
app.post("/getOppematerjalid", fileUpload.getOppematerjalid);

router.post("/contact", contact.contactRoute);

app.listen(port, () => {
    console.log("Server running at: " + port);
})
