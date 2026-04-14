import React from 'react';

interface TextLine {
  text: string;
  span?: string;
  textColor?: string;
  textWeight?: string;
  spanColor?: string;
  spanWeight?: string;
}

interface VerticalDetailsTextCardProps {
  lines: TextLine[];
  className?: string;
  containerClassName?: string;
}

const VerticalDetailsTextCard: React.FC<VerticalDetailsTextCardProps> = ({
  lines,
  className = "",
  containerClassName = "text-center"
}) => {
  return (
    <div className={`${containerClassName} ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="mb-2 last:mb-0">
          <span 
            className={`${line.textColor || 'text-4xl md:text-5xl font-bold text-white'} ${line.textWeight || ''}`}
          >
            {line.text}
          </span>
          {line.span && (
            <span 
              className={`${line.spanColor || 'text-sm text-gray-400'} ${line.spanWeight || ''}`}
            >
              {line.span}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default VerticalDetailsTextCard;
