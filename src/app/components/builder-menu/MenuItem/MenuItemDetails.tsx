import React from 'react';

const MenuItemDetails: React.FC<{ label: string; url: string }> = ({ label, url }) => {
  return (
    <div className="flex w-full flex-col">
      <span className="text-primary text-sm font-semibold">{label}</span>
      <span className="link-color text-sm">{url}</span>
    </div>
  );
};

export default React.memo(MenuItemDetails);
