import React from 'react';

const Word = ({ text }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', text);
  };

  return (
    <div
      className="word"
      draggable="true"
      onDragStart={handleDragStart}
    >
      {text}
    </div>
  );
};

export default Word;
