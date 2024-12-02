import React from 'react';

const MenuItemDetails: React.FC<{ label: string; url: string }> = ({ label, url }) => {
  return (
    <div className="flex flex-col w-full">
      <span className="text-sm text-primary font-semibold">{label}</span>
      <span className="text-sm link-color">{url}</span>
    </div>
  );
};

export default React.memo(MenuItemDetails);
