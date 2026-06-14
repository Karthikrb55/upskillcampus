const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 })
  res.json(posts)
})

router.get('/:id', auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id })
  if (!post) return res.status(404).json({ msg: 'Not found' })
  res.json(post)
})

router.post('/', auth, async (req, res) => {
  const slug = req.body.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || Date.now().toString()
  const post = await Post.create({ ...req.body, slug, author: req.user.id })
  res.json(post)
})

router.put('/:id', auth, async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, author: req.user.id },
    req.body,
    { new: true }
  )
  if (!post) return res.status(404).json({ msg: 'Not found' })
  res.json(post)
})

router.delete('/:id', auth, async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id })
  res.json({ msg: 'Deleted' })
})

module.exports = router
