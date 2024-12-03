export type TreeCallback<T> = (node: T) => boolean;

export const memoize = <Args extends unknown[], Result>(fn: (...args: Args) => Result): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();
  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      const result = fn(...args);
      cache.set(key, result);
    }
    return cache.get(key)!;
  };
};

export const traverseTreeIteratively = <T extends { children?: T[] }>(items: T[], callback: TreeCallback<T>): T | undefined => {
  const stack = [...items];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node && callback(node)) return node;
    if (node?.children?.length) stack.push(...node.children);
  }
  return undefined;
};
