import { INavItem } from '@/store/navigationStore';
import MenuItem from './MenuItem/MenuItem';
import { indentationWidth } from './MenuEditor.const';
import React from 'react';

interface IProps {
  item: INavItem;
  nDepth: number;
}

const RecursiveItem: React.FC<IProps> = ({ item, nDepth }) => {
  const newDepth = nDepth + 1;
  return (
    <>
      <div
        className="RecursiveItem"
        style={{
          marginLeft: `${nDepth * indentationWidth}px`,
          boxSizing: 'border-box',
        }}
      >
        <MenuItem item={item} id={item.id} />
      </div>
      {item?.children?.map((el) => {
        return <RecursiveItem key={`${el.id}-newDepth`} item={el} nDepth={newDepth} />;
      })}
    </>
  );
};

export default React.memo(RecursiveItem);
