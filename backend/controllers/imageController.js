const faceService = require('../services/faceService');
const imageUtils = require('../utils/imageUtils');

exports.processImage = async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;
        const processedImage = await imageUtils.preprocessImage(imageBuffer);
        const faceData = await faceService.detectFaces(processedImage);
        res.json({ success: true, data: faceData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};