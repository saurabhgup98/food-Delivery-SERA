import React from 'react';

export interface Component {
  content: React.ReactNode;
  marginLeft?: string;  // Default: '0'
  marginRight?: string; // Default: '10px'
  className?: string;
}

export interface ContentRow {
  components: Component | Component[]; 
  gap?: string; 
  className?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}

// Props interface
export interface SecondaryContentContainerProps {
  rows: ContentRow[];  
  rowGap?: string; 
  className?: string;
  
  bgColor?: string;        
  bgHoverColor?: string;   
  border?: string;         
  borderColor?: string;   
  borderHoverColor?: string; 
}

// Helper function to get alignment class
const getAlignClass = (align?: 'start' | 'center' | 'end' | 'stretch'): string => {
  switch (align) {
    case 'start':
      return 'items-start';
    case 'end':
      return 'items-end';
    case 'stretch':
      return 'items-stretch';
    case 'center':
    default:
      return 'items-center';
  }
};

// Helper function to get justify class
const getJustifyClass = (justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'): string => {
  switch (justify) {
    case 'start':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'end':
      return 'justify-end';
    case 'space-between':
      return 'justify-between';
    case 'space-around':
      return 'justify-around';
    case 'space-evenly':
      return 'justify-evenly';
    default:
      return 'justify-start';
  }
};

const SecondaryContentContainer: React.FC<SecondaryContentContainerProps> = ({
  rows,
  rowGap = '0px',
  className = '',
  bgColor = 'transparent',
  bgHoverColor = 'transparent',
  border = 'none',
  borderColor = 'transparent',
  borderHoverColor = 'transparent',
}) => {
  // Build container classes with default width: fit-content, height: 100%
  const containerClasses = [
    'flex',
    'flex-col',
    'w-fit',
    'h-full',
    'transition-all',
    'duration-200',
    bgColor,
    bgHoverColor,
    border,
    borderColor,
    borderHoverColor,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build container style
  const containerStyle: React.CSSProperties = {
    gap: rowGap,
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      {rows.map((row, rowIndex) => {
        const alignClass = getAlignClass(row.align);
        const justifyClass = getJustifyClass(row.justify);
        const rowClasses = [
          'flex',
          alignClass,
          justifyClass,
          row.className || '',
        ]
          .filter(Boolean)
          .join(' ');

        // Check if uniform gap is provided
        const hasUniformGap = !!row.gap;
        const rowGapStyle = hasUniformGap ? { gap: row.gap } : {};

        // Normalize components to array
        const componentsArray = Array.isArray(row.components) 
          ? row.components 
          : [row.components];

        return (
          <div key={rowIndex} className={rowClasses} style={rowGapStyle}>
            {componentsArray.map((component, compIndex) => {
              // If gap is provided, ignore margins
              if (hasUniformGap) {
                return (
                  <div key={compIndex} className={component.className || ''}>
                    {component.content}
                  </div>
                );
              }

              // Use margins (with defaults)
              const marginLeft = component.marginLeft ?? '0';
              const marginRight = component.marginRight ?? '10px';
              
              const componentStyle = {
                marginLeft,
                marginRight,
              };

              return (
                <div
                  key={compIndex}
                  className={component.className || ''}
                  style={componentStyle}
                >
                  {component.content}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SecondaryContentContainer;