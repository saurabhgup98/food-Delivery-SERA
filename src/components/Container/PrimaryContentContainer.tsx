import React from 'react';

// Left/Right section interface (with margins)
export interface SideSection {
  content: React.ReactNode | React.ReactNode[];
  marginLeft?: string;  
  marginRight?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

// Center section interface (flexible, content centered)
export interface CenterSection {
  content: React.ReactNode | React.ReactNode[];
  className?: string;
  align?: 'start' | 'center' | 'end'; // Default: 'center'
}

// Props interface
export interface PrimaryContentContainerProps {
  // Left section: fixed width with margins, content on left
  left?: SideSection;
  
  // Center section: flexible width (fills remaining space), content centered
  center?: CenterSection;
  
  // Right section: fixed width with margins, content on right
  right?: SideSection;
  
  // Optional: gap between sections
  sectionGap?: string; // e.g., 'gap-2', '10px'
  
  // Container styling
  className?: string;
  
  // CSS Props
  bgColor?: string;        // e.g., 'bg-orange-500', '#ff6b9d'
  bgHoverColor?: string;   // e.g., 'hover:bg-orange-600', '#ff5a8d'
  border?: string;          // e.g., 'border', 'border-2', '1px solid'
  borderColor?: string;    // e.g., 'border-gray-300', '#ccc'
  borderHoverColor?: string; // e.g., 'hover:border-gray-400', '#aaa'
  width?: string;          // e.g., 'w-full', '100px', '100%'
  height?: string;         // e.g., 'h-10', '40px', '100%'
  radius?: string;         // e.g., 'rounded-full' (circular), 'rounded-md', 'rounded-none'
  // If radius is not provided, default to circular (rounded-full)
}

// Helper function to render content (single or array)
const renderContent = (content: React.ReactNode | React.ReactNode[] | undefined): React.ReactNode => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return (
      <>
        {content.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </>
    );
  }

  return <>{content}</>;
};

// Helper function to get alignment class
const getAlignClass = (align?: 'start' | 'center' | 'end'): string => {
  switch (align) {
    case 'start':
      return 'justify-start';
    case 'end':
      return 'justify-end';
    case 'center':
    default:
      return 'justify-center';
  }
};

const PrimaryContentContainer: React.FC<PrimaryContentContainerProps> = ({
  left,
  center,
  right,
  sectionGap = '0px',
  className = '',
  bgColor,
  bgHoverColor,
  border,
  borderColor,
  borderHoverColor,
  width,
  height,
  radius,
}) => {
  // Default radius to circular if not provided
  const borderRadius = radius || 'rounded-full';

  // Build container classes
  const containerClasses = [
    'flex',
    'items-center',
    'transition-all',
    'duration-200',
    width || 'w-full',
    height || 'h-full',
    borderRadius,
    bgColor,
    bgHoverColor,
    border,
    borderColor,
    borderHoverColor,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build section gap style
  const gapStyle = sectionGap ? { gap: sectionGap } : {};

  return (
    <div className={containerClasses} style={gapStyle}>
      {/* Left Section */}
      {left && (
        <div
          className={`flex items-center ${getAlignClass(left.align)} ${left.className || ''}`}
          style={{
            marginLeft: left.marginLeft || '0',
            marginRight: left.marginRight || '0',
          }}
        >
          {renderContent(left.content)}
        </div>
      )}

      {/* Center Section - Flexible, fills remaining space */}
      {center && (
        <div
          className={`flex-1 flex items-center ${getAlignClass(center.align || 'center')} ${center.className || ''}`}
        >
          {renderContent(center.content)}
        </div>
      )}

      {/* Right Section */}
      {right && (
        <div
          className={`flex items-center ${getAlignClass(right.align)} ${right.className || ''}`}
          style={{
            marginLeft: right.marginLeft || '0',
            marginRight: right.marginRight || '0',
          }}
        >
          {renderContent(right.content)}
        </div>
      )}
    </div>
  );
};

export default PrimaryContentContainer;