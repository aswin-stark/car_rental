// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email route
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ajayaswin521@gmail.com',       // 🔁 Your Gmail
      pass: 'kump byiz aodp vfva'           // 🔁 Gmail App Password (see previous message)
    }
  });

  const mailOptions = {
    from: email,
    to: 'ajayaswin521@gmail.com',           // 🔁 Your receiving address
    subject: `Contact Form: ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Failed to send email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully!');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
