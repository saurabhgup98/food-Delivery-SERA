import React from 'react';
import { IconDefinition } from '../../types/ui/icon.types';
import { TextDefinition } from '../../types/ui/text.types';
import { CONTAINER_THEMES } from '../../themes';

export type ContainerItem = IconDefinition | TextDefinition;
export type ContainerThemeKey = keyof typeof CONTAINER_THEMES;

export interface ContentContainerOneProps {
    items: ContainerItem[];
    padding?: string | number;
    margin?: string | number;
    theme?: ContainerThemeKey;
    bgColor?: string;
    bgHoverColor?: string;
    border?: string;
    borderHover?: string;
    className?: string;
}

const renderItem = (item: ContainerItem) => {
    if (item.type === 'icon') {
        return (
            <span
                className="inline-flex items-center [&>svg]:shrink-0 container-item"
                style={{
                    color: item.color,
                    width: item.size,
                    height: item.size,
                }}
                data-hover-color={item.hoverColor}
            >
                {item.icon}
            </span>
        );
    }
    return (
        <span
            style={{ color: item.color }}
            className={`container-item ${item.className ?? ''}`}
            data-hover-color={item.hoverColor}
        >
            {item.text}
        </span>
    );
};

export const ContentContainerOne: React.FC<ContentContainerOneProps> = (props) => {
    type ThemeEntry = (typeof CONTAINER_THEMES)[ContainerThemeKey];
    const themeStyles: Partial<ThemeEntry> = props.theme ? CONTAINER_THEMES[props.theme] : {};
    const padding = props.padding ?? '0.5rem 0.75rem';
    const margin = props.margin;
    const bgColor = props.bgColor ?? themeStyles.bgColor;
    const bgHoverColor = props.bgHoverColor ?? themeStyles.bgHoverColor;
    const border = props.border ?? themeStyles.border;
    const borderHover = props.borderHover ?? themeStyles.borderHover;

    return (
        <div
            className={`inline-flex items-center gap-2 container-wrapper ${props.className ?? ''}`}
            style={{
                width: 'fit-content',
                height: '100%',
                padding,
                margin,
                backgroundColor: bgColor,
                border,
            }}
            data-hover-bg={bgHoverColor}
            data-hover-border={borderHover}
        >
            {props.items.map((item, i) => (
                <React.Fragment key={i}>{renderItem(item)}</React.Fragment>
            ))}
        </div>
    );
};