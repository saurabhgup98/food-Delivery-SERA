import { ContentContainerOneProps, ContainerThemeKey } from "../ContentContainerOne";

export interface ButtonDefinition {
    left?: ContentContainerOneProps;
    center?: ContentContainerOneProps;
    right?: ContentContainerOneProps;
    padding?: string | number;
    margin?: string | number;
    theme?: ContainerThemeKey;
    bgColor?: string;
    bgHoverColor?: string;
    border?: string;
    borderHover?: string;
    onClick?: () => void;
    className?: string;
    /** 'expand' = color + scale hover (e.g. Join SERA); 'color-only' = color transition only (e.g. Cancel, OAuth) */
    transitionVariant?: 'expand' | 'color-only';
  }