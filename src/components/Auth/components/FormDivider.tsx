import React from 'react';

interface FormDividerProps {
  text?: string;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
}

const FormDivider: React.FC<FormDividerProps> = ({
  text = "Or continue with",
  className = "",
  lineClassName = "border-gray-600",
  textClassName = "text-gray-400"
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full border-t ${lineClassName}`}></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className={`px-2 bg-dark-800 ${textClassName}`}>{text}</span>
      </div>
    </div>
  );
};

export default FormDivider;