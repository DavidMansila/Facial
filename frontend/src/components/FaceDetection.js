import React, { useState, useEffect } from 'react';
import { detectFaces } from '../services/faceDetectionService';
import './FaceDetection.css';

const FaceDetection = () => {
  const [faces, setFaces] = useState([]);
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (imageData) {
      setLoading(true);
      detectFaces(imageData)
        .then((facesData) => {
          setFaces(facesData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [imageData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result); // Convertimos la imagen a base64
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFaces = () => {
    return faces.map((face) => (
      <div
        key={face.id}
        className="face-box"
        style={{
          top: `${face.y}px`,
          left: `${face.x}px`,
          width: `${face.width}px`,
          height: `${face.height}px`,
        }}
      />
    ));
  };

  return (
    <div className="container">
      <h1 className="title">Reconocimiento Facial</h1>
      <p className="description">Sube una imagen y encuentra los rostros detectados en ella.</p>

      <div className="upload-container">
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="upload-input"
        />
        {loading && <p className="loading-text">Detectando rostros...</p>}
      </div>

      {imageData && (
        <div className="image-container">
          <img src={imageData} alt="Uploaded" className="uploaded-image" />
          {renderFaces()}
        </div>
      )}
    </div>
  );
};

export default FaceDetection;