const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up transporter (your Gmail and app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ajayaswin521@gmail.com',
    pass: 'uizgbgibiwacjvpz' // use the correct app password here
  }
});

// 🔴 1. Enquiry Route (/send-email)
app.post('/send-email', (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'ajayaswin521@gmail.com',
    subject: `Contact Form: ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Enquiry Email Error:', error);
      return res.status(500).send('Failed to send enquiry email');
    }
    console.log('Enquiry Email sent:', info.response);
    res.status(200).send('Enquiry email sent successfully!');
  });
});

// 🔵 2. Subscription Route (/subscribe)
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: 'ajayaswin521@gmail.com',
    to: email,
    subject: 'Subscription Confirmation - Car Rental Service',
    text: 'You are subscribed to our Car Rental Service. We will notify you with the latest updates about us.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Subscription Email Error:', error);
      return res.status(500).json({ error: 'Failed to send subscription email.' });
    }
    console.log('Subscription Email sent:', info.response);
    res.status(200).json({ message: 'Subscription email sent successfully.' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
