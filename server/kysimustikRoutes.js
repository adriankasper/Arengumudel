const db = require('./database').db;

exports.getKysimustePlokkName = (req, res, next) => {
    if (req.query.kysimusteplokk_id !== undefined) {
        const kysimusteplokk_id = req.query.kysimusteplokk_id;
        db.query(`SELECT kysimusteplokk_nimi
                  FROM kysimusteplokk
                  WHERE kysimustik_id = ${kysimusteplokk_id} ORDER BY kysimusteplokk_id`, (error, results, fields) => {
            if (error) throw error;
            const resultsJson = results.map((result) => {
                return Object.assign({}, result);
            })
            req.data = resultsJson;
            next();
        });
    } else {
        console.log("ERROR: KysimustePlokk_id missing");
    }
};

exports.getKysimustePlokkNameHandler = (req, res) => {
    res.json(req.data);
};

exports.getKasutaja = (req, res) => {
  if (req.body.kasutajaid !== undefined) {
    const kasutajaid = req.body.kasutajaid;
    db.query(`SELECT * FROM Profiil WHERE kasutaja_id=${kasutajaid}`, (error, results, fields) => {
        if (error) {
        console.log("ERROR: " + error);
        throw error;
        } 
        let andmed = {};
        andmed.eesnimi = results[0].eesnimi;
        andmed.perenimi = results[0].perenimi;
        andmed.telefon = results[0].telefon;
        andmed.tookoht = results[0].tookoht;
        andmed.profilepicture = results[0].profiilipilt;
        andmed.oppematerjal = results[0].oppematerjal;
        const kasutajaroll_id = results[0].kasutajaroll_id;

        db.query(`SELECT rolli_nimi FROM Kasutajaroll WHERE kasutajaroll_id=${kasutajaroll_id}`, (error, results, fields) => {
            if (error) throw error;
            andmed.kasutajaroll = results[0].rolli_nimi;
        });

        db.query(`SELECT email FROM Kasutaja WHERE kasutaja_id=${kasutajaid}`, (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        }
        andmed.email = results[0].email;
        res.send(andmed);
        })
    });

  }
};

exports.kirjutaVastused = (req, res, next) => {
    if (req.body !== undefined) {
    //Kysi profiil_kysimustiku_id'd vastavalt bodys oleva kasutaja_id'le ja kysimustik_id'le
    const profiil_kysimustik_id = req.body.profiil_kysimustik_id;
    const kysimusteVastused = req.body.vastused;
    req.status = 0;

    //Kirjuta ennem eneseanalyys ning siis alles vastus kuna 1-1

    //INSERT INTO eneseanalyys (eneseanalyys_tekst) VALUES (kysimusteVastused[i].eneseanalyys);

    db.query('SELECT MAX(eneseanalyys_id) AS eneseanalyys_count FROM eneseanalyys', (error, result, fields) => {
      if (error) throw error;
      let eneseanalyys_count = result[0].eneseanalyys_count + 1;

      let eneseanalyysSQL = 'INSERT INTO eneseanalyys (eneseanalyys_tekst) VALUES ?';
      let eneseanalyysData = [];

      for (let i = 0 ; i < kysimusteVastused.length; ++i) {
        eneseanalyysData = [...eneseanalyysData, [kysimusteVastused[i].enesehinnang]];
      }
      console.log(eneseanalyysData);

      db.query(eneseanalyysSQL, [eneseanalyysData], (error, result, fields) => {
        if (error) throw error;

        //Vahetasin vertabelos ara eneseanalyys_id siin eneseanalyys_eneseanalyys_id
        let vastusSQL = 'INSERT INTO kysimus_vastus (profiil_kysimustik_id, kysimus_id, vastus, eneseanalyys_id) VALUES ?';
        let vastusData = [];
        for (let i = 0; i < kysimusteVastused.length; ++i) {
          vastusData = [...vastusData, [profiil_kysimustik_id, kysimusteVastused[i].id, kysimusteVastused[i].vastus
        ,eneseanalyys_count]];
          ++eneseanalyys_count;
        }
        
        db.query(vastusSQL, [vastusData], (error, result, fields) => {
          if (error) throw error;

            const tagasisideData = req.body.tagasisided;

            let tagasiside = [];

            for (let i = 0 ; i < tagasisideData.length; ++i) {
              tagasiside = [...tagasiside, [tagasisideData[i].protsentuaalne_tagasiside, tagasisideData[i].profiil_kysimustik_id, tagasisideData[i].tagasiside_id]];
            }
            console.log(tagasiside);

            db.query(`INSERT INTO KysimustePlokk_Tagasiside (protsentuaalne_tulemus, profiil_kysimustik_id, tagasiside_id)
            VALUES ?`, [tagasiside],  (error, result, fields) => {
              if (error) throw error;
              req.status = 1;
              next();
            })
        })


      })



    })
    //INSERT INTO kysimus_vastus (profiil_kysimustik_id, kysimus_id, vastus, eneseanalyys_id) VALUES (...);
  }

};

exports.kirjutaVastusedHandler = (req, res) => {
    res.json(req.status);

};

