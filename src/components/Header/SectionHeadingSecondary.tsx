import React from 'react';

interface SectionHeadingSecondaryProps {
  headerIcon: React.ReactNode;
  heading: string;
  text: string;
  span1Icon: React.ReactNode;
  span1Text: string;
  span1TextColor?: string;
  span2Icon: React.ReactNode;
  span2Text: string;
  span2TextColor?: string;
}

const SectionHeadingSecondary: React.FC<SectionHeadingSecondaryProps> = ({
  headerIcon,
  heading,
  text,
  span1Icon,
  span1Text,
  span1TextColor = 'text-white/80',
  span2Icon,
  span2Text,
  span2TextColor = 'text-white/80'
}) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-sera-pink/20 via-sera-orange/20 to-sera-pink/20"></div>
      <div className="relative bg-gradient-to-r from-sera-pink to-sera-orange border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-2">
          <div className="text-center">
            {/* Hero Content - Compact Layout */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-3 mb-2">
              {/* Icon - Only on large screens, horizontal with text */}
              <div className="hidden lg:flex items-center gap-2">
                {headerIcon}
              </div>

              {/* Main Title */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {heading}
              </h1>
            </div>

            {/* Description */}
            <p className="text-white/90 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed mb-2">
              {text}
            </p>

            {/* Features */}
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center space-x-1">
                {span1Icon}
                <span className={span1TextColor}>{span1Text}</span>
              </div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="flex items-center space-x-1">
                {span2Icon}
                <span className={span2TextColor}>{span2Text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeadingSecondary;