import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import canvas from "canvas";
import * as faceapi from "face-api.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuración para archivos (imágenes subidas)
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar modelos de detección de rostros
const MODEL_URL = path.join(__dirname, "/models");
await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

let knownFaces = []; // Aquí se almacenarán los rostros conocidos

// Ruta para subir imágenes y detectar rostros
app.post("/api/detect-faces", upload.single("image"), async (req, res) => {
    try {
        const imgPath = req.file.path;
        const img = await canvas.loadImage(imgPath);
        const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

        fs.unlinkSync(imgPath); // Eliminar la imagen después de analizarla

        res.json({ detections });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar la imagen." });
    }
});

// Ruta para agregar rostros conocidos
app.post("/api/add-face", upload.single("image"), async (req, res) => {
    try {
        const imgPath = req.file.path;
        const img = await canvas.loadImage(imgPath);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detections) {
            return res.status(400).json({ error: "No se encontró un rostro en la imagen." });
        }

        knownFaces.push({ descriptor: detections.descriptor });

        fs.unlinkSync(imgPath);
        res.json({ message: "Rostro agregado con éxito." });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el rostro." });
    }
});

// Ruta para comparar rostros
app.post("/api/match-face", upload.single("image"), async (req, res) => {
    try {
        const imgPath = req.file.path;
        const img = await canvas.loadImage(imgPath);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detections) {
            return res.status(400).json({ error: "No se encontró un rostro en la imagen." });
        }

        let bestMatch = null;
        let bestDistance = Infinity;

        knownFaces.forEach((face) => {
            const distance = faceapi.euclideanDistance(detections.descriptor, face.descriptor);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = face;
            }
        });

        fs.unlinkSync(imgPath);
        res.json({ match: bestMatch, distance: bestDistance });
    } catch (error) {
        res.status(500).json({ error: "Error al comparar el rostro." });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
