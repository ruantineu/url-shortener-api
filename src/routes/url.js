const express = require('express');
const { nanoid } = require('nanoid');
const yup = require('yup');
const Url = require('../models/Url');
const { authenticate } = require('../middleware/auth');
const { validateUrl } = require('../utils/validateUrl');
const router = express.Router();

// Validation schema for URL
const urlSchema = yup.object({
  original_url: yup.string().required(),
});

// Shorten URL
router.post('/short', async (req, res) => {
  try {
    await urlSchema.validate(req.body);
    const { original_url } = req.body;

    if (!validateUrl(original_url)) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    const short_url = nanoid(6);
    const url = await Url.create({
      original_url,
      short_url,
      user_id: req.user?.id || null,
    });

    res.json({ short_url: `${process.env.BASE_URL}/${short_url}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List URLs (authenticated)
router.get('/urls', authenticate, async (req, res) => {
  try {
    const urls = await Url.findAll({
      where: { user_id: req.user.id, deleted_at: null },
      attributes: ['id', 'original_url', 'short_url', 'clicks', 'created_at', 'updated_at'],
    });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update URL (authenticated)
router.put('/urls/:id', authenticate, async (req, res) => {
  try {
    await urlSchema.validate(req.body);
    const { original_url } = req.body;

    if (!validateUrl(original_url)) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    const url = await Url.findOne({
      where: { id: req.params.id, user_id: req.user.id, deleted_at: null },
    });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    url.original_url = original_url;
    url.updated_at = new Date();
    await url.save();

    res.json({ message: 'URL updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete URL (authenticated, logical delete)
router.delete('/urls/:id', authenticate, async (req, res) => {
  try {
    const url = await Url.findOne({
      where: { id: req.params.id, user_id: req.user.id, deleted_at: null },
    });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    url.deleted_at = new Date();
    await url.save();

    res.json({ message: 'URL deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redirect and count clicks
router.get('/:short_url', async (req, res) => {
  try {
    const url = await Url.findOne({
      where: { short_url: req.params.short_url, deleted_at: null },
    });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.original_url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;