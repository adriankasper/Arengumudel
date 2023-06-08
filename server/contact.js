const nodemailer = require("nodemailer")
const express = require('express');
const router = express.Router();

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "opetajaprofareng@gmail.com",
    pass: "Opetajaareng1!",
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Valmis saatma");
  }
});

exports.contactRoute = (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message; 
  const mail = {
    from: name,
    to: "opetajaprofareng@gmail.com",
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.status(200).json({ status: "Message Sent" });
    }
  });
};