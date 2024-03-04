import React, { useState } from 'react';
import { fabric } from 'fabric';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [customText, setCustomText] = useState('');
  const [fontColor, setFontColor] = useState('#000000'); // Default color is black
  const [selectedFont, setSelectedFont] = useState(null);
  const [attributes, setAttributes] = useState([
    "Recipient's Name",
    'Designation',
    'Position',
    'Institution Name',
  ]);

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
      fill: fontColor,
      fontFamily: selectedFont ? selectedFont.family : 'Arial',
      selectable: true,
      hasControls: true,
    });
    canvas.add(text);

    const boundingBox = text.getBoundingRect();
    const newAnnotation = {
      word: word,
      boundingBox: {
        left: boundingBox.left,
        top: boundingBox.top,
        width: boundingBox.width,
        height: boundingBox.height,
      },
      fontSize: 20,
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const handleCustomTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const handleFontColorChange = (e) => {
    setFontColor(e.target.value);
  };

  const handleFontStyleChange = (font) => {
    setSelectedFont(font);
  };

  const handleCustomTextAdd = () => {
    if (customText.trim() !== '') {
      addWordToCanvas(customText, 20, 20);
      setCustomText('');
    }
  };

  const handleAttributeClick = (word) => {
    setCustomText(word);
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
        canvas.setBackgroundImage(
          fabricImg,
          canvas.renderAll.bind(canvas)
        );

        canvas.setWidth(Math.min(400, img.width));
        canvas.setHeight(Math.min(400, img.height));

        setImageURL(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex p-4">
      <div className="w-48 mr-4 bg-white bg-opacity-10 p-4 glassmorphism">
        <h2 className="text-orange-500 mb-4 text-3xl font-urbanist">ATTRIBUTES</h2>
        <ul>
          {attributes.map((attribute, index) => (
            <li
              key={index}
              className="cursor-pointer mb-2 text-white font-urbanist"
              onClick={() => handleAttributeClick(attribute)}
            >
              {attribute}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <input
            type="text"
            value={customText}
            onChange={handleCustomTextChange}
            className="mb-2 p-2 w-full bg-white text-white"
          />
          <label className="block text-orange-500 mb-1 text-3xl font-urbanist">FONT COLOR</label>
          <input
            type="color"
            value={fontColor}
            onChange={handleFontColorChange}
            className="mb-2 p-2 w-full bg-white text-white font-urbanist"
          />
          <button
            onClick={handleCustomTextAdd}
            className="bg-orange-500 text-white p-2 font-urbanist"
          >
            Add Custom Text
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        <div
          className="canvas-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            position: 'relative',
            border: '1px solid #ccc',
            width: canvas ? `${canvas.width}px` : '300px',
            height: canvas ? `${canvas.height}px` : '300px',
          }}
        >
          <canvas
            id="canvas"
            ref={(ref) => {
              if (ref && !canvas) {
                const newCanvas = new fabric.Canvas(ref, {
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                });
                setCanvas(newCanvas);
              }
            }}
            className="absolute inset-0"
          />
        </div>

        <div>
          <h2 className="text-white font-urbanist mb-2">Annotations</h2>
          <ul>
            {annotations.map((annotation, index) => (
              <li key={index} className="text-white">
                {annotation.word} - Left: {annotation.boundingBox.left}, Top:{' '}
                {annotation.boundingBox.top}, Width:{' '}
                {annotation.boundingBox.width}, Height:{' '}
                {annotation.boundingBox.height}, Font Size:{' '}
                {annotation.fontSize}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
