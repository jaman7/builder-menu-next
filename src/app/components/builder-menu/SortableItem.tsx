import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { INavItem } from '@/store/navigationStore';
import { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import TreeItem from './TreeItem';
import React from 'react';

interface IProps {
  id: string | number;
  item?: INavItem;
  navChildren?: INavItem[];
  show?: string;
  childCount?: number;
  value?: string | number;
  indicator?: boolean;
  clone?: boolean;
  depth?: number;
  indentationWidth?: number;
  // onEdit?: () => void;
}

const SortableItem: React.FC<IProps> = ({ id, depth, ...props }) => {
  const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) => (isSorting || wasDragging ? false : true);

  const { attributes, isDragging, isSorting, listeners, setDraggableNodeRef, setDroppableNodeRef, transform, transition } = useSortable({
    id,
    animateLayoutChanges,
    disabled: true,
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    boxSizing: 'border-box',
  };

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      id={id}
      {...props}
    />
  );
};

export default SortableItem;
