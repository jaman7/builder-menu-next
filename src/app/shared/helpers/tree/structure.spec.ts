import { INavItem } from '@/src/app/store/navigationStore';
import {
  adjustTranslate,
  buildTree,
  buildTreeFromFlatten,
  findIdPushChildren,
  flattenTree,
  removeChildrenOf,
  updateOrderAndLevel,
} from './structure';
import { IFlattenedItem } from '@/src/app/components/builder-menu/MenuEditor.model';
import { Modifier } from '@dnd-kit/core';

describe('buildTree', () => {
  it('should return an empty array for an empty input', () => {
    expect(buildTree([])).toEqual([]);
  });

  it('should build a tree with a single root element', () => {
    const items = [{ id: 1, parentId: null, label: 'Root' }];
    const result = buildTree(items);
    expect(result).toEqual([{ id: 1, parentId: null, label: 'Root', children: [] }]);
  });

  it('should build a tree with nested elements', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root' },
      { id: 2, parentId: 1, label: 'Child' },
    ];
    const result = buildTree(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [{ id: 2, parentId: 1, label: 'Child', children: [] }],
      },
    ]);
  });

  it('should handle multiple levels of nesting', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root' },
      { id: 2, parentId: 1, label: 'Child 1' },
      { id: 3, parentId: 2, label: 'Child 2' },
    ];
    const result = buildTree(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child 1',
            children: [{ id: 3, parentId: 2, label: 'Child 2', children: [] }],
          },
        ],
      },
    ]);
  });

  it('should ignore items with missing or invalid parentId', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root' },
      { id: 2, parentId: 999, label: 'Orphan' },
    ];
    const result = buildTree(items);
    expect(result).toEqual([{ id: 1, parentId: null, label: 'Root', children: [] }]);
  });
});

describe('flattenTree', () => {
  it('should flatten a tree with a single root element', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const result = flattenTree(items);
    expect(result).toEqual([{ id: 1, parentId: null, label: 'Root', level: 0, order: 0, children: [] }]);
  });

  it('should flatten a tree with nested elements', () => {
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
    const result = flattenTree(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        level: 0,
        order: 0,
        children: [{ id: 2, parentId: 1, label: 'Child', children: [], level: 1, order: 0 }],
      },
      { id: 2, parentId: 1, label: 'Child', level: 1, order: 0, children: [] },
    ]);
  });

  it('should flatten a tree with multiple levels', () => {
    const items: INavItem[] = [
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child 1',
            children: [{ id: 3, parentId: 2, label: 'Child 2', children: [], level: 2, order: 0 }],
            level: 1,
            order: 0,
          },
        ],
        level: 0,
        order: 0,
      },
    ];
    const result = flattenTree(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        level: 0,
        order: 0,
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child 1',
            children: [{ id: 3, parentId: 2, label: 'Child 2', children: [], level: 2, order: 0 }],
            level: 1,
            order: 0,
          },
        ],
      },
      {
        id: 2,
        parentId: 1,
        label: 'Child 1',
        level: 1,
        order: 0,
        children: [{ id: 3, parentId: 2, label: 'Child 2', children: [], level: 2, order: 0 }],
      },
      { id: 3, parentId: 2, label: 'Child 2', level: 2, order: 0, children: [] },
    ]);
  });
});

describe('removeChildrenOf', () => {
  it('should remove all children of a given parentId', () => {
    const items: IFlattenedItem[] = [
      {
        id: 1,
        label: 'Promocje',
        parentId: null,
        level: 0,
        order: 0,
      },
      {
        id: 2,
        label: 'Promocje 1',
        parentId: 1,
        level: 1,
        order: 0,
      },
      {
        id: 4,
        label: 'Promocje 3',
        parentId: 2,
        level: 2,
        order: 0,
      },
      {
        id: 5,
        label: 'Promocje 4',
        parentId: 2,
        level: 2,
        order: 1,
      },
    ];
    const result = removeChildrenOf(items, [])[1];
    expect(result).toEqual({ id: 2, parentId: 1, label: 'Promocje 1', level: 1, order: 0 });
  });

  it('should handle empty input gracefully', () => {
    const items: IFlattenedItem[] = [];
    const result = removeChildrenOf(items, [1]);
    expect(result).toEqual([]);
  });
});

