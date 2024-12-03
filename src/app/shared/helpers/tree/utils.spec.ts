import { memoize, traverseTreeIteratively } from './utils';

interface TreeNode {
  id: number;
  parentId?: number | null;
  children?: TreeNode[];
}

describe('traverseTreeIteratively', () => {
  it('should find an element at the root level', () => {
    const items: TreeNode[] = [
      { id: 1, children: [] },
      { id: 2, children: [] },
    ];
    const result = traverseTreeIteratively(items, (node) => node.id === 1);
    expect(result).toEqual({ id: 1, children: [] });
  });

  it('should find an element at a nested level', () => {
    const items: TreeNode[] = [
      { id: 1, children: [{ id: 2, children: [] }] },
      { id: 3, children: [] },
    ];
    const result = traverseTreeIteratively(items, (node) => node.id === 2);
    expect(result).toEqual({ id: 2, children: [] });
  });

  it('should return undefined if element does not exist', () => {
    const items: TreeNode[] = [
      { id: 1, children: [{ id: 2, children: [] }] },
      { id: 3, children: [] },
    ];
    const result = traverseTreeIteratively(items, (node) => node.id === 999);
    expect(result).toBeUndefined();
  });

  it('should handle empty input gracefully', () => {
    const result = traverseTreeIteratively<TreeNode>([], (node) => node.id === 1);
    expect(result).toBeUndefined();
  });
});

describe('memoize', () => {
  it('should cache results for the same inputs', () => {
    const mockFn = jest.fn((x) => x * 2);
    const memoizedFn = memoize(mockFn);

    expect(memoizedFn(2)).toBe(4);
    expect(memoizedFn(2)).toBe(4);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should re-evaluate for different inputs', () => {
    const mockFn = jest.fn((x) => x * 2);
    const memoizedFn = memoize(mockFn);

    expect(memoizedFn(2)).toBe(4);
    expect(memoizedFn(3)).toBe(6);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
