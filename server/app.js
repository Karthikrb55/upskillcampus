const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

app.use('/uploads', express.static(uploadDir))

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cms')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn('MongoDB warning:', err.message))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server listening on', PORT))
