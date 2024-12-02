import Button, { ButtonVariant } from '@/src/app/shared/components/button/Button';
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
      <Button variant={ButtonVariant.SECONDARY} handleClick={onEdit} className="rounded-none text-sm first:rounded-l-lg">
        Edytuj
      </Button>
      <Button variant={ButtonVariant.SECONDARY} handleClick={onDelete} className="rounded-none text-sm">
        Usuń
      </Button>
      <Button variant={ButtonVariant.SECONDARY} handleClick={() => onAddNew?.(id)} className="rounded-none text-sm last:rounded-r-lg">
        Dodaj pod-menu
      </Button>
    </div>
  );
};

export default React.memo(MenuItemActions);
