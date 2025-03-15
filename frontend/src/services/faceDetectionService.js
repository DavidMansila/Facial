export const detectFaces = async (imageData) => {
  try {
    const response = await fetch('http://localhost:5000/api/detect-faces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }), // Enviamos la imagen como base64
    });

    const data = await response.json();
    return data.faces; // Devolvemos las coordenadas de los rostros
  } catch (error) {
    console.error('Error al enviar la imagen al backend:', error);
    throw new Error('Error detecting faces');
  }
};