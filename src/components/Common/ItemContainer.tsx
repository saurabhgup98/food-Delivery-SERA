import React from 'react';

export interface RowDef {
  content: React.ReactNode | React.ReactNode[];
  className?: string;
}

export interface ColumnDef {
  content?: React.ReactNode | React.ReactNode[];
  rows?: RowDef[];
  width?: string;
  className?: string;
  rowGap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export interface ItemContainerProps {
  left?: ColumnDef | ColumnDef[] | null;
  center?: ColumnDef | ColumnDef[] | null;
  right?: ColumnDef | ColumnDef[] | null;
  centered?: boolean;
  columnGap?: string;
  className?: string;
  shape?: 'circular' | 'rectangle';
  size?: string;
  bgColor?: string;
  border?: string;
  borderColor?: string;
  gradient?: string;
  shadow?: string;
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  left,
  center,
  right,
  centered = false,
  columnGap = 'space-x-2',
  className,
  shape = "circular",
  size,
  bgColor = "bg-white/20",
  border = "border",
  borderColor,
  gradient,
  shadow,
}) => {
  // Render content (single item or array of items)
  const renderContent = (content: React.ReactNode | React.ReactNode[] | undefined) => {
    if (!content) return null;

    if (Array.isArray(content)) {
      return (
        <div className="flex items-center gap-1">
          {content.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}
        </div>
      );
    }

    return <>{content}</>;
  };

  // Render a single column
  const renderColumn = (column: ColumnDef) => {
    const width = column.width || 'w-fit';
    // For flex-col, use justify-* for vertical alignment
    const align = column.align === 'center' ? 'justify-center' :  // ← Change to justify-center
      column.align === 'end' ? 'justify-end' :          // ← Change to justify-end
        column.align === 'stretch' ? 'items-stretch' : 'justify-start';  // ← Change to justify-start

    // Multiple rows
    if (column.rows?.length) {
      return (
        <div className={`flex flex-col h-full ${width} ${align} ${column.rowGap || ''} ${column.className || ''}`}>
          {column.rows.map((row, i) => (
            <div key={i} className={row.className || ''}>
              {renderContent(row.content)}
            </div>
          ))}
        </div>
      );
    }

    // Single row (default)
    return (
      <div className={`flex flex-col h-full ${width} ${align} ${column.className || ''}`}>
        {renderContent(column.content)}
      </div>
    );
  };

  // Render section (single column or multiple columns)
  const renderSection = (section: ColumnDef | ColumnDef[] | null | undefined) => {
    if (!section) return null;

    // Multiple columns
    if (Array.isArray(section)) {
      return (
        <div className="flex items-center gap-2 h-full">
          {section.map((col, i) => (
            <React.Fragment key={i}>{renderColumn(col)}</React.Fragment>
          ))}
        </div>
      );
    }

    // Single column
    return renderColumn(section);
  };

  const justifyClass = centered ? 'justify-center' : 'justify-between';
  const containerClasses = [
    'flex', 'items-center', 'backdrop-blur-sm', 'shadow-lg', 'transition-all', 'duration-200',
    justifyClass, columnGap, 'box-border',
    shape === 'circular' ? 'rounded-full' : 'rounded',
    size || 'w-fit h-full',
    border || '', borderColor || '', bgColor || '', gradient || '', shadow || '', className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {left && renderSection(left)}
      {center && renderSection(center)}
      {right && renderSection(right)}
    </div>
  );
};

export default ItemContainer;