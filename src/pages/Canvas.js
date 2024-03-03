import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import Word from './Word';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [customText, setCustomText] = useState('');

  const location = useLocation();
  const uploadedImageFile = location.state ? location.state.uploadedImageFile : null;

  useEffect(() => {
    if (canvas && uploadedImageFile) {
      loadImageToCanvas(uploadedImageFile);
    }
  }, [canvas, uploadedImageFile]);

  useEffect(() => {
    if (!canvas) {
      const newCanvas = new fabric.Canvas('canvas', { width: 800, height: 600 });
      setCanvas(newCanvas);
    }
  }, [canvas]);

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

  const loadImageToCanvas = (file) => {
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
  
  const navigate = useNavigate();

  const handleProceed = () => {
    // Add logic here to customize the redirection as needed
    navigate('/excel');
  };
  

  return (
    <div className="flex">
      <div className="w-1/3 p-4">
        <h2>Wo<span className='text-orange-500'>rds</span></h2>
        <div id="words" className='text-white'>
          <Word text="Word1" />
          <Word text="Word2" />
          {/* Add more words here */}
        </div>
        <div>
          <input type="text" value={customText} onChange={handleCustomTextChange} />
          <button onClick={handleCustomTextAdd}>Add Custom Text</button>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <div
          className="canvas-container pt-4"
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
              <li key={index} className="text-white">
                {annotation.word} - Left: {annotation.boundingBox.left}, Top: {annotation.boundingBox.top}, Width: {annotation.boundingBox.width}, Height: {annotation.boundingBox.height}, Font Size: {annotation.fontSize}
              <div className='flex items-center pt-4'>
              <button onClick={() => handleDeleteWord(annotation.word)} className="ml-2">Delete</button>
              <button onClick={handleProceed} className="ml-2">Proceed</button>
              </div>
            </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
