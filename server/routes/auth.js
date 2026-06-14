const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ msg: 'Missing fields' })
  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ msg: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
})

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
})

module.exports = router
