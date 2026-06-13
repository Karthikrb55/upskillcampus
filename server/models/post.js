const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, index: true },
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)
