const mongoose = require('mongoose');
const Face = require('../backend/app/models/FaceModel');
const fs = require('fs');
const path = require('path');

const connectDB = require('../backend/config/db');

connectDB();

const loadImages = async () => {
    const imagesDir = path.join(__dirname, 'test-images');
    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
        const imageBuffer = fs.readFileSync(path.join(imagesDir, file));
        const faceData = await faceService.detectFaces(imageBuffer);
        const face = new Face({ faceData });
        await face.save();
    }

    console.log('Images loaded successfully');
    process.exit();
};

loadImages();