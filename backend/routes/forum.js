const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create post
router.post('/posts', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({ title, content, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create comment
router.post('/posts/:id/comments', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const comment = new Comment({ content, author: req.user.id, post: req.params.id });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update comment
router.put('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    comment.content = req.body.content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete comment
router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
