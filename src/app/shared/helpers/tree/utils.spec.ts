import { groupByParent, traverseTree } from './utils';

describe('traverseTree', () => {
  it('should find an element at the root level', () => {
    const items = [
      { id: 1, children: [] },
      { id: 2, children: [] },
    ];
    const result = traverseTree(items, (node) => node.id === 1);
    expect(result).toEqual({ id: 1, children: [] });
  });

  it('should find an element at a nested level', () => {
    const items = [
      { id: 1, children: [{ id: 2, children: [] }] },
      { id: 3, children: [] },
    ];
    const result = traverseTree(items, (node) => node.id === 2);
    expect(result).toEqual({ id: 2, children: [] });
  });

  it('should return undefined if element does not exist', () => {
    const items = [
      { id: 1, children: [{ id: 2, children: [] }] },
      { id: 3, children: [] },
    ];
    const result = traverseTree(items, (node) => node.id === 999);
    expect(result).toBeUndefined();
  });

  it('should handle empty input gracefully', () => {
    const result = traverseTree<{ id: number; children?: any[] }>([], (node) => node?.id === 1);
    expect(result).toBeUndefined();
  });
});

describe('groupByParent', () => {
  it('should group items by parentId', () => {
    const items = [
      { id: 1, parentId: null },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 1 },
    ];
    const result = groupByParent(items);
    expect(result.get(null)).toEqual([{ id: 1, parentId: null }]);
    expect(result.get(1)).toEqual([
      { id: 2, parentId: 1 },
      { id: 3, parentId: 1 },
    ]);
  });

  it('should return empty map for empty input', () => {
    const result = groupByParent([]);
    expect(result.size).toBe(0);
  });

  it('should group items with no children', () => {
    const items = [{ id: 1, parentId: null }];
    const result = groupByParent(items);
    expect(result.get(null)).toEqual([{ id: 1, parentId: null }]);
    expect(result.get(1)).toBeUndefined();
  });
});
