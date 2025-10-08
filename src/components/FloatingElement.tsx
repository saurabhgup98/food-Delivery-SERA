import React from 'react';

interface FloatingElementProps {
  emoji: string;
  position: string;
  size: string;
  bgColor: string;
  animationDelay: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  emoji,
  position,
  size,
  bgColor,
  animationDelay
}) => {
  return (
    <div 
      className={`absolute ${position} animate-bounce-gentle`}
      style={{ animationDelay }}
    >
      <div className={`${size} ${bgColor} rounded-full flex items-center justify-center`}>
        <span className="text-2xl">{emoji}</span>
      </div>
    </div>
  );
};

export default FloatingElement;
