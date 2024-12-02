export type TreeCallback<T> = (node: T) => boolean;

export const traverseTree = <T extends { children?: T[] }>(items: T[], callback: TreeCallback<T>): T | undefined => {
  for (const node of items) {
    if (callback(node)) return node;
    if (node?.children?.length) {
      const found = traverseTree(node.children, callback);
      if (found) return found;
    }
  }
  return undefined;
};

export const groupByParent = <T extends { parentId?: string | number | null }>(items: T[]): Map<string | number | null, T[]> => {
  return items.reduce((map, item) => {
    const parentId = item.parentId ?? null;
    if (!map.has(parentId)) {
      map.set(parentId, []);
    }
    map.get(parentId)!.push(item);
    return map;
  }, new Map<string | number | null, T[]>());
};
