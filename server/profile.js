const db = require('./database').db;
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

//const upload = multer({storage: storage}).single("profilepic");

var storage = multer.diskStorage({
  destination: path.resolve(__dirname, ".","../../client/public/uploads/images"),
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})

exports.upload = multer({storage: storage});

exports.changeProfile = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;
  var job = req.body.job;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var kasutajaid = req.body.userid;

  db.query(`SELECT * FROM Profiil WHERE kasutaja_id=${kasutajaid}`, (error, results) => {
    if (error) {
      throw error;
    }

    if(firstName == "") {
      firstName = results[0].eesnimi;
    }
    if(phone == "") {
      phone = results[0].telefon;
    }
    if(job == "") {
      job = results[0].tookoht;
    }
    if(lastName == "") {
      lastName = results[0].perenimi;
    }

    db.query(`SELECT email FROM Kasutaja WHERE kasutaja_id=${kasutajaid}`, (error, results) => {
      if(email == "") {
        email = results[0].email;
      }

      db.query(`UPDATE Kasutaja SET email='${email}' WHERE kasutaja_id=${kasutajaid}`, (err, result) => {
        //check('email', 'Email on sisestamata!').notEmpty();
        //check('email', 'Email ei ole korralik!').isEmail();
        //check('password', 'Salasona vali on tyhi!').notEmpty();
        if(err) {
          console.log(err);
          res.send({err: err});
        }
        if (result != null) {
          console.log(result);
          //res.send(result);
        }
        // } else {
        //   //res.send({message: "Midagi laks valesti!"});
        // }
    
        db.query(`UPDATE Profiil SET telefon='${phone}', tookoht='${job}', eesnimi='${firstName}', perenimi='${lastName}' WHERE kasutaja_id=${kasutajaid} `, (error, result) => {
          if (error) {
            console.log(error);
            throw error;
          } else {
            return res.status(200).json({ msg: "Andmed salvestatud"})
          }
        })
      });
    })
  })
};

exports.uploadImage = async (req, res) => {
  console.log(req.file);
  const { filename: image } = req.file;
  const imageName = "profilepic-"+Date.now();

  await sharp(req.file.path)
  .resize(300, 300)
  .jpeg({quality: 50}).toFile("../client/public/uploads/images/"+ imageName +  ".jpg");
  // .toFile(
  //   path.resolve(req.file.destination,'resized',image)
  // )
  
  // sharp(req.file.path).resize(500).jpeg({quality: 50}).toFile(path.resolve(req.file.destination,'resized',image));
  // fs.unlinkSync(req.file.path);

  //const imageName = req.file.filename;
  const userid = req.body.userid;


  db.query(`UPDATE Profiil SET profiilipilt='${imageName}' WHERE kasutaja_id=${userid}`, (error, result) => {
    if(error) {
      console.log(error);
      throw error;
    }

    db.query(`SELECT profiilipilt FROM Profiil WHERE kasutaja_id=${userid}`, (error, result) => {
      if(error) {
        throw error;
      } else {
        let data = {};
        data.image = result[0].profiilipilt;
        //var image = result[0].profiilipilt;
        res.status(200).send(data);
        //res.send(data);
      }
    })
  })
};