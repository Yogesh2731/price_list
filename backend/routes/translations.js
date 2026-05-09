const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/translations/:lang
// Returns all translation key-value pairs for the given language (en or sv)
router.get('/:lang', async (req, res) => {
  const { lang } = req.params;

  if (!['en', 'sv'].includes(lang)) {
    return res.status(400).json({ error: 'Unsupported language. Use "en" or "sv".' });
  }

  try {
    const result = await pool.query(
      'SELECT key, value FROM translations WHERE lang = $1',
      [lang]
    );

    const map = {};
    result.rows.forEach((row) => {
      map[row.key] = row.value;
    });

    res.json({ lang, translations: map });
  } catch (err) {
    console.error('Translations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;