const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, index: true },
  content: String,
  coverImage: String,
  tags: [String],
  pageBlocks: { type: Array, default: [] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)
