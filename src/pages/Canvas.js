import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProject } from '../ProjectContext';
import { CiText } from "react-icons/ci";
import { HiOutlineAnnotation } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import Footer from './Footer';

const Annotations = ({ addWordToCanvas }) => {
  const [isAnnotationsDropdownOpen, setIsAnnotationsDropdownOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', word);
  };

  const toggleAnnotationsDropdown = () => {
    setIsAnnotationsDropdownOpen(!isAnnotationsDropdownOpen);
  };

  const toggleFontDropdown = () => {
    setIsFontDropdownOpen(!isFontDropdownOpen);
  };

  return (
    <div className='border-2 border-orange-500 ml-10' style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', height: '100%' }}>
      <h2 style={{ background: "linear-gradient(to bottom right, #FB360F, #F28A18)", WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
        Formatting
      </h2>
      <div className="annotations" style={{ marginTop: '10px' }}>
        <h4
          style={{ textAlign: 'center', cursor: 'pointer', background: "linear-gradient(to bottom right, #FB360F, #F28A18)", color: 'white', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={toggleAnnotationsDropdown}
        >
          <HiOutlineAnnotation style={{ marginRight: '5px' }}/>
          Annotations
          <RiArrowDropDownLine style={{ marginLeft: '5px', transform: isAnnotationsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
        </h4>
        {isAnnotationsDropdownOpen && (
          <div className="annotation-items" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            {['Name', 'Title', 'Signature', 'Date', 'qrCode'].map(word => (
              <div
                key={word}
                style={{ padding: '10px', border: '1px solid #FF5733', borderRadius: '5px', textAlign: 'center', cursor: 'pointer' }}
                draggable
                onDragStart={(e) => handleDragStart(e, word)}
                onClick={() => addWordToCanvas(word, 50, 50)}
              >
                {word}
              </div>
            ))}
          </div>
        )}
        <div className="text-options" style={{ marginTop: '20px' }}>
          <h4
            style={{ textAlign: 'center', cursor: 'pointer', background: "linear-gradient(to bottom right, #FB360F, #F28A18)", color: 'white', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={toggleFontDropdown}
          >
            <CiText style={{ marginRight: '5px' }}/>
            Text
            <RiArrowDropDownLine style={{ marginLeft: '5px', transform: isFontDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
          </h4>
          {isFontDropdownOpen && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div className="mr-6">
                <label className="block mb-2">Font:</label>
                <select className="border-2 border-orange-500 text-black p-2 rounded">
                  <option value="Urbanist">Urbanist</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Size:</label>
                <select className="border-2 border-orange-500 text-black p-2 rounded">
                  <option value="18">18px</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useProject();
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

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10 min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-black border-b-2 under md:pb-2 max-md:text-7xl bebas mt-10 mb-8">CERTGEN</h1>
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className="w-full md:w-1/4 p-2" style={{ backgroundColor: 'transparent', padding: '20px', height: '600px' }}>
          <Annotations addWordToCanvas={addWordToCanvas} />
        </div>
        <div className="w-full md:w-3/4 p-2">
          <div
            className="canvas-container overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <canvas
              id="canvas"
              ref={(ref) => {
                if (ref && !canvas) {
                  const newCanvas = new fabric.Canvas(ref, { width: width, height: height });
                  setCanvas(newCanvas);
                }
              }}
            />
          </div>
          <div className="flex flex-col items-center">
            {annotations.length > 0 && (
              <h4 className='mt-2 text-black'><u>Annotations</u></h4>
            )}
            <ul className="flex flex-col items-center">
              {annotations.map((annotation, index) => (
                <li key={index} className='flex items-center mb-2'>
                  <span className='text-black'>{annotation.word}</span>
                  <button
                    style={{ 
                      background: "linear-gradient(to bottom right, #FB360F, #F28A18)", 
                      borderRadius: "10px", 
                      padding: "5px 10px", 
                      border: "none", 
                      color: "black",
                      marginLeft: '20px'
                    }} 
                    onClick={() => handleDeleteWord(annotation.word)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button style={{ background: "linear-gradient(to bottom right, #FB360F, #F28A18)", borderRadius: "10px", padding: "10px", border: "none", color: "black" }} onClick={() => navigate('/excelDownload', { state: { annotations, canvasImage: canvas.toDataURL('image/png'), resizedImage: uploadedImage } })} className="mt-8 ml-auto mr-auto block">Download Excel</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Canvas;
