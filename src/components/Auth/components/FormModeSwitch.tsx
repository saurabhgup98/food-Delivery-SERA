import React from 'react';
import { FormModeSwitchProps } from '../interfaces/authInterfaces';

const FormModeSwitch: React.FC<FormModeSwitchProps> = ({
  mode,
  onSwitch,
  config
}) => {
  const isLogin = mode === 'login';
  const currentConfig = isLogin ? config.login : config.signup;
  
  return (
    <div className="text-center">
      <p className="text-gray-400">
        {currentConfig.question}{" "}
        <button
          type="button"
          onClick={onSwitch}
          className={`font-medium hover:underline transition-colors duration-200 ${currentConfig.actionColor}`}
        >
          {currentConfig.actionText}
        </button>
      </p>
    </div>
  );
};

export default FormModeSwitch;