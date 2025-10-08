import React from 'react';
import CloseIcon from '../../Common/Icons/CloseIcon';
import IconBtnPrimary from './buttons/IconBtnPrimary';
import { AuthHeaderProps } from '../interfaces/authInterfaces';

// Close button configuration - declared at top
const CLOSE_BUTTON_CONFIG = {
  icon: <CloseIcon className="w-5 h-5" />,
  size: 'sm' as const,
  variant: 'primary' as const,
  className: 'absolute top-3 right-3'
};

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  description,
  gradientClass,
  onClose
}) => {
  return (
    <div className={`relative w-full p-4 ${gradientClass} flex items-center justify-center min-h-[80px]`}>
      <IconBtnPrimary
        onClick={onClose}
        {...CLOSE_BUTTON_CONFIG}
      />

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">
          {title}
        </h2>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default AuthHeader;