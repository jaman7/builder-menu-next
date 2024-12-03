import { INavItem } from '@/src/app/store/navigationStore';
import {
  childrenCount,
  findItemDeep,
  findMaxId,
  findParentById,
  getDragDepth,
  getMaxDepth,
  getMinDepth,
  levelProjection,
} from './navigation';
import { IFlattenedItem } from '@/src/app/components/builder-menu/MenuEditor.model';

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

describe('getDragDepth', () => {
  it('should calculate correct drag depth for positive offset', () => {
    expect(getDragDepth(100, 20)).toBe(5);
  });

  it('should calculate correct drag depth for negative offset', () => {
    expect(getDragDepth(-50, 10)).toBe(-5);
  });

  it('should return 0 for zero offset', () => {
    expect(getDragDepth(0, 15)).toBe(0);
  });

  it('should handle large indentation widths', () => {
    expect(getDragDepth(100, 50)).toBe(2);
  });
});

describe('getMaxDepth', () => {
  it('should return 0 when previous item is null', () => {
    const previousItem = null as unknown as IFlattenedItem; // Cast to avoid type errors
    expect(getMaxDepth({ previousItem })).toBe(0);
  });

  it('should return previous item level + 1', () => {
    const previousItem: IFlattenedItem = {
      id: 1,
      parentId: null,
      level: 2,
      order: 0,
      children: [],
      label: 'Mock Item',
    };
    expect(getMaxDepth({ previousItem })).toBe(3);
  });
});

describe('getMinDepth', () => {
  it('should return 0 when next item is null', () => {
    const nextItem = null as unknown as IFlattenedItem; // Cast to avoid type errors
    expect(getMinDepth({ nextItem })).toBe(0);
  });

  it('should return next item level', () => {
    const nextItem: IFlattenedItem = {
      id: 2,
      parentId: 1,
      level: 2,
      order: 1,
      children: [],
      label: 'Mock Item',
    };
    expect(getMinDepth({ nextItem })).toBe(2);
  });
});

describe('childrenCount', () => {
  const tree = [
    {
      id: 1,
      children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }],
    },
  ];

  it('should return 0 for item with no children', () => {
    expect(childrenCount(tree, 4)).toBe(0);
  });

  it('should return correct count for item with children', () => {
    expect(childrenCount(tree, 1)).toBe(3);
  });

  it('should return correct count for deeply nested children', () => {
    expect(childrenCount(tree, 2)).toBe(1);
  });
});

describe('findItemDeep', () => {
  const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }];

  it('should find item at root level', () => {
    expect(findItemDeep(tree, 1)).toEqual({ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] });
  });

  it('should find item at nested level', () => {
    expect(findItemDeep(tree, 3)).toEqual({ id: 3 });
  });

  it('should return undefined for non-existent item', () => {
    expect(findItemDeep(tree, 999)).toBeUndefined();
  });
});

describe('levelProjection', () => {
  const items: IFlattenedItem[] = [
    { id: 1, level: 0, parentId: null, order: 0, children: [] },
    { id: 2, level: 1, parentId: 1, order: 0, children: [] },
    { id: 3, level: 2, parentId: 2, order: 0, children: [] },
  ];

  it('should calculate new depth and parent for higher level', () => {
    const result = levelProjection(items, 3, 1, -20, 10);
    expect(result).toEqual({ level: 0, parentId: null, maxDepth: 0, minDepth: 0 });
  });

  it('should calculate new depth and parent for lower level', () => {
    const result = levelProjection(items, 3, 2, 20, 10);
    expect(result).toEqual({ level: 1, parentId: 1, maxDepth: 1, minDepth: 1 });
  });

  it('should handle a neutral drag (no offset)', () => {
    const result = levelProjection(items, 3, 2, 0, 10);
    expect(result).toEqual({ level: 1, parentId: 1, maxDepth: 1, minDepth: 1 });
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
