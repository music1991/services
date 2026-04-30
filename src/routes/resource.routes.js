const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const resourceController = require('../controllers/resource.controller');

router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getById);

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Error en la subida de archivo:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, resourceController.uploadResource);

module.exports = router;
