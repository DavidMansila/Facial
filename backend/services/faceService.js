const Face = require('../models/faceModel');
const faceapi = require('face-api.js'); // Asumiendo que usas face-api.js

exports.detectFaces = async (imageBuffer) => {
    const detections = await faceapi.detectAllFaces(imageBuffer).withFaceDescriptors();
    return detections.map(detection => detection.descriptor);
};