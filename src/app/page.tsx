'use client';

import React from 'react';
import MenuEditor from '@/components/builder-menu/MenuEditor';
import MultiLevelMenu from '@/components/primary-menu/MultiLevelMenu';

export default function Home() {
  return (
    <div className="block p-4 rounded-lg bg-transparent">
      <MultiLevelMenu />
      <MenuEditor />
    </div>
  );
}
