import { INavItem } from '@/src/app/store/navigationStore';
import { findMaxId, findParentById } from './navigation';

describe('findParentById', () => {
  it('should find the parent of a direct child', () => {
    const items: INavItem[] = [
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [{ id: 2, parentId: 1, label: 'Child', children: [], level: 1, order: 0 }],
        level: 0,
        order: 0,
      },
    ];
    const result = findParentById(items, 2);
    expect(result).toEqual({
      id: 1,
      parentId: null,
      label: 'Root',
      level: 0,
      order: 0,
      children: [{ id: 2, parentId: 1, label: 'Child', children: [], level: 1, order: 0 }],
    });
  });

  it('should find the parent of a nested child', () => {
    const items: INavItem[] = [
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child',
            children: [{ id: 3, parentId: 2, label: 'Grandchild', children: [], level: 2, order: 0 }],
            level: 1,
            order: 0,
          },
        ],
        level: 0,
        order: 0,
      },
    ];
    const result = findParentById(items, 3);
    expect(result).toEqual({
      id: 2,
      parentId: 1,
      label: 'Child',
      children: [{ id: 3, parentId: 2, label: 'Grandchild', children: [], level: 2, order: 0 }],
      level: 1,
      order: 0,
    });
  });

  it('should return undefined if the parentId does not exist', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const result = findParentById(items, 999);
    expect(result).toBeUndefined();
  });

  it('should return undefined if the tree is empty', () => {
    const items: INavItem[] = [];
    const result = findParentById(items, 1);
    expect(result).toBeUndefined();
  });
});

describe('findMaxId', () => {
  it('should return 0 for an empty tree', () => {
    const result = findMaxId([]);
    expect(result).toBe(0);
  });

  it('should return the max id for a flat list', () => {
    const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
    const result = findMaxId(items);
    expect(result).toBe(3);
  });

  it('should return the max id in a nested tree', () => {
    const items = [
      { id: 1, children: [{ id: 3 }, { id: 2 }] },
      { id: 4, children: [{ id: 7 }, { id: 5, children: [{ id: 6 }] }] },
    ];
    const result = findMaxId(items);
    expect(result).toBe(7);
  });
});
