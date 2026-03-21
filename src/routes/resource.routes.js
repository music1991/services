const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const resourceController = require('../controllers/resource.controller');

router.get('/', resourceController.getResources); //no se usa aun desde front

router.get('/:id', resourceController.getById);  //no se usa aun desde front

router.post('/', upload.single('file'), resourceController.uploadResource);

module.exports = router;
