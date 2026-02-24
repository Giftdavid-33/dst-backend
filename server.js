const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'Davidskiltech backend is running' }));
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required.' });
  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: process.env.EMAIL_USER, subject: `New message from ${name}`, html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Message:</b> ${message}</p>` });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: `Thanks for reaching out, ${name}!`, html: `<p>Hi ${name}, thanks for contacting Davidskiltech! We'll get back to you shortly.</p>` });
    res.status(200).json({ message: "Message sent successfully! We'll be in touch soon." });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to send message.' }); }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
