const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faceapi = require('face-api.js');
const fs = require('fs');
const path = require('path');
const canvas = require('canvas'); // Necesario para `face-api.js`

// Inicializamos el servidor de Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware para aceptar datos JSON
app.use(bodyParser.json({ limit: '50mb' })); // Para imágenes grandes

// Habilitar CORS para el frontend
app.use(cors());

// Cargar los modelos de `face-api.js`
const MODEL_URL = path.join(__dirname, '/models');
faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

// Ruta para la detección de rostros
app.post('/api/detect-faces', async (req, res) => {
  try {
    const { image } = req.body;

    // Convertir la imagen base64 a Buffer
    const imgBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Crear una imagen desde el buffer
    const img = await canvas.loadImage(imgBuffer);

    // Detectar rostros usando face-api.js
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    // Mapear las detecciones y devolver las coordenadas
    const faces = detections.map((detection, index) => ({
      id: index + 1,
      x: detection.detection.box.x,
      y: detection.detection.box.y,
      width: detection.detection.box.width,
      height: detection.detection.box.height,
    }));

    // Enviar las coordenadas de los rostros detectados
    res.json({ facesDetected: faces.length, faces });
  } catch (error) {
    console.error('Error en la detección de rostros:', error);
    res.status(500).json({ message: 'Error detecting faces' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});