const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Adicionado
const yup = require('yup');
const User = require('../models/User');
const router = express.Router();

const registerSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

// Register
router.post('/register', async (req, res) => {
  try {
    await registerSchema.validate(req.body);
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    await loginSchema.validate(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) { // Compara a senha
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;