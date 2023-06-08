const bcrypt = require('bcrypt')
const db = require('./database').db;
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');


function sendRefreshToken (res, token) {
  res.cookie("jid", token, {httpOnly: true, path: "/refresh_token"});
}

function generateAccessToken(emailInput, idInput) {
  return jwt.sign({email: emailInput, id: idInput}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}

function sendToken (res, token) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.cookie("jid", token, {httpOnly: true, path: "/jwt"});
}

function sendTokentoLogout (res, token) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.cookie("jid", token, {httpOnly: true, path: "/logout"});
}

// function sendTokentoGetKasutaja (res, token) {
//   res.cookie("jid", token, {httpOnly: true, path: "/getKasutaja"});
// }

function createRefreshToken (emailInput, idInput) {
  return jwt.sign({email: emailInput, id: idInput}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log("error: " + error);
    }
    return null;
};

exports.loginRoute = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const hash = await hashPassword(password);

  db.query("SELECT * FROM Kasutaja WHERE email = ?",
  [email], (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({msg: "Kasutajat ei leitud"});
    }
    try {
       bcrypt.compare(password, results[0].salasona, (err, data) => {
         if (err) {
           throw err;
         }
         if (data) {
          sendRefreshToken(res, createRefreshToken(results[0].email, results[0].kasutaja_id));
          const accToken = generateAccessToken(results[0].email, results[0].kasutaja_id);
           console.log("touken: " + results[0].kasutaja_id);
           console.log("Login token: " + accToken);
           sendToken(res, accToken);
           sendTokentoLogout(res, accToken);
           return res.status(200).json({ msg: "Login success", accessToken: accToken })
         } else {
           return res.status(401).json({ msg: "Invalid credencial" })
         }
       })
    } catch(error) {
        console.log("error: " + error);
        res.status(500).send();
    }
  })
};

exports.refreshToken = (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    console.log("token: " + token);
    return res.send({ok: false, accessToken: ''});
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log("payload" + payload);
  } catch(err) {
    console.log("error: " + err)
    return res.send({ok: false, accessToken: ''});
  }

  const email = payload.email;
  console.log("email: " + email[0]);
  console.log(JSON.stringify(email));

  db.query("SELECT * FROM Kasutaja WHERE email = ?",
  [email], (err, results) => {
    if (err) {
      throw err;
    }
    console.log("results: " + results);
    if (results.length === 0) {
      return res.status(400).send("Kasutajat ei leitud");
    }
    try {
      // if (err) {
      //   throw err;
      // }
      const user = results[0].email;
      if(!user) {
        return res.send({ok: false, accessToken: ''});
      }
      sendRefreshToken(res, createRefreshToken(results[0].email, results[0].kasutaja_id));
      const accToken = generateAccessToken(results[0].email, results[0].kasutaja_id);
      sendToken(res, accToken);
      sendTokentoLogout(res, accToken);
      return res.send({ok: true, user: user, accessToken: accToken});
    } catch (error) {
      throw error;
    }
  })
};

exports.logoutRoute = (req, res) => {
  const token = req.cookies.jid;
  res.clearCookie("jid");
  sendRefreshToken(res, "");
  sendToken(res, "");
  sendTokentoLogout(res, "");
  res.send({status: 'logged out', touken: token});
};

exports.jwtRoute = (req, res) => {
  const token = req.cookies.jid;

  res.cookie('jid', token, { httpOnly: true });

  if(!token) {
    console.log("Tokenit pole");
  } else {
    console.log("/jwt token: " + token);
  }

  return res.send({accTok: token});
};

exports.aboutRoute = (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, function(err, data) { 
    if (err) {
      res.json({err: err})
    } else {
      res.json({ text: 'see on kaitstud', data: data})
    }
  })
};

exports.tokenRoute = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  if (!refreshToken.includes(refreshToken)) {
    res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ email: email});

    res.json({accessToken : accessToken});
  })

};

exports.register = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const job = req.body.job;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const hash = await hashPassword(password);

    db.beginTransaction(function(err) {
      if(err) {throw err; }
    })
      db.query("INSERT INTO Kasutaja (email, salasona) VALUES (?, ?)", [email, hash], (err, result) => {
        check('email', 'Email on sisestamata!').notEmpty();
        check('email', 'Email ei ole korralik!').isEmail();
        check('password', 'Salasona vali on tyhi!').notEmpty();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        if(err) {
          return res.send({err: err});
        }
        if (result != null) {
          res.send(result);
        } else {
          return res.send({message: "Vale email / salasona!"});
        }
      

      var kasutajaID = result.insertId;

      db.query("INSERT INTO Profiil (eesnimi, perenimi, kasutaja_id, telefon, tookoht, kasutajaroll_id) VALUES (?, ?, ?, ?, ?, ?)", [firstName, lastName, kasutajaID, phone, job, 1], (err, result) => {
        check('eesnimi', 'Eesnimi on sisestamata!').notEmpty();
        check('perenimi', 'Perekonnanimi ei ole korralik!').notEmpty();
        check('telefon', 'Telefoninumber on sisestamata!').notEmpty();
        check('tookoht', 'Tookoht on sisestamata!').notEmpty();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        if(err) {
          //res.send({err: err});
          console.log("ERROR: " + err);
        }
        if (result != null) {
          console.log(result);
          //res.send(result);
        } else {
          console.log(result);
          //res.send({message: result});
        }
      

      db.commit(function(err) {
        if (err) {
          return db.rollback(function() {
            throw err;
          });
        }
        console.log('success!');
      });
    });
  });
};