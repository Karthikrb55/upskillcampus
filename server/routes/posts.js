const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.get('/', async (req, res) => {
  const posts = await Post.find().limit(20).sort({ createdAt: -1 })
  res.json(posts)
})

router.post('/', async (req, res) => {
  const p = await Post.create(req.body)
  res.json(p)
})

module.exports = router
