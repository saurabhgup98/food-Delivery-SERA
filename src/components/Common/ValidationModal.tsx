import React from 'react';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingFields: string[];
  title?: string;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ 
  isOpen, 
  onClose, 
  missingFields, 
  title = "Required Fields Missing" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 max-w-md w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-dark-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">Please fill in the required fields below</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {missingFields.map((field, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg border border-red-500/20">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-red-400 font-medium">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-300">{field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-600 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sera-orange text-white rounded-lg hover:bg-sera-orange/90 transition-colors duration-200 font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
