import { INavItem } from '@/src/app/store/navigationStore';
import { IFlattenedItem } from '@/src/app/components/builder-menu/MenuEditor.model';
import { Modifier, UniqueIdentifier } from '@dnd-kit/core';
import { memoize } from './utils';
import { produce } from 'immer';

export const buildTreeFromFlattenIteratively = (flattenedItems: IFlattenedItem[]): INavItem[] => {
  const map = new Map<string | number, IFlattenedItem>();
  const root: IFlattenedItem[] = [];
  const idSet = new Set<string | number>(); // Track IDs for duplicates

  flattenedItems?.forEach((item) => {
    const { id, parentId, ...rest } = item;
    if (idSet.has(id)) throw new Error(`Duplicate id ${id} found`);
    idSet.add(id);
    const newItem: IFlattenedItem = { id, parentId, ...rest, children: [] };
    if (parentId === null) {
      root.push(newItem);
    } else if (parentId && map.has(parentId)) {
      map.get(parentId)!.children!.push(newItem);
    } else {
      throw new Error(`Parent with id ${parentId} not found for item ${id}`);
    }
    map.set(id, newItem);
  });

  return root;
};

export const findIdPushChildren = (findId: number | string, sourceArray: INavItem[], copyChildren: INavItem[]): INavItem[] => {
  const recursiveSearch = (items: INavItem[]): boolean => {
    for (const item of items) {
      if (item?.id === findId) {
        item.children = [...copyChildren];
        return true;
      }
      if (item?.children && item?.children?.length > 0) {
        const found = recursiveSearch(item.children);
        if (found) return true;
      }
    }
    return false;
  };
  recursiveSearch(sourceArray);
  return sourceArray;
};

export const findItem = (items: INavItem[], itemId: UniqueIdentifier): INavItem => {
  const item = items.find(({ id }) => id === itemId);
  if (!item) throw new Error(`Item with id ${itemId} not found`);
  return item;
};

export const updateOrderAndLevel = (items: INavItem[], currentLevel: number = 0): INavItem[] => {
  return items.map((item, index) => {
    const updatedItem: INavItem = {
      ...item,
      order: index,
      level: currentLevel,
      children: item.children ? updateOrderAndLevel(item.children, currentLevel + 1) : [],
    };
    return updatedItem;
  });
};

export const flattenTreeIterativeWithImmer = produce((draft: IFlattenedItem[], items: INavItem[]) => {
  const stack: Array<{ node: INavItem; parentId: string | number | null; level: number; order: number }> =
    items?.map((node, index) => ({
      node,
      parentId: null,
      level: 0,
      order: index,
    })) ?? [];

  const visited = new Set<string | number>(); // Track visited nodes for circular reference detection

  while (stack.length > 0) {
    const { node, parentId, level, order } = stack.shift()!;
    if (visited.has(node.id)) {
      throw new Error('Circular reference detected');
    }
    visited.add(node.id);

    draft.push({
      ...node,
      parentId,
      level,
      order,
    });

    if (node.children?.length) {
      stack.unshift(
        ...(node?.children?.map((child, index) => ({
          node: child,
          parentId: node.id,
          level: level + 1,
          order: index,
        })) ?? [])
      );
    }
  }
});

export const flattenTreeMemoized = memoize(flattenTreeIterativeWithImmer);

export const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
  };
};
