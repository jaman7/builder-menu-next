'use client';

import React from 'react';
import MenuEditor from '@/components/builder-menu/MenuEditor';
import MultiLevelMenu from '@/components/primary-menu/MultiLevelMenu';

export default function Home() {
  return (
    <div className="block rounded-lg bg-transparent p-4">
      <MultiLevelMenu />
      <MenuEditor />
    </div>
  );
}
