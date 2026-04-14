import React from 'react';
import { Link } from 'react-router-dom';
import { HEADER_CONFIG } from '../Header/HeaderConfig';

const BrandNameAndLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      {/* SERA Logo - Scooter Delivery Icon */}
      <div className="relative">
        <div className={`${HEADER_CONFIG.logo.size} bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          {/* Scooter Icon */}
          <div className="relative w-6 h-6">
            {/* Scooter body */}
            <div className="absolute bottom-0 left-0 w-4 h-2 bg-sera-blue rounded-full"></div>
            {/* Scooter handle */}
            <div className="absolute top-0 right-0 w-1 h-3 bg-sera-blue rounded-full"></div>
            {/* Delivery box */}
            <div className="absolute bottom-1 right-1 w-2 h-1.5 bg-sera-yellow rounded-sm"></div>
            {/* Person */}
            <div className="absolute top-1 left-1 w-1 h-1.5 bg-sera-orange rounded-full"></div>
          </div>
        </div>
        {/* Animated delivery trail */}
        <div className={`absolute -bottom-1 -right-1 ${HEADER_CONFIG.logo.trailSize} bg-sera-yellow rounded-full animate-pulse`}></div>
      </div>

      {/* Brand Name */}
      <div className="hidden sm:block mr-6">
        <h1 className={`text-white font-display font-bold ${HEADER_CONFIG.brand.titleSize}`}>
          <span className="text-white">{HEADER_CONFIG.brand.title}</span>
          <span className="text-sera-yellow"> {HEADER_CONFIG.brand.subtitle}</span>
        </h1>
        <p className={`${HEADER_CONFIG.brand.taglineSize} text-white/80 ${HEADER_CONFIG.brand.taglineWeight}`}>{HEADER_CONFIG.brand.tagline}</p>
      </div>
    </Link>
  );
};

export default BrandNameAndLogo;
