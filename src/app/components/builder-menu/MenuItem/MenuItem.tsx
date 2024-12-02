import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import DragIcon from '@/shared/components/icons/DragIcon';
import { INavItem } from '@/store/navigationStore';
import { UniqueIdentifier } from '@dnd-kit/core';
import classNames from 'classnames';
import MenuItemDetails from './MenuItemDetails';
import MenuItemActions from './MenuItemActions';

export interface IProps {
  id: string | number;
  item?: INavItem;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNew?: (parentId?: string | number) => void;
}

const MenuItem: React.FC<IProps> = ({ id, item, onEdit, onDelete, onAddNew }) => {
  const { attributes, listeners, setActivatorNodeRef } = useSortable({ id: id as UniqueIdentifier });
  const { level, order, children, label, url } = item || {};

  const styleClass = classNames(
    'three-details bg-white py-4 px-4 border-gray-color border border-solid border-secondary flex w-full items-center justify-between',
    { 'rounded-t-lg': order === 0 && level === 0, 'rounded-bl-lg': children && children?.length > 0 }
  );

  return (
    <div className={styleClass}>
      <div className="flex items-center">
        <i className="drag-handle cursor-move p-2.5 text-4xl" ref={setActivatorNodeRef} {...attributes} {...listeners}>
          <DragIcon />
        </i>

        <MenuItemDetails label={label ?? ''} url={url ?? ''} />
      </div>
      <MenuItemActions onEdit={onEdit} onDelete={onDelete} onAddNew={() => onAddNew?.(id)} />
    </div>
  );
};

export default React.memo(MenuItem);
