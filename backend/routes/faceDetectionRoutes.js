const express = require('express');
const router = express.Router();
const faceDetectionController = require('../controllers/faceDetectionController');

// Ruta para la detección de rostros
router.post('/detect-faces', faceDetectionController.detectFaces);

module.exports = router;