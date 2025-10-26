const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your frontend HTML/CSS/JS

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/car_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ajayaswin521@gmail.com",
    pass: "uizg bgib iwac jvpz" // App Password, not Gmail login
  }
});

// ===========================
// 🔐 Signup API
// ===========================
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================
// 🔓 Login API
// ===========================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================
// 📧 Email Subscription API
// ===========================
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: "ajayaswin521@gmail.com",
    to: email,
    subject: "Subscription Confirmation - Car Rental Service",
    text: "You are subscribed to our Car Rental Service. We will notify you with the latest updates about us."
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// ===========================
// 🚀 Start Server
// ===========================
app.listen(PORT, () => {
  // ===========================
// 📩 Contact Form Email API
// ===========================
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send("All fields are required.");
  }

  const mailOptions = {
    from: "ajayaswin521@gmail.com",
    to: "ajayaswin521@gmail.com", // receive messages at your own inbox
    subject: `New Contact Message: ${subject}`,
    text: `
You received a new message from the contact form:

Name: ${name}
Email: ${email}
Subject: ${subject}
Message:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("✅ Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("❌ Failed to send message. Try again later.");
  }
});

  console.log(`🚗 Server running at http://localhost:${PORT}`);
});
