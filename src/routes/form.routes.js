const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

router.post('/', formController.handleGoogleFormsWebhook);
router.patch('/', formController.updateEvaluationStatus);

module.exports = router;
