import React from 'react';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import PlusIcon from '@/shared/components/icons/PlusIcon';

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-secondary flex flex-col items-center justify-center rounded-lg p-6">
      <p className="text-primary mb-2 text-center font-semibold">Menu jest puste</p>
      <p className="text-tertiary mb-2 text-center text-sm">W tym menu nie ma jeszcze żadnych linków</p>
      <Button handleClick={onAdd} variant={ButtonVariant.PRIMARY}>
        <PlusIcon />
        <span className="ml-1">Dodaj pozycję menu</span>
      </Button>
    </div>
  );
}
