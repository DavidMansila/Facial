import React, { useState, useRef } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null);
  const [facesDetected, setFacesDetected] = useState(0);
  const [faces, setFaces] = useState([]);
  const [similarImages, setSimilarImages] = useState([]); // Estado para imágenes similares
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/detect-faces", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFacesDetected(response.data.facesDetected);
      setFaces(response.data.faces);

      // Simular la obtención de imágenes similares (puedes reemplazar esto con una API real)
      const mockSimilarImages = [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ];
      setSimilarImages(mockSimilarImages);
    } catch (error) {
      console.error("Error en la detección de rostros:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reconocimiento Facial</h2>
      <p style={styles.description}>Sube una imagen para detectar rostros y encontrar imágenes similares.</p>

      <div style={styles.uploadSection}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={styles.uploadInput}
        />
        <button
          onClick={handleUpload}
          style={styles.uploadButton}
        >
          Subir y Analizar
        </button>
      </div>

      {image && (
        <div style={styles.imageContainer}>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={styles.previewImage}
          />
          {faces.map((face, index) => (
            <div
              key={index}
              style={{
                ...styles.faceBox,
                top: `${face.y}px`,
                left: `${face.x}px`,
                width: `${face.width}px`,
                height: `${face.height}px`,
              }}
            />
          ))}
        </div>
      )}

      {facesDetected > 0 && (
        <h3 style={styles.result}>Rostros detectados: {facesDetected}</h3>
      )}

      {similarImages.length > 0 && (
        <div style={styles.similarImagesContainer}>
          <h3 style={styles.similarImagesTitle}>Imágenes Similares</h3>
          <div style={styles.similarImagesGrid}>
            {similarImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Similar ${index}`}
                style={styles.similarImage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "50px auto",
  },
  title: {
    fontSize: "2em",
    marginBottom: "10px",
    color: "#333",
  },
  description: {
    fontSize: "1.1em",
    color: "#555",
    marginBottom: "20px",
  },
  uploadSection: {
    marginBottom: "20px",
  },
  uploadInput: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    backgroundColor: "#fff",
    cursor: "pointer",
    width: "200px",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1.1em",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  uploadButtonHover: {
    backgroundColor: "#0056b3",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
    marginTop: "20px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  previewImage: {
    width: "100%",
    maxWidth: "100%",
    borderRadius: "10px",
    display: "block",
  },
  faceBox: {
    position: "absolute",
    border: "2px solid red",
    borderRadius: "5px",
  },
  result: {
    marginTop: "20px",
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "#333",
  },
  similarImagesContainer: {
    marginTop: "30px",
  },
  similarImagesTitle: {
    fontSize: "1.5em",
    marginBottom: "15px",
    color: "#333",
  },
  similarImagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "10px",
  },
  similarImage: {
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
    cursor: "pointer",
  },
  similarImageHover: {
    transform: "scale(1.05)",
  },
};

export default App;