exports.tekitaVastused = (req, res, next) => {
  if (req.body.kasutaja_id !== undefined && req.body.kysimustik_id !== undefined) {
    const kasutaja_id = req.body.kasutaja_id;
    const kysimustik_id = req.body.kysimustik_id;
    db.query(`SELECT profiil_id FROM Profiil WHERE kasutaja_id=${kasutaja_id}`, (error, results) => {
      if(error) throw error;
      var profiil_id;
      console.log("REULTSES: " + results[0].profiil_id);
      profiil_id = results[0].profiil_id;
      db.query(`SELECT * FROM profiil_kysimustik WHERE profiil_id=${profiil_id} AND kysimustik_id=${kysimustik_id}`, (error, results, fields) => {
        if (error) throw error;
  
        console.log(results);
        if (results[0] == undefined) {
            //INESRT INTO profiil_kysimustik (kysimustik_id, profiil_id) VALUES (1, 1);
          db.query(`INSERT INTO profiil_kysimustik (kysimustik_id, profiil_id) VALUES (${kysimustik_id}, ${profiil_id})`, (error, results, fields) => {
            if (error) throw error;
            req.status = 1;
            req.body.profiil_kysimustik_id = results.insertId;
            next();
          });
        }
  
        else {
          req.status = 1;
          req.body.profiil_kysimustik_id = results[0].profiil_kysimustik_id;
          next();
        }
  
      });

      
    })
    
  }

};

exports.tekitaVastusedHandler = (req, res) => {
  res.json({profiil_kysimustik_id: req.body.profiil_kysimustik_id, status: req.status});
};

exports.getKysimused = (req, res, next) => {
    if (req.body.kysimusteplokk_id !== undefined && req.body.kysimustik_id !== undefined) {
        const kysimusteplokk_id = req.body.kysimusteplokk_id;
        const kysimustik_id = req.body.kysimustik_id;
        db.query(`SELECT kysimus_id, kysimus_tekst FROM Kysimus 
        JOIN KysimustePlokk ON Kysimus.kysimusteplokk_id=KysimustePlokk.kysimusteplokk_id 
        WHERE Kysimus.kysimusteplokk_id=${kysimusteplokk_id}
        AND KysimustePlokk.kysimustik_id=${kysimustik_id}`, (error, results, fields) => {
            if (error) throw error;
            const resultsJson = results.map((result) => {
                return Object.assign({}, result);
            })
            req.data = resultsJson;
            next();
        });

    } else if (req.body.count) {
        db.query('SELECT COUNT(kysimusteplokk_id) AS plokkidecount FROM KysimustePlokk;', (error, results, fields) => {
            req.data = results[0].plokkidecount;
            next();
        })
    } else if (req.body.kysimustik !== undefined) {
      //Fix pls
    } else if (req.body.kysimustikud) {
      db.query('SELECT kysimustik_id, kysimustik_pealkiri FROM Kysimustik;', (error, results, fields) => {
        if (error) throw error;
        const resultsJson = results.map((result) => {
          return Object.assign({}, result);
        })
        req.data = resultsJson;
        next();
      });
    }
    
};

exports.getKysimusedHandler = (req, res) => {
    res.json(req.data);
};

exports.getSoovitused = (req, res, next) => {
    if (req.body.kysimusid != undefined || req.body.kysimusid != 0) {
        const kysimus_id = req.body.kysimusid;
        db.query(`SELECT soovitus_tekst FROM Soovitus JOIN Kysimus ON Soovitus.kysimus_id = Kysimus.kysimus_id WHERE Soovitus.kysimus_id=${kysimus_id};`, (error, results, fields) => {
            if (error) throw error;
            if (results.length > 1) {
                const soovitused = results.map((result) => {
                    return Object.assign({}, result);
                })
                req.data = soovitused;
            } else 
            {
                req.data = results[0];
            }
            next();
        })
    }
};

exports.getSoovitusedHandler = (req, res) => {
    res.json(req.data);
};

exports.getFeedback = (req, res, next) => {
  if (req.body.percentage !== undefined && req.body.questionblock_id !== undefined) {
    const percentage = req.body.percentage;
    const questionblock_id = req.body.questionblock_id;

    console.log("percentage: " + percentage + " questionblock_id: " + questionblock_id);


    db.query(`SELECT tagasiside_id, tagasiside_tekst FROM Tagasiside WHERE kysimusteplokk_id=${questionblock_id} AND ${percentage} >= vahemikMin AND ${percentage} <= vahemikMax`,
    (error, results, fields) => {
      if (error) throw error;

      if (results != undefined) {
        req.data = {tagasiside_tekst: results[0].tagasiside_tekst, tagasiside_id: results[0].tagasiside_id};
      } else {
        req.data = "";
      }
      next();
    })
  } else {
    req.data = 0;
    next();
  }


};

exports.getFeedbackHandler = (req, res) => {
    res.json(req.data);
};

//INSERT INTO kysimusteplokk_tagasiside (protsentuaalne_tulemus, profiil_kysimustik_id, tagasiside_id) VALUES ?;
exports.saveFeedback = (req, res) => {
  if (req.body.protsentuaalne_tagasiside !== undefined, req.body.profiil_kysimustik_id !== undefined, req.body.tagasiside_id !== undefined) {
    const protsent = req.body.protsentuaalne_tagasiside;
    const profiil_kysimustik_id = req.body.profiil_kysimustik_id;
    const tagasiside_id = req.body.tagasiside_id;
    db.query(`INSERT INTO KysimustePlokk_Tagasiside (protsentuaalne_tulemus, profiil_kysimustik_id, tagasiside_id)
    VALUES (${protsent}, ${profiil_kysimustik_id}, ${tagasiside_id})`, (error, result, fields) => {
      if (error) throw error;
    })
  }
};

exports.saveFinalResult = (req, res) => {
  if (req.body.percentage !== undefined) {
    const finalResult = req.body.percentage;
    const profiil_kysimustik_id = req.body.profiil_kysimustik_id;

    db.query(`UPDATE profiil_kysimustik SET kysimustik_protsentuaalne_tagasiside=${finalResult} WHERE profiil_kysimustik_id=${profiil_kysimustik_id}`, (error, results, fields) => {
      if (error) throw error;
    })
  }

};