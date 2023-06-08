const multer = require('multer');
const db = require('./database').db;

var storageFile = multer.diskStorage({
  destination: __dirname + "../../client/public/uploads/files",
  filename: function(req, file, cb) {
    if(file.mimetype === 'image/jpeg') {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    } else if(file.mimetype === 'image/png') {
      cb(null, file.fieldname + '-' + Date.now() + '.png')
    } else if (file.mimetype === 'application/pdf') {
      cb(null, file.fieldname + '-' + Date.now() + '.pdf')
    } else if (file.mimetype === 'video/mp4') {
      cb(null, file.fieldname + '-' + Date.now() + '.mp4')
    } else if (file.mimetype === 'audio/mpeg') {
      cb(null, file.fieldname + '-' + Date.now() + '.mp3')
    } else if(file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, file.fieldname + '-' + Date.now() + 'docx')  
    } else if(file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      cb(null, file.fieldname + '-' + Date.now() + '.pptx')
    } else if(file.mimetype === 'application/vnd.ms-excel') {
      cb(null, file.fieldname + '-' + Date.now() + '.xls')
    }
  }
})

exports.upload = multer({storage: storageFile});

exports.getOppematerjalid = (req, res, next) => {
  
  if(req.body.kasutajaid !== undefined) {
    const userid = req.body.kasutajaid;

    db.query(`SELECT profiil_id FROM Profiil WHERE kasutaja_id=${userid}`, (error, result) => {
      if(error) {
        console.log(error);
        throw error;
      }
  
      var profiilId = result[0].profiil_id;
  
  
      db.query(`SELECT * FROM Oppematerjal WHERE profiil_id=${profiilId}`, (error, results) => {
        if(error) {
          console.log(error);
          throw error;
        }
  
        const resultsJson = results.map((result) => {
          return Object.assign({}, result);
        })
        req.data = resultsJson;
        console.log("REQ DATA " + JSON.stringify(req.data));
        
        res.json(req.data);
  
        // let oppemAndmed = {};
        // oppemAndmed.name = result[0].oppematerjal_nimi;
        // oppemAndmed.desc = result[0].oppematerjal_kirjeldus;
        // oppemAndmed.fileName = result[0].oppematerjal_failinimi;
  
        //res.json(oppemAndmed);
      })
    });
  }

  
}

exports.getOppematerjalidHandler = (req, res) => {
  res.json(req.data);
};

exports.uploadFile = async (req, res) => {
    const userid = req.body.userid;
    const title = req.body.title;
    const desc = req.body.desc;
    const fileName = req.file.filename;
    
    console.log("filename: " + req.file.filename);
    db.beginTransaction(function(err) {
      if(err) {throw err; }
    })

    db.query(`UPDATE Profiil SET oppematerjal='${fileName}' WHERE kasutaja_id=${userid}`, (error, result) => {
      if(error) {
        console.log(error);
        throw error;
      }


      db.query(`SELECT profiil_id FROM Profiil WHERE kasutaja_id=${userid}`, (error, result) => {
        if(error) {
          console.log(error);
          throw error;
        }

        var profiilId = result[0].profiil_id;

        db.query(`INSERT INTO Oppematerjal (oppematerjal_nimi, oppematerjal_failinimi, oppematerjal_kirjeldus, profiil_id) VALUES (?, ?, ?, ?)`, [title, fileName, desc, profiilId], (error, result) => {
          if (error) {
            console.log(error);
            throw error;
          } else {
            res.status(200);
          }
  
            db.commit(function(err) {
              if (err) {
                return db.rollback(function() {
                  throw err;
                });
              }
              console.log('success!');
              res.status(200).send();
            });
        });
      })
    });
};

exports.deleteFile = (req, res) => {
  const fileId = req.body.fileId;

  db.query(`DELETE FROM oppematerjal WHERE oppematerjal_id=${fileId}`, (error, result) => {
    if(error) {
      console.log(error);
      throw error;
    }


  });


}