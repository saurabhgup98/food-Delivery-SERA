import React from 'react';

interface ChatIconProps {
  className?: string;
  color?: string;
  hoverColor?: string;
  bgColor?: string;
  hoverBgColor?: string;
  filled?: boolean;
}

const ChatIcon: React.FC<ChatIconProps> = ({ 
  className = "w-6 h-6", 
  color = "white",
  hoverColor,
  bgColor = "transparent",
  hoverBgColor,
  filled = false 
}) => {
  return (
    <svg 
      className={`${className} ${hoverColor ? `hover:${hoverColor}` : ''} ${hoverBgColor ? `hover:${hoverBgColor}` : ''}`}
      fill={filled ? "currentColor" : bgColor} 
      stroke={color} 
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
      />
    </svg>
  );
};

export default ChatIcon;
