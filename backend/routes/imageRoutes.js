const express = require('express');
const imageController = require('../controllers/imageController');
const upload = require('../utils/multerConfig'); // Configuración de Multer para subir imágenes

const router = express.Router();

router.post('/process-image', upload.single('image'), imageController.processImage);

module.exports = router;