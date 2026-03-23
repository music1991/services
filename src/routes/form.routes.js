const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

router.post('/', formController.handleGoogleFormsWebhook);

router.get('/', (req, res) => {
  res.json({ message: "El endpoint de formularios está VIVO", path: "/api/form/test" });
});

module.exports = router; 