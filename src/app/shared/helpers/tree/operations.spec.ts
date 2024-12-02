import { INavItem } from '@/src/app/store/navigationStore';
import { addItem, deleteItem, updateItem } from './operations';

describe('addItem', () => {
  it('should add an item as a child of a nested element', () => {
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
    const newItem: INavItem = { id: 3, parentId: 2, label: 'Grandchild', children: [] };
    const result = addItem(items, newItem, 2);
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
            children: [{ id: 3, parentId: 2, label: 'Grandchild', children: [], level: 2, order: 0 }],
            level: 1,
            order: 0,
          },
        ],
        level: 0,
        order: 0,
      },
    ]);
  });

  it('should throw an error if parentId does not exist in a nested tree', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const newItem: INavItem = { id: 2, parentId: 999, label: 'Invalid Parent', children: [] };
    expect(() => addItem(items, newItem, 999)).toThrowError('Parent with id 999 does not exist.');
  });
});

describe('updateItem', () => {
  it('should update the label of a root item', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const updatedFields = { label: 'Updated Root' };
    const result = updateItem(items, 1, updatedFields);
    expect(result).toEqual([{ id: 1, parentId: null, label: 'Updated Root', children: [], level: 0, order: 0 }]);
  });

  it('should update the label of a child item', () => {
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
    const updatedFields = { label: 'Updated Child' };
    const result = updateItem(items, 2, updatedFields);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [{ id: 2, parentId: 1, label: 'Updated Child', children: [], level: 1, order: 0 }],
        level: 0,
        order: 0,
      },
    ]);
  });

  it('should do nothing if the item does not exist', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const updatedFields = { label: 'Non-existent' };
    const result = updateItem(items, 999, updatedFields);
    expect(result).toEqual(items);
  });
});

describe('deleteItem', () => {
  it('should delete an item with no children', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const result = deleteItem(items, 1);
    expect(result).toEqual([]);
  });

  it('should delete an item and its children', () => {
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
    const result = deleteItem(items, 1);
    expect(result).toEqual([]);
  });

  it('should delete a child item and leave the parent intact', () => {
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
    const result = deleteItem(items, 2);
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        label: 'Root',
        children: [],
        level: 0,
        order: 0,
      },
    ]);
  });

  it('should do nothing if the item does not exist', () => {
    const items: INavItem[] = [{ id: 1, parentId: null, label: 'Root', children: [], level: 0, order: 0 }];
    const result = deleteItem(items, 999);
    expect(result).toEqual(items);
  });
});
