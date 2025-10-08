import React from 'react';

interface MessageDisplayProps {
  type: 'error' | 'success';
  message: string;
  onClose?: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-900/20 border-red-800' : 'bg-green-900/20 border-green-800';
  const textColor = isError ? 'text-red-400' : 'text-green-400';
  const messageColor = isError ? 'text-red-300' : 'text-green-300';
  const icon = isError ? '⚠️' : '✅';
  const title = isError ? 'Error' : 'Success';

  return (
    <div className={`${bgColor} border rounded-lg p-4 mb-4`}>
      <div className="flex items-center space-x-3">
        <div className={`${textColor} text-lg`}>{icon}</div>
        <div className="flex-1">
          <h4 className={`${textColor} font-medium mb-1`}>{title}</h4>
          <p className={`${messageColor} text-sm`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;