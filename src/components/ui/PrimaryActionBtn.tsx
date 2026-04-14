import React from 'react';
import { ButtonDefinition } from './types/btn.types';
import { CONTAINER_THEMES } from '../../themes';
import { ContainerThemeKey, ContentContainerOne } from './ContentContainerOne';

export const PrimaryActionBtnR: React.FC<ButtonDefinition> = (props) => {
    type ThemeEntry = (typeof CONTAINER_THEMES)[ContainerThemeKey];
    const themeStyles: Partial<ThemeEntry> = props.theme ? CONTAINER_THEMES[props.theme] : {};
    const padding = props.padding;
    const margin = props.margin;
    const bgColor = props.bgColor ?? themeStyles.bgColor;
    const bgHoverColor = props.bgHoverColor ?? themeStyles.bgHoverColor;
    const border = props.border ?? themeStyles.border;
    const borderHover = props.borderHover ?? themeStyles.borderHover;
    const transitionClass = props.transitionVariant === 'expand'
        ? 'transition-all duration-300 ease-in-out hover:scale-[1.03]'
        : 'transition-colors duration-300 ease-in-out';

    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`inline-flex items-center justify-between gap-3 ${transitionClass} ${props.className ?? ''}`}
            style={{
                padding,
                margin,
                backgroundColor: bgColor,
                border,
            }}
            data-hover-bg={bgHoverColor}
            data-hover-border={borderHover}
        >
            {props.left && <ContentContainerOne {...props.left} />}
            {props.center && <ContentContainerOne {...props.center} />}
            {props.right && <ContentContainerOne {...props.right} />}
        </button>
    );
};