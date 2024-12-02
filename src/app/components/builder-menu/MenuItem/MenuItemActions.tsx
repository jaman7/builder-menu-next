import Button, { ButtonVariant } from '@/src/app/shared/components/button/Button';
import { INavItem } from '@/src/app/store/navigationStore';
import React from 'react';

export interface IProps {
  id?: string | number;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNew?: (parentId?: string | number) => void;
}

const MenuItemActions: React.FC<IProps> = ({ id, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="flex items-center gap-x-0">
      <Button variant={ButtonVariant.SECONDARY} handleClick={onEdit} className="rounded-none first:rounded-l-lg text-sm">
        Edytuj
      </Button>
      <Button variant={ButtonVariant.SECONDARY} handleClick={onDelete} className="rounded-none text-sm">
        Usuń
      </Button>
      <Button variant={ButtonVariant.SECONDARY} handleClick={() => onAddNew?.(id)} className="rounded-none last:rounded-r-lg text-sm">
        Dodaj pod-menu
      </Button>
    </div>
  );
};

export default React.memo(MenuItemActions);
