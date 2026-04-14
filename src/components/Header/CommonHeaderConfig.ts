import React from 'react';
import { PrimaryContentContainerProps } from '../Container/PrimaryContentContainer';
import SecondaryContentContainer from '../Container/SecondaryContentContainer';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import XIcon from '../Icon/XIcon';
import { AUTH_FORM_CONFIG } from '../Auth/FormConfig';

export type HeaderConfigKey = 'authForm' | 'deliveryAddress' | 'restaurantFilter';

const HEADER_CONFIG: Record<HeaderConfigKey, { title: string; subtitle: string; titleColor: string; subtitleColor: string }> = {
  authForm: {
    title: AUTH_FORM_CONFIG.login.header.title,
    subtitle: AUTH_FORM_CONFIG.login.header.description,
    titleColor: 'text-white',
    subtitleColor: 'text-white/80',
  },
  deliveryAddress: {
    title: 'Delivery Addresses',
    subtitle: 'Manage your delivery addresses for quick ordering',
    titleColor: 'text-white',
    subtitleColor: 'text-gray-400',
  },
  restaurantFilter: {
    title: 'Advanced Filters',
    subtitle: 'Customize your restaurant search',
    titleColor: 'text-white',
    subtitleColor: 'text-gray-400',
  },
};

export const getHeaderContainerProps = (
  key: HeaderConfigKey,
  onClick: () => void
): PrimaryContentContainerProps => {
  const config = HEADER_CONFIG[key];

  return {
    left: {
      content: React.createElement(SecondaryContentContainer, {
        rows: [
          {
            components: {
              content: React.createElement('h3', { className: `text-xl font-semibold ${config.titleColor}` }, config.title),
            },
          },
          {
            components: {
              content: React.createElement('p', { className: `text-sm ${config.subtitleColor}` }, config.subtitle),
            },
          },
        ],
        rowGap: '4px',
        className: 'w-fit h-full',
      }),
      align: 'start',
    },
    center: undefined,
    right: {
      content: React.createElement(PrimaryActionBtn, {
        onClick,
        width: 'w-10',
        height: 'h-10',
        bgColor: 'bg-transparent',
        bgHoverColor: 'hover:bg-white/20',
        radius: 'rounded-md',
        content: React.createElement(SecondaryContentContainer, {
          rows: [
            {
              components: {
                content: React.createElement(XIcon, { className: 'w-5 h-5 text-white' }),
                marginRight: 'mr-0',
              },
              className: 'w-fit h-full',
            },
          ],
          className: 'w-fit h-full',
        }),
      }),
      align: 'center',
    },
    className: 'justify-between',
  };
};