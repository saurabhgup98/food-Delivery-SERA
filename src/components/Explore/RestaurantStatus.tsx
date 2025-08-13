import React, { useState, useEffect } from 'react';

interface RestaurantStatusProps {
  status: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED' | 'PERMANENTLY_CLOSED';
  subStatus?: 'NORMAL' | 'BUSY' | 'VERY_BUSY';
  statusDetails?: {
    nextOpenTime?: string;
    tempCloseReason?: string;
    tempCloseDuration?: string;
  };
  isHovered?: boolean; // New prop to receive hover state from parent
}

const RestaurantStatus: React.FC<RestaurantStatusProps> = ({
  status,
  subStatus,
  statusDetails,
  isHovered = false
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Get status configuration with smart, compact design
  const getStatusConfig = () => {
    switch (status) {
      case 'OPEN':
        const openConfigs = {
          'NORMAL': {
            bgColor: 'bg-emerald-600/90',
            textColor: 'text-white',
            borderColor: 'border-emerald-500/50',
            icon: '●',
            texts: ['OPEN'],
            details: 'Fast delivery',
            pulse: false
          },
          'BUSY': {
            bgColor: 'bg-orange-600/90',
            textColor: 'text-white',
            borderColor: 'border-orange-500/50',
            icon: '●',
            texts: ['OPEN'],
            details: 'Longer wait time',
            pulse: false
          },
          'VERY_BUSY': {
            bgColor: 'bg-red-600/90',
            textColor: 'text-white',
            borderColor: 'border-red-500/50',
            icon: '●',
            texts: ['OPEN'],
            details: 'Extended wait time',
            pulse: false
          }
        };
        return openConfigs[subStatus || 'NORMAL'];
      
      case 'CLOSED':
        return {
          bgColor: 'bg-red-600/90',
          textColor: 'text-white',
          borderColor: 'border-red-500/50',
          icon: '●',
          texts: ['CLOSED'],
          details: statusDetails?.nextOpenTime ? `Opens ${statusDetails.nextOpenTime}` : 'Closed',
          pulse: false
        };
      
      case 'TEMPORARILY_CLOSED':
        return {
          bgColor: 'bg-purple-600/90',
          textColor: 'text-white',
          borderColor: 'border-purple-500/50',
          icon: '●',
          texts: ['TEMP CLOSED'],
          details: statusDetails?.tempCloseReason && statusDetails?.tempCloseDuration 
            ? `${statusDetails.tempCloseReason} - ${statusDetails.tempCloseDuration}`
            : 'Temporarily Closed',
          pulse: false
        };
      
      case 'PERMANENTLY_CLOSED':
        return {
          bgColor: 'bg-gray-600/90',
          textColor: 'text-white',
          borderColor: 'border-gray-500/50',
          icon: '●',
          texts: ['PERM CLOSED'],
          details: 'Permanently Closed',
          pulse: false
        };
      
      default:
        return {
          bgColor: 'bg-gray-600/90',
          textColor: 'text-white',
          borderColor: 'border-gray-500/50',
          icon: '●',
          texts: ['UNKNOWN'],
          details: 'Status unknown',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();

  // Handle 2-second cycling animation when card is hovered
  useEffect(() => {
    if (isHovered && config.texts.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % config.texts.length);
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setCurrentTextIndex(0);
    }
  }, [isHovered, config.texts.length]);

  return (
    <div className="relative">
      {/* Additional details - Show above tag with stylish background */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-1 z-20">
          <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-lg px-3 py-2 border border-slate-600/30 shadow-xl max-w-xs" style={{ transform: 'translateX(calc(50% - 1rem))' }}>
            <div className="text-xs text-slate-100 font-semibold flex items-start gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0 mt-1"></span>
              <span className="break-words leading-relaxed">{config.details}</span>
            </div>
            {/* Arrow pointing down to tag */}
            <div className="absolute top-full right-4 w-2 h-2 bg-slate-800/95 rotate-45 border-r border-b border-slate-600/30"></div>
          </div>
        </div>
      )}
      
      {/* Compact Status Badge - Position completely unchanged */}
      <div className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-md 
        text-xs font-semibold transition-all duration-300 
        border backdrop-blur-sm shadow-sm
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${config.pulse ? 'animate-pulse' : ''}
        transform-gpu
      `}>
        <span className={`text-xs ${config.pulse ? 'animate-pulse' : ''}`}>{config.icon}</span>
        <span className="font-bold">{config.texts[currentTextIndex]}</span>
      </div>
    </div>
  );
};

export default RestaurantStatus;
