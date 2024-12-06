import React, { memo, useEffect } from 'react';
import classNames from 'classnames';
import CaretIcon from '@/shared/components/icons/CaretIcon';
import useNavigationStore, { INavItem } from '@/store/navigationStore';
import { buildTreeFromFlattenIteratively } from '@/shared/helpers/tree';
import { IFlattenedItem } from '../builder-menu/MenuEditor.model';
import './MultiLevelMenu.scss';

const initialNavigation: INavItem[] = [
  { id: 1, label: 'Promocje', url: '#qqqqqqqqqqq', parentId: null, level: 0, order: 0 },
  { id: 2, label: 'Promocje 1', url: '#wwwwwwwwwwwwwwwww', parentId: 1, level: 1, order: 1 },
  { id: 3, label: 'Promocje 2', url: '#eeeeeeeeeeeee', parentId: 1, level: 1, order: 0 },
  { id: 4, label: 'Promocje 3', url: '#rrrrrrrrrrrrr', parentId: 2, level: 2, order: 1 },
  { id: 5, label: 'Promocje 4', url: '#ttttttttttttt', parentId: 2, level: 2, order: 0 },
  { id: 6, label: 'Promocje 5', url: '#yyyyyyyyyyyy', parentId: 5, level: 2, order: 2 },
  { id: 7, label: 'Promocje 6', url: '#uuuuuuuuuuuuu', parentId: 5, level: 2, order: 3 },
  { id: 8, label: 'Promocje 7', url: '#iiiiiiiiii', parentId: 7, level: 3, order: 1 },
  { id: 9, label: 'Promocje 8', url: '#oooooooooo', parentId: 7, level: 3, order: 0 },
  { id: 10, label: 'Ostatnie 7 dni', url: '#ppppppppppp', parentId: null, level: 0, order: 1 },
  { id: 11, label: 'Najlepsze 1', url: '#jjjjjjjjjjjj', parentId: 10, level: 1, order: 1 },
  { id: 12, label: 'Najlepsze 2', url: '#jjjjjjjjjjj', parentId: 10, level: 1, order: 2 },
  { id: 13, label: 'Najlepsze 3', url: '#jjjjjjjjj', parentId: 10, level: 1, order: 3 },
  { id: 14, label: 'Najlepsze 4', url: '#gggggggggg', parentId: 10, level: 1, order: 0 },
];

const MultiLevelMenu: React.FC = () => {
  const { navigation, setNavigation } = useNavigationStore();

  useEffect(() => {
    const tree = buildTreeFromFlattenIteratively(initialNavigation as IFlattenedItem[]);
    setNavigation(tree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Pusta tablica, aby efekt uruchomił się tylko raz

  const renderMenu = (items: INavItem[] | undefined, level = 0) => {
    if (!Array.isArray(items)) return null;

    return (
      <ul className={`${level === 0 ? 'menu' : 'menu-dropdown'} rounded-lg`} role="menu">
        {items.map((item, index) => (
          <li
            key={`${item.id}_menu-item`}
            role="menuitem"
            aria-expanded={!!item.children}
            tabIndex={index}
            style={{ '--item-index': index } as React.CSSProperties}
            className={classNames('item border border-solid border-secondary block rounded-lg', {
              horizonatal: level === 0 && item.children && item.children?.length > 0,
              vertical: level > 0 && item.children && item.children?.length > 0,
            })}
          >
            <div className="item-content">
              <span>{item.label}</span>
              {item.children && item.children?.length > 0 && <CaretIcon />}
            </div>
            {item.children && item.children?.length > 0 && renderMenu(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return navigation?.length > 0 && <nav className="nav-menu">{renderMenu(navigation)}</nav>;
};

export default memo(MultiLevelMenu);
