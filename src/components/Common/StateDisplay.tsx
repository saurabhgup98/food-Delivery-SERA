import React from 'react';
import { AnimatedLoader } from '../Loader';

export type StateStatus = 'loading' | 'success' | 'error' | 'empty';

export interface StateConfig {
    icon?: React.ReactNode;
    text?: string;
    subtext?: string;
    button?: React.ReactNode;
    loadingType?: 'restaurant' | 'dish' | 'general';   // Special case for loading
}

export interface StateDisplayProps {
    status: StateStatus;
    config: StateConfig;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    containerClassName?: string;
    children?: React.ReactNode; // For success state custom content
}

const sizeClasses = {
    sm: {
        container: 'p-4',
        icon: 'text-2xl mb-2',
        title: 'text-sm font-medium',
        subtitle: 'text-xs',
    },
    md: {
        container: 'p-6',
        icon: 'text-4xl mb-4',
        title: 'text-base font-medium',
        subtitle: 'text-sm',
    },
    lg: {
        container: 'p-8',
        icon: 'text-5xl mb-6',
        title: 'text-lg font-medium',
        subtitle: 'text-base',
    },
    xl: {
        container: 'p-12',
        icon: 'text-6xl mb-8',
        title: 'text-xl font-semibold',
        subtitle: 'text-lg',
    }
};

const StateDisplay: React.FC<StateDisplayProps> = ({
    status,
    config,
    size = 'md',
    className = '',
    containerClassName = '',
    children
}) => {
    const currentSize = sizeClasses[size];

    const getIconColor = () => {
        switch (status) {
            case 'loading':
                return 'text-white';
            case 'success':
                return 'text-green-400';
            case 'error':
                return 'text-red-400';
            case 'empty':
                return 'text-gray-400';
            default:
                return 'text-gray-400';
        }
    };

    // Render icon (with special handling for loading)
    const renderIcon = () => {
        if (status === 'loading' && !config.icon) {
            return (
                <div className="flex justify-center mb-4">
                    <AnimatedLoader
                        type={config.loadingType || 'general'}
                        size={size === 'sm' ? 'small' : size === 'md' ? 'medium' : size === 'lg' ? 'large' : 'large'}
                    />
                </div>
            );
        }

        if (config.icon) {
            return (
                <div className={`${getIconColor()} ${currentSize.icon} mb-4`}>
                    {config.icon}
                </div>
            );
        }

        return null;
    };

    // Render content based on status
    const renderContent = () => {
        // Success state can have custom children
        if (status === 'success' && children) {
            return (
                <div className={`${currentSize.container} ${containerClassName}`}>
                    {config.icon && (
                        <div className="text-center mb-4">
                            {renderIcon()}
                            {config.text && (
                                <h4 className={`text-white ${currentSize.title} mb-2`}>
                                    {config.text}
                                </h4>
                            )}
                            {config.subtext && (
                                <p className={`text-gray-400 ${currentSize.subtitle}`}>
                                    {config.subtext}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            );
        }

        // Standard rendering for all states
        return (
            <div className={`${currentSize.container} ${containerClassName}`}>
                <div className="text-center">
                    {renderIcon()}

                    {config.text && (
                        <h4 className={`text-white ${currentSize.title} mb-2`}>
                            {config.text}
                        </h4>
                    )}

                    {config.subtext && (
                        <p className={`text-gray-400 ${currentSize.subtitle} ${status !== 'loading' ? 'mb-4' : ''}`}>
                            {config.subtext}
                        </p>
                    )}

                    {config.button && (
                        <div className="flex justify-center mt-4">
                            {config.button}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`bg-dark-700 rounded-lg border border-dark-600 ${className}`}>
            {renderContent()}
        </div>
    );
};

export default StateDisplay;