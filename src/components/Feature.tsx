import React from 'react';
import ClockIcon from './Icons/ClockIcon';
import HeartIcon from './Icons/HeartIcon';
import LocationIcon from './Icons/LocationIcon';

interface FeatureProps {
  icon: string;
  text: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, text }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <ClockIcon className="w-5 h-5 text-sera-yellow" />;
      case 'heart':
        return <HeartIcon className="w-5 h-5 text-sera-yellow" />;
      case 'location':
        return <LocationIcon className="w-5 h-5 text-sera-yellow" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getIcon(icon)}
      <span className="text-sm font-medium text-white/80">{text}</span>
    </div>
  );
};

export default Feature;
