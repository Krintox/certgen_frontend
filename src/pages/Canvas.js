import React, { useState } from 'react';
import { fabric } from 'fabric';
import Word from './Word';

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [customText, setCustomText] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    const { offsetX, offsetY } = e.nativeEvent;
    addWordToCanvas(word, offsetX, offsetY);
  };

  const addWordToCanvas = (word, x, y) => {
    const text = new fabric.Text(word, {
      left: x,
      top: y,
      fontSize: 20,
      fill: 'red', // Customize as needed
    });
    canvas.add(text);

    const boundingBox = text.getBoundingRect();
    const newAnnotation = {
      word: word,
      boundingBox: {
        left: boundingBox.left,
        top: boundingBox.top,
        width: boundingBox.width,
        height: boundingBox.height
      },
      fontSize: 20
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const handleCustomTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const handleCustomTextAdd = () => {
    if (customText.trim() !== '') {
      addWordToCanvas(customText, 20, 20); // Add custom text at fixed position (you can modify as needed)
      setCustomText('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const fabricImg = new fabric.Image(img, {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
        canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas));
        setImageURL(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div
        className="canvas-container"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <canvas
          id="canvas"
          ref={(ref) => {
            if (ref && !canvas) {
              const newCanvas = new fabric.Canvas(ref);
              setCanvas(newCanvas);
            }
          }}
        />
        <div id="words">
          <Word text="Word1" />
          <Word text="Word2" />
          {/* Add more words here */}
        </div>
        <div>
          <input type="text" value={customText} onChange={handleCustomTextChange} />
          <button onClick={handleCustomTextAdd}>Add Custom Text</button>
        </div>
      </div>
      <div>
        <h2>Annotations</h2>
        <ul>
          {annotations.map((annotation, index) => (
            <li key={index}>
              {annotation.word} - Left: {annotation.boundingBox.left}, Top: {annotation.boundingBox.top}, Width: {annotation.boundingBox.width}, Height: {annotation.boundingBox.height}, Font Size: {annotation.fontSize}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Canvas;
