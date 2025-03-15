const sharp = require('sharp');

exports.preprocessImage = async (imageBuffer) => {
    return await sharp(imageBuffer)
        .resize(224, 224) // Redimensionar la imagen para el modelo
        .toBuffer();
};