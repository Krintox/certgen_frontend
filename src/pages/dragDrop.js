import React, { useState, useRef, useEffect } from "react";
import "tailwindcss/tailwind.css";

export default function Drag() {
  const [imageUrl, setImageUrl] = useState(null);
  const [textElements, setTextElements] = useState([]);
  const [rectCoordinates, setRectCoordinates] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasWidth = 800; // Adjust as needed
  const canvasHeight = 600; // Adjust as needed

  const canvasRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const { naturalWidth, naturalHeight } = image;
      const aspectRatio = naturalWidth / naturalHeight;
      let newWidth = canvasWidth;
      let newHeight = canvasWidth / aspectRatio;

      if (newHeight > canvasHeight) {
        newHeight = canvasHeight;
        newWidth = canvasHeight * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      // Render text elements on canvas
      textElements.forEach((textElement) => {
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        // Calculate center coordinates of the rectangle
        const centerX = textElement.x + textElement.width / 2;
        const centerY = textElement.y + textElement.height / 2;
        // Set text alignment to center
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(textElement.text, centerX, centerY);
      });
      // Render rectangle if coordinates are available
      if (rectCoordinates) {
        const { x, y, width, height } = rectCoordinates;
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }
    };
  }, [imageUrl, textElements, rectCoordinates, canvasWidth, canvasHeight]);

  const handleImageChange = (event) => {
    const newImageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(newImageFile);
  };

  const handleTextSubmit = (event) => {
    event.preventDefault();
    const textValue = textRef.current.value;
    if (!textValue || !rectCoordinates) return;

    setTextElements([
      ...textElements,
      { text: textValue, ...rectCoordinates }, // Adjust text position within rectangle
    ]);
    textRef.current.value = ""; // Clear input field
  };

  const handleCanvasMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (
      rectCoordinates &&
      x >= rectCoordinates.x &&
      x <= rectCoordinates.x + rectCoordinates.width &&
      y >= rectCoordinates.y &&
      y <= rectCoordinates.y + rectCoordinates.height
    ) {
      setResizing(true);
      setDragStart({ x, y });
    } else {
      setRectCoordinates({ x, y, width: 0, height: 0 });
      setResizing(true); // Start resizing on single click
      setDragStart({ x, y }); // Set starting point for resizing
    }
  };

  const handleCanvasMouseMove = (event) => {
    if (!rectCoordinates || !resizing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    setRectCoordinates((prevCoordinates) => ({
      ...prevCoordinates,
      width: prevCoordinates.width + dx,
      height: prevCoordinates.height + dy,
    }));
    setDragStart({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setResizing(false);
  };

  return (
    <div className="App flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <h1 className="text-center mb-4">Image Editor</h1>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
        {imageUrl && (
          <>
            <div className="relative">
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className="border border-gray-400"
              />
              {rectCoordinates && (
                <form onSubmit={handleTextSubmit} className="absolute top-0 left-0 mt-2 ml-2">
                  <input
                    type="text"
                    ref={textRef}
                    placeholder="Enter text..."
                    className="border border-gray-400 px-2 py-1"
                    disabled={!rectCoordinates}
                  />
                  <button type="submit" disabled={!rectCoordinates} className="ml-2 px-3 py-1 bg-blue-500 text-white disabled:bg-gray-400 disabled:text-gray-800">
                    Add Text
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
