const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const faceapi = require('face-api.js');

const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS
app.use(cors());

// Middleware para manejar datos JSON grandes
app.use(bodyParser.json({ limit: '50mb' }));

// Cargar los modelos de face-api.js
const MODEL_URL = path.join(__dirname, '/models');

// Cargar los modelos de face-api.js desde el disco
faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

// Ruta para la detección y comparación de rostros
app.post('/api/detect-faces', async (req, res) => {
  try {
    const { image } = req.body;

    // Decodificar la imagen base64
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, ""); // Eliminamos el encabezado base64
    const buffer = Buffer.from(base64Data, 'base64'); // Convertirla en un buffer

    // Crear un archivo temporal para la imagen
    const tmpFilePath = './tmpImage.jpg';  // Ruta temporal
    fs.writeFileSync(tmpFilePath, buffer); // Guardar la imagen como archivo temporal

    // Cargar la imagen para usarla con face-api.js
    const img = await faceapi.fetchImage(tmpFilePath);

    // Detectar rostros
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    // Procesar las detecciones y devolver las coordenadas
    const faces = detections.map((detection, index) => ({
      id: index + 1,
      x: detection.detection.box.x,
      y: detection.detection.box.y,
      width: detection.detection.box.width,
      height: detection.detection.box.height
    }));

    // Responder con las coordenadas de los rostros detectados
    res.json({ facesDetected: faces.length, faces });

    // Limpiar el archivo temporal
    fs.unlinkSync(tmpFilePath);
  } catch (error) {
    console.error('Error detecting faces:', error);
    res.status(500).json({ message: 'Error detecting faces' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});