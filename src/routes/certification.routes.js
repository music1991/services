const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');

router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  const fileUrl = process.env.NODE_ENV === 'production'
    ? req.file.path
    : `http://localhost:4000/uploads/${req.file.filename}`;

  res.status(200).json({ success: true, fileUrl });
});

module.exports = router;
