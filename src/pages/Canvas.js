import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import Word from './Word';
import { useNavigate, useLocation } from 'react-router-dom';

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const uploadedImageFile = location.state ? location.state.uploadedImageFile : null;

  useEffect(() => {
    if (canvas && uploadedImage) {
      resizeAndLoadImageToCanvas(uploadedImage);
    }
  }, [canvas, uploadedImage]);

  const resizeAndLoadImageToCanvas = (image) => {
    const canvasTemp = document.createElement('canvas');
    const ctx = canvasTemp.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      canvasTemp.width = canvas.width;
      canvasTemp.height = canvas.height;

      ctx.drawImage(img, 0, 0, canvasTemp.width, canvasTemp.height);

      setUploadedImage(canvasTemp.toDataURL('image/png'));

      const fabricImg = new fabric.Image(img, {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      });
      canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas));
    };
    img.src = image;
  };

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
      fill: 'red',
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
      addWordToCanvas(customText, 20, 20);
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

  useEffect(() => {
    if (uploadedImageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(uploadedImageFile);
    }
  }, [uploadedImageFile]);

  const handleProceed = () => {
    navigate('/excel', {
      state: {
        annotations: annotations,
        canvasImage: canvas.toDataURL('image/png'),
        resizedImage: uploadedImage
      }
    });
  };

  return (
    <div className="flex">
      <div className="w-1/3 p-4 mt-12">
        <h2>Words</h2>
        <div id="words">
          <Word text="Word1" onClick={() => addWordToCanvas("Word1", 20, 20)} />
          <Word text="Word2" onClick={() => addWordToCanvas("Word2", 20, 50)} />
        </div>
        <div>
          <input className='text-white font-urbanist bg-transparent' type="text" value={customText} onChange={handleCustomTextChange} />
          <button onClick={handleCustomTextAdd}>Add Custom Text</button>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <div
          className="canvas-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <canvas
            id="canvas"
            ref={(ref) => {
              if (ref && !canvas) {
                const newCanvas = new fabric.Canvas(ref, { width: 800, height: 600 });
                setCanvas(newCanvas);
              }
            }}
          />
        </div>
        <div>
          <h2>Annotations</h2>
          <ul>
            {annotations.map((annotation, index) => (
              <li className='text-white' key={index}>
                {annotation.word} - <button onClick={() => handleDeleteWord(annotation.word)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleProceed} className="mt-4 ml-auto mr-auto block">Proceed</button>
      </div>
    </div>
  );
};

export default Canvas;
