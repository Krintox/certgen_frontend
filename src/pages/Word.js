import React from 'react';

const Word = ({ text }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', text);
  };

  return (
    <div
      className="word font-urbanist"
      draggable="true"
      onDragStart={handleDragStart}
      style={{ color: 'white' }}
    >
      {text}
    </div>
  );
};

export default Word;
