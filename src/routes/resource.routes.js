const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const resourceController = require('../controllers/resource.controller');

router.get('/', resourceController.getResources); //no se usa aun desde front

router.get('/:id', resourceController.getById);  //no se usa aun desde front

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // ESTE LOG TE DIRÁ EL ERROR REAL (Ej: "File too large" o "Invalid API Key")
      console.error("❌ ERROR EN LA SUBIDA:", err.message);
      return res.status(500).json({ error: err.message });
    }
    next(); // Si no hay error, va a tu controlador
  });
}, resourceController.uploadResource);

module.exports = router;
