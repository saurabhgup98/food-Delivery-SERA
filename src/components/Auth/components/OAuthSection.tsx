import React from 'react';
import { OAUTH_PROVIDERS } from '../config/formConfig';
import { getOAuthIcon } from './OAuthIcons';
import { API_BASE_URL } from '../../../services/api/constants';
import { OAuthSectionProps } from '../interfaces/authInterfaces';

const OAuthSection: React.FC<OAuthSectionProps> = ({ disabled = false }) => {
    const handleOAuthClick = (redirectUrl: string) => {
        if (disabled) return;
        const fullUrl = `${API_BASE_URL}${redirectUrl}`;
        window.location.href = fullUrl;
    };

    return (
        <div className="space-y-3">
            {OAUTH_PROVIDERS.map((provider) => (
                <button
                    key={provider.id}
                    onClick={() => handleOAuthClick(provider.redirectUrl)}
                    disabled={disabled}
                    className={`
            w-full group relative flex items-center justify-center space-x-3 
            py-3 px-6 rounded-xl transition-all duration-300 text-sm font-medium 
            tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-sera-blue/20
            ${provider.className} ${provider.hoverClassName}
          `.trim()}
                >
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                    {/* Icon */}
                    <div className="relative z-10">{getOAuthIcon(provider.icon)}</div>

                    {/* Label */}
                    <span className="relative z-10">{provider.label}</span>
                </button>
            ))}
        </div>
    );
};

export default OAuthSection;