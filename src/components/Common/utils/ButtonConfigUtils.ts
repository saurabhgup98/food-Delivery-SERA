import React from 'react';
import { BtnConfig } from '../../../Style';
import { PrimaryActionBtnProps } from '../../Button/PrimaryActionBtn';
import SecondaryContentContainer from '../../Container/SecondaryContentContainer';

export interface ButtonConfigItem {
  text: string;
  loadingText?: string;
  variant: keyof typeof BtnConfig;
  className?: string;
  icon?: React.ReactNode;
  isSubmit?: boolean;
  width?: string;
  height?: string;
  radius?: string;
}

export interface ButtonPropsOptions {
  isLoading?: boolean;
  customText?: string;
}

export function createButtonProps(
  config: ButtonConfigItem,
  onClick: () => void,
  options?: ButtonPropsOptions
): PrimaryActionBtnProps {
  const variantProps = BtnConfig[config.variant];
  const isLoading = options?.isLoading || false;
  const buttonText = options?.customText || (isLoading ? (config.loadingText || config.text) : config.text);
  const hasIcon = !!config.icon;

  const content = hasIcon
    ? React.createElement(SecondaryContentContainer, {
        rows: [
          {
            components: [
              {
                content: config.icon!,
              },
              {
                content: React.createElement('span', {
                  className: `text-sm font-semibold ${variantProps.textColor || 'text-gray-900'}`,
                }, buttonText),
              },
            ],
            gap: '0.75rem',
            className: 'w-fit h-full',
            justify: 'center',
            align: 'center',
          },
        ],
        className: 'w-full h-full flex items-center justify-center',
      })
    : React.createElement(SecondaryContentContainer, {
        rows: [
          {
            components: {
              content: React.createElement('span', {
                className: 'text-base font-semibold text-white',
              }, buttonText),
            },
            className: 'w-fit h-full',
            justify: 'center',
            align: 'center',
          },
        ],
        className: 'w-full h-full flex items-center justify-center',
      });

  return {
    type: config.isSubmit ? 'submit' as const : 'button' as const,
    onClick,
    disabled: isLoading,
    width: config.width || 'w-full',
    height: config.height || 'h-auto',
    className: config.className,
    bgColor: variantProps.bgColor || 'bg-orange-500',
    bgHoverColor: variantProps.hoverBgColor || 'hover:bg-orange-600',
    textColor: variantProps.textColor || 'text-white',
    textHoverColor: variantProps.textHoverColor || 'hover:text-white',
    radius: config.radius || 'rounded-lg',
    content,
  };
}