describe('findIdPushChildren', () => {
  it('should add children to a root node', () => {
    const items = [{ id: 1, children: [] }];
    const newChildren = [{ id: 2 }, { id: 3 }];
    const result = findIdPushChildren(1, items, newChildren);
    expect(result).toEqual([{ id: 1, children: [{ id: 2 }, { id: 3 }] }]);
  });

  it('should add children to a nested node', () => {
    const items = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [],
          },
        ],
      },
    ];
    const newChildren = [{ id: 3 }];
    const result = findIdPushChildren(2, items, newChildren);
    expect(result).toEqual([
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [{ id: 3 }],
          },
        ],
      },
    ]);
  });

  it('should not modify the tree if the id is not found', () => {
    const items = [{ id: 1, children: [] }];
    const newChildren = [{ id: 2 }];
    const result = findIdPushChildren(999, items, newChildren);
    expect(result).toEqual(items);
  });

  it('should add children to the correct parent', () => {
    const sourceArray: INavItem[] = [
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child',
            children: [],
            level: 1,
            order: 0,
          },
        ],
        level: 0,
        order: 0,
      },
    ];
    const newChildren: INavItem[] = [{ id: 3, parentId: 2, label: 'Grandchild', children: [], level: 2, order: 0 }];
    const result = findIdPushChildren(2, sourceArray, newChildren);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child',
            children: [
              {
                id: 3,
                parentId: 2,
                label: 'Grandchild',
                children: [],
                level: 2,
                order: 0,
              },
            ],
            level: 1,
            order: 0,
          },
        ],
        level: 0,
        order: 0,
      },
    ]);
  });
});

describe('buildTreeFromFlatten', () => {
  it('should return an empty array for an empty input', () => {
    const result = buildTreeFromFlatten([]);
    expect(result).toEqual([]);
  });

  it('should build a single-level tree', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root', order: 0, level: 0 },
      { id: 2, parentId: 1, label: 'Child', order: 1, level: 1 },
    ];
    const result = buildTreeFromFlatten(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        order: 0,
        level: 0,
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child',
            order: 1,
            level: 1,
            children: [],
          },
        ],
      },
    ]);
  });

  it('should handle multiple levels of nesting', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root', order: 0, level: 0 },
      { id: 2, parentId: 1, label: 'Child 1', order: 1, level: 1 },
      { id: 3, parentId: 2, label: 'Child 2', order: 2, level: 2 },
    ];
    const result = buildTreeFromFlatten(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        order: 0,
        level: 0,
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child 1',
            order: 1,
            level: 1,
            children: [
              {
                id: 3,
                parentId: 2,
                label: 'Child 2',
                order: 2,
                level: 2,
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should throw an error for invalid parent references', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root', order: 0, level: 0 },
      { id: 2, parentId: 999, label: 'Invalid Child', order: 1, level: 1 },
    ];
    expect(() => buildTreeFromFlatten(items)).toThrow('Item with id 999 not found');
  });
});

describe('updateOrderAndLevel', () => {
  it('should update order and level for a single-level tree', () => {
    const items = [
      { id: 1, order: null, level: null, children: [] },
      { id: 2, order: null, level: null, children: [] },
    ];
    const result = updateOrderAndLevel(items);
    expect(result).toEqual([
      { id: 1, order: 0, level: 0, children: [] },
      { id: 2, order: 1, level: 0, children: [] },
    ]);
  });

  it('should update order and level for a multi-level tree', () => {
    const items = [
      {
        id: 1,
        order: null,
        level: null,
        children: [
          { id: 2, order: null, level: null, children: [] },
          { id: 3, order: null, level: null, children: [{ id: 4, order: null, level: null, children: [] }] },
        ],
      },
    ];
    const result = updateOrderAndLevel(items);
    expect(result).toEqual([
      {
        id: 1,
        order: 0,
        level: 0,
        children: [
          { id: 2, order: 0, level: 1, children: [] },
          { id: 3, order: 1, level: 1, children: [{ id: 4, order: 0, level: 2, children: [] }] },
        ],
      },
    ]);
  });

  it('should handle an empty array gracefully', () => {
    const result = updateOrderAndLevel([]);
    expect(result).toEqual([]);
  });

  it('should update levels and orders correctly', () => {
    const items: INavItem[] = [
      {
        id: 1,
        parentId: null,
        label: 'Root',
        level: 0,
        order: 0,
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child 1',
            level: 1,
            order: 0,
            children: [{ id: 3, parentId: 2, label: 'Child 2', level: 2, order: 0, children: [] }],
          },
          { id: 4, parentId: 1, label: 'Child 3', level: 1, order: 1, children: [] },
        ],
      },
    ];
    const result = updateOrderAndLevel(items);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        level: 0,
        order: 0,
        children: [
          {
            id: 2,
            parentId: 1,
            label: 'Child 1',
            level: 1,
            order: 0,
            children: [{ id: 3, parentId: 2, label: 'Child 2', level: 2, order: 0, children: [] }],
          },
          { id: 4, parentId: 1, label: 'Child 3', level: 1, order: 1, children: [] },
        ],
      },
    ]);
  });
});

describe('adjustTranslate', () => {
  it('should return the same transform values', () => {
    const input: Parameters<Modifier>[0] = {
      transform: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
      activatorEvent: null,
      active: null,
      activeNodeRect: null,
      draggingNodeRect: null,
      containerNodeRect: null,
      over: null,
      overlayNodeRect: null,
      scrollableAncestorRects: [],
      scrollableAncestors: [], // Dodano brakujące pole
      windowRect: null,
    };

    const result = adjustTranslate(input);
    expect(result).toEqual(input.transform);
  });
});
