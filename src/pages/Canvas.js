import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import Word from './Word';
import { useNavigate, useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Footer from './Footer';

const Canvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
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


  return (
    <div className="flex flex-col items-center justify-center w-full mt-10 min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2 max-md:text-7xl bebas mt-10">CERT GEN</h1>
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className="w-full md:w-1/3 p-4" style={{ backgroundColor: 'transparent', padding: '20px' }}>
          <h2 className="text-white" style={{ background: "linear-gradient(to bottom right, #FB360F, #F28A18)", WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <u>POSITION OF THE ELEMENTS</u>
          </h2>
          <h4 className="text-white mb-3"><u>DRAG AND DROP THEM IN THE CERTIFICATE</u></h4>
            <div id="word1" style={{ border: "2px solid white", borderRadius: "10px", padding: "10px", marginBottom: "10px"}}>
              <Word text="Word1" onClick={() => addWordToCanvas("Word1", 20, 20)} />
            </div>
            <div id="word2" style={{ border: "2px solid white", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
              <Word text="Word2" onClick={() => addWordToCanvas("Word2", 20, 50)} />
            </div>
            <div>
              <input className='text-white font-urbanist bg-transparent' type="text" value={customText} onChange={handleCustomTextChange} />
              <button style={{ background: "linear-gradient(to bottom right, #FB360F, #F28A18)", borderRadius: "10px", padding: "10px", border: "none", color: "white" }} onClick={handleCustomTextAdd}>Add Custom Text</button>
            </div>
            <div className="mt-5">
              <h2 className="text-white"><u>FORMATTING OF THE ANNOTATIONS</u></h2>
              <div className="flex mt-3 justify-center">
                <div className="mr-3">
                <label htmlFor="fontSelect" className="text-white m-2" style={{ background: 'linear-gradient(to bottom right, #FB360F, #F28A18)', display: 'inline-block', padding: '5px 10px', borderRadius: '5px' }}>Font:</label>
                <select id="fontSelect" className="bg-gray-850 border border-white text-white p-2 rounded">
                  <option style={{ color: '#fff' }} value="Arial">Arial</option>
                  <option style={{ color: '#fff' }} value="Helvetica">Helvetica</option>
                  <option style={{ color: '#fff' }} value="Times New Roman">Times New Roman</option>
                </select>

                </div>
                <div>
                <label htmlFor="fontSelect" className="text-white m-2" style={{ background: 'linear-gradient(to bottom right, #FB360F, #F28A18)', display: 'inline-block', padding: '5px 10px', borderRadius: '5px' }}>Size:</label>
                <select id="sizeSelect" className="bg-gray-850 border border-white text-white p-2 rounded">
                  <option style={{ color: '#fff' }} value="12">12px</option>
                  <option style={{ color: '#fff' }} value="16">16px</option>
                  <option style={{ color: '#fff' }} value="20">20px</option>
                </select>

                </div>
              </div>
            </div>


        </div>
        <div className="w-full md:w-2/3 p-4">
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
          <div>
            <h2 className='mt-2'>Annotations</h2>
            <ul>
              {annotations.map((annotation, index) => (
                <li className='text-white' key={index}>
                {annotation.word} - <button style={{background: "linear-gradient(to bottom right, #FB360F, #F28A18)"}} onClick={()  => handleDeleteWord(annotation.word)}>Delete</button>
                </li>   
              ))}
            </ul>
          </div>
          <button style={{ background: "linear-gradient(to bottom right, #FB360F, #F28A18)", borderRadius: "10px", padding: "10px", border: "none", color: "white" }} onClick={() => navigate('/excelDownload', { state: { annotations, canvasImage: canvas.toDataURL('image/png'), resizedImage: uploadedImage } })} className="mt-4 ml-auto mr-auto block">Download Excel</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}  

export default Canvas;
