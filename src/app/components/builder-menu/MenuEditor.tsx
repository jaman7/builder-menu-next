import React, { useState } from 'react';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import PlusIcon from '@/shared/components/icons/PlusIcon';
import MenuForm from './MenuForm';
import useNavigationStore from '@/store/navigationStore';
import MenuListDrag from './MenuListDrag';
import EmptyState from './EmptyState';
import Collapse from '@/shared/components/Collapse';

interface IProps {
  style?: 'bordered' | 'shadow';
}

export const MenuEditor: React.FC<IProps> = ({ style = 'bordered' }) => {
  const { navigation } = useNavigationStore();
  const [addingNew, setAddingNew] = useState(false);

  return (
    <div className="border-primary block rounded-lg border border-solid bg-transparent">
      {navigation.length > 0 ? <MenuListDrag style={style} /> : <EmptyState onAdd={() => setAddingNew(true)} />}

      {addingNew && (
        <Collapse isOpen={addingNew} padding={{ paddingBottom: 0, paddingTop: 20 }}>
          <MenuForm onSubmit={() => setAddingNew(false)} onCancel={() => setAddingNew(false)} />
        </Collapse>
      )}
      {navigation.length > 0 && (
        <div className="block px-6 py-5">
          <Button handleClick={() => setAddingNew(true)} variant={ButtonVariant.SECONDARY}>
            <span className="flex items-center space-x-2">
              <PlusIcon />
              <span>Dodaj pozycję menu</span>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
