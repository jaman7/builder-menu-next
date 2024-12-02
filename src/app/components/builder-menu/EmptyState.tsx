import React from 'react';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import PlusIcon from '@/shared/components/icons/PlusIcon';

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-secondary rounded-lg">
      <p className="text-primary text-center mb-2 font-semibold">Menu jest puste</p>
      <p className="text-tertiary text-center mb-2 text-sm">W tym menu nie ma jeszcze żadnych linków</p>
      <Button handleClick={onAdd} variant={ButtonVariant.PRIMARY}>
        <PlusIcon />
        <span className="ml-1">Dodaj pozycję menu</span>
      </Button>
    </div>
  );
}
