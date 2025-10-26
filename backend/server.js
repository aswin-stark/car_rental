const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect("mongodb://127.0.0.1:27017/car_rental", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    const userSchema = new mongoose.Schema({
      username: { type: String, unique: true, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      role: { type: String, default: "user" },
    });
    const User = mongoose.model("User", userSchema);

    const existingAdmin = await User.findOne({ username: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Default admin created: username='admin', password='admin123'");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// ===== Booking Schema =====
const bookingSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    carName: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupDate: { type: String, required: true },
    dropoffDate: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

// ===== Nodemailer Setup (Direct Gmail App Password) =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ajayaswin521@gmail.com",
    pass: "onvbsiufqxtxoasx", // ✅ App Password directly added
  },
});

// ===== OTP Memory Storage =====
const otpStore = new Map();

// ===== APIs =====

// Signup
app.post("/api/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const User = mongoose.model("User");
  try {
    if (await User.findOne({ username }))
      return res.status(400).json({ error: "Username exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword, role: role || "user" });
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const User = mongoose.model("User");
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid username/password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid username/password" });
    res.status(200).json({ message: "Login successful", user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const User = mongoose.model("User");
  try {
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) return res.status(401).json({ error: "Invalid admin credentials" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid admin credentials" });
    res.status(200).json({ message: "Admin login successful", admin: { username: admin.username } });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Book Car
app.post("/api/book", async (req, res) => {
  let { username, carName, pickupLocation, dropoffLocation, pickupDate, dropoffDate, totalPrice } = req.body;
  if (typeof totalPrice === "string") totalPrice = parseFloat(totalPrice.replace(/[^0-9.]/g, "")) || 0;

  if (!username || !carName || !pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate || !totalPrice)
    return res.status(400).json({ error: "All booking details are required" });

  try {
    const overlappingBooking = await Booking.findOne({
      carName,
      status: "booked",
      $or: [{ pickupDate: { $lte: dropoffDate }, dropoffDate: { $gte: pickupDate } }],
    });
    if (overlappingBooking) return res.status(400).json({ error: "Car already booked for selected dates" });

    const savedBooking = await new Booking({ username, carName, pickupLocation, dropoffLocation, pickupDate, dropoffDate, totalPrice: Number(totalPrice), status: "booked" }).save();
    res.status(201).json({ message: "Booking successful", booking: savedBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel Booking
app.post("/api/cancel", async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    booking.status = "canceled";
    await booking.save();
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get All Bookings
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Subscribe Email
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    from: "ajayaswin521@gmail.com",
    to: email,
    subject: "Subscription Confirmation",
    text: "You are subscribed to our Car Rental Service.",
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Contact Form Email
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).send("All fields are required.");
  try {
    await transporter.sendMail({ from: "ajayaswin521@gmail.com", to: "ajayaswin521@gmail.com", subject: `New Contact Message: ${subject}`, text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}` });
    res.status(200).send("✅ Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("❌ Failed to send message. Try again later.");
  }
});

// Get All Booked Dates
app.get("/api/booked-dates", async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "booked" });
    res.json(bookings.map((b) => ({ pickupDate: b.pickupDate, dropoffDate: b.dropoffDate })));
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot Password (Send OTP)
app.post("/api/forgot-password", async (req, res) => {
  const { username, email } = req.body;
  const User = mongoose.model("User");
  try {
    const user = await User.findOne({ username, email });
    if (!user) return res.status(400).json({ error: "Invalid username or email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(username, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await transporter.sendMail({ from: "ajayaswin521@gmail.com", to: email, subject: "Car Rental OTP", text: `Your OTP is: ${otp}. Valid for 5 minutes.` });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset Password
app.post("/api/reset-password", async (req, res) => {
  const { username, otp, newPassword } = req.body;
  const User = mongoose.model("User");
  try {
    const record = otpStore.get(username);
    if (!record) return res.status(400).json({ error: "OTP not found or expired" });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(username);
      return res.status(400).json({ error: "OTP expired" });
    }
    if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ username }, { password: hashedPassword });
    otpStore.delete(username);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// In server.js (already present in your code, confirm this):
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    from: "ajayaswin521@gmail.com",
    to: email,
    subject: "Subscription Confirmation",
    text: "You are subscribed to our Car Rental Service."
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// DELETE cancelled booking
app.delete("/api/delete", async (req, res) => {
  const { bookingId } = req.body;
  try {
    await Booking.findByIdAndDelete(bookingId);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});


// Start Server
app.listen(PORT, () => console.log(`🚗 Server running at http://localhost:${PORT}`));
