import { INavItem } from '@/src/app/store/navigationStore';
import {
  adjustTranslate,
  buildTreeFromFlatten,
  buildTreeFromFlattenIteratively,
  findIdPushChildren,
  findItem,
  flattenTreeIterativeWithImmer,
  updateOrderAndLevel,
} from './structure';
import { Modifier } from '@dnd-kit/core';

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

describe('flattenTreeIterativeWithImmer', () => {
  it('should flatten a tree with a single root element', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const result = flattenTreeIterativeWithImmer([], items);
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
    const result = flattenTreeIterativeWithImmer([], items);
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
    const result = flattenTreeIterativeWithImmer([], items);
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

  it('should handle circular references gracefully', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root', children: [{ id: 2, parentId: 1 }] },
      { id: 2, parentId: 1, label: 'Child', children: [{ id: 1, parentId: 2 }] }, // Circular reference
    ];
    expect(() => flattenTreeIterativeWithImmer([], items)).toThrow('Circular reference detected');
  });

  it('should handle large trees efficiently', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      parentId: i > 0 ? i : null,
      children: [],
    }));
    const result = flattenTreeIterativeWithImmer([], items);
    expect(result).toHaveLength(1000);
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

  it('should do nothing when copyChildren is empty', () => {
    const items = [{ id: 1, children: [] }];
    const result = findIdPushChildren(1, items, []);
    expect(result).toEqual([{ id: 1, children: [] }]);
  });

  it('should not modify the tree when findId does not exist', () => {
    const items = [{ id: 1, children: [] }];
    const newChildren = [{ id: 2 }];
    const result = findIdPushChildren(999, items, newChildren);
    expect(result).toEqual(items);
  });
});

describe('buildTreeFromFlattenIteratively', () => {
  it('should return an empty array for an empty input', () => {
    const result = buildTreeFromFlattenIteratively([]);
    expect(result).toEqual([]);
  });

  it('should build a single-level tree', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root', order: 0, level: 0 },
      { id: 2, parentId: 1, label: 'Child', order: 1, level: 1 },
    ];
    const result = buildTreeFromFlattenIteratively(items);
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
    const result = buildTreeFromFlattenIteratively(items);
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
    expect(() => buildTreeFromFlattenIteratively(items)).toThrow('Parent with parentId 999 not found for id 2');
  });

  it('should handle circular references gracefully', () => {
    const items = [
      { id: 1, parentId: 2, label: 'Circular Parent', level: 0, order: 0 },
      { id: 2, parentId: 1, label: 'Circular Child', level: 1, order: 0 },
    ];
    expect(() => buildTreeFromFlattenIteratively(items)).toThrow('Parent with parentId 2 not found for id 1');
  });

  it('should handle duplicate ids', () => {
    const items = [
      { id: 1, parentId: null, label: 'Root', level: 0, order: 0 },
      { id: 1, parentId: 1, label: 'Duplicate Child', level: 1, order: 0 },
    ];
    expect(() => buildTreeFromFlattenIteratively(items)).toThrow('Duplicate id 1 found');
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

  it('should not modify already ordered items', () => {
    const items = [{ id: 1, order: 0, level: 0, children: [] }];
    const result = updateOrderAndLevel(items);
    expect(result).toEqual(items);
  });

  it('should handle deeply nested levels', () => {
    const items = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [
              {
                id: 3,
                children: [{ id: 4, children: [] }],
              },
            ],
          },
        ],
      },
    ];
    const result = updateOrderAndLevel(items);
    expect(result).toMatchSnapshot();
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
      scrollableAncestors: [],
      windowRect: null,
    };

    const result = adjustTranslate(input);
    expect(result).toEqual(input.transform);
  });

  it('should handle negative transform values', () => {
    const input: Parameters<Modifier>[0] = {
      transform: { x: -50, y: -100, scaleX: 1, scaleY: 1 },
      activatorEvent: null,
      active: null,
      activeNodeRect: null,
      draggingNodeRect: null,
      containerNodeRect: null,
      over: null,
      overlayNodeRect: null,
      scrollableAncestorRects: [],
      scrollableAncestors: [],
      windowRect: null,
    };
    const result = adjustTranslate(input);
    expect(result).toEqual({ x: -50, y: -100, scaleX: 1, scaleY: 1 });
  });

  it('should handle large transform values', () => {
    const input: Parameters<Modifier>[0] = {
      transform: { x: 10000, y: 20000, scaleX: 1, scaleY: 1 },
      activatorEvent: null,
      active: null,
      activeNodeRect: null,
      draggingNodeRect: null,
      containerNodeRect: null,
      over: null,
      overlayNodeRect: null,
      scrollableAncestorRects: [],
      scrollableAncestors: [],
      windowRect: null,
    };
    const result = adjustTranslate(input);
    expect(result).toEqual({ x: 10000, y: 20000, scaleX: 1, scaleY: 1 });
  });
});

describe('findItem', () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('should find the item if it exists', () => {
    expect(findItem(items, 2)).toEqual({ id: 2 });
  });

  it('should throw an error if the item does not exist', () => {
    expect(() => findItem(items, 999)).toThrow('Item with id 999 not found');
  });
});
