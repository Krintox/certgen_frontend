import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image file
  const [customText, setCustomText] = useState('');
  const [excelFile, setExcelFile] = useState(null); // State to hold the Excel file

  useEffect(() => {
    if (canvas) {
      canvas.on('object:moving', (e) => {
        const obj = e.target;
        const boundingBox = obj.getBoundingRect();
        const word = obj.text;

        const updatedAnnotations = annotations.map(annotation => {
          if (annotation.word === word) {
            return {
              ...annotation,
              boundingBox: {
                left: boundingBox.left,
                top: boundingBox.top,
                width: boundingBox.width,
                height: boundingBox.height
              }
            };
          }
          return annotation;
        });
        setAnnotations(updatedAnnotations);
      });
    }
  }, [canvas, annotations]);

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

  const handleDeleteWord = (word) => {
    const updatedAnnotations = annotations.filter(annotation => annotation.word !== word);
    setAnnotations(updatedAnnotations);
    canvas.forEachObject(obj => {
      if (obj.text === word) {
        canvas.remove(obj);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the uploaded image file
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const fabricImg = new fabric.Image(img, {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
        canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (!canvas || !imageFile || !excelFile) {
      console.error("Canvas, image, or Excel file is missing.");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvasData = canvas.toDataURL({ format: 'png', multiplier: 1 });
      const resizedCanvas = document.createElement('canvas');
      const resizedCanvasContext = resizedCanvas.getContext('2d');

      // Set the dimensions of the resized canvas to match the canvas
      resizedCanvas.width = canvas.width;
      resizedCanvas.height = canvas.height;

      // Draw the image onto the resized canvas
      resizedCanvasContext.drawImage(img, 0, 0, resizedCanvas.width, resizedCanvas.height);

      // Convert the resized canvas to a blob
      resizedCanvas.toBlob(blob => {
        // Create a new FormData object
        const formData = new FormData();

        // Append the resized image blob as 'image' to the FormData object
        formData.append('image', blob);

        // Append the Excel file to the FormData object
        formData.append('excel', excelFile);

        // Append the annotations as JSON string to the FormData object
        formData.append('coordinates', JSON.stringify(annotations));

        // Send a POST request to the backend with the FormData
        axios.post('https://aliws.pythonanywhere.com/api', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log('Response from server:', response.data); // Log the response data
        })
        .catch(error => {
          console.error('Error saving image:', error);
        });
      }, 'image/png');
    };

    img.src = URL.createObjectURL(imageFile); // Load the original image
  };

  return (
    <div className="flex">
      <div className="w-1/3 p-4">
        <h2>Words</h2>
        <div id="words">
          {/* Add more words here */}
        </div>
        <div>
          <input type="text" value={customText} onChange={handleCustomTextChange} />
          <button onClick={handleCustomTextAdd}>Add Custom Text</button>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files[0])} /> {/* Input field for Excel file */}
        <div
          className="canvas-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <canvas
            id="canvas"
            ref={(ref) => {
              if (ref && !canvas) {
                const newCanvas = new fabric.Canvas(ref,{ width: 800, height: 600 });
                setCanvas(newCanvas);
              }
            }}
          />
        </div>
        <div>
          <h2>Annotations</h2>
          <ul>
            {annotations.map((annotation, index) => (
              <li key={index}>
                {annotation.word} - Left: {annotation.boundingBox.left}, Top: {annotation.boundingBox.top}, Width: {annotation.boundingBox.width}, Height: {annotation.boundingBox.height}, Font Size: {annotation.fontSize}
                <button onClick={() => handleDeleteWord(annotation.word)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleSaveImage}>Save Image</button>
      </div>
    </div>
  );
};

export default Canvas;
