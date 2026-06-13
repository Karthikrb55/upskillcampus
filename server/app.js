const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(express.json())

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// basic health
app.get('/', (req, res) => res.send('Server running on ' + (process.env.PORT || 5000)))

// API health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// connect to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn('MongoDB connection warning:', err.message))

// routes (placeholders)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server listening on', PORT))
