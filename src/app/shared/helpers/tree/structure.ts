import { INavItem } from '@/src/app/store/navigationStore';
import { IFlattenedItem } from '@/src/app/components/builder-menu/MenuEditor.model';
import { Modifier, UniqueIdentifier } from '@dnd-kit/core';
import { groupByParent } from './utils';

export const buildTree = (items: INavItem[]): INavItem[] => {
  const groupedItems = groupByParent(items);

  const build = (parentId: string | number | null): INavItem[] =>
    (groupedItems.get(parentId) || [])?.map((item) => ({
      ...item,
      children: build(item.id),
    })) ?? [];

  return build(null);
};

export const buildTreeFromFlatten = (flattenedItems: IFlattenedItem[]): INavItem[] => {
  const root: INavItem = { id: 'root', children: [], label: 'root' };
  const nodes: Record<string, INavItem> = { [root.id]: root };
  const items = flattenedItems?.map((item) => ({ ...item, children: [] })) ?? [];
  for (const item of items) {
    const { id, children, label } = item;
    const parentId = item?.parentId ?? root?.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);
    if (!parent) {
      throw new Error(`Parent with id ${parentId} not found`);
    }
    if (!parent.children) {
      parent.children = [];
    }
    nodes[id] = { id, children, label };
    parent.children.push(item);
  }
  return root.children ?? [];
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

export const flattenTree = (items: INavItem[]): IFlattenedItem[] => {
  const result: IFlattenedItem[] = [];
  const traverse = (nodes: INavItem[], parentId: string | number | null = null, level = 0): void => {
    nodes?.forEach((node, index) => {
      result.push({
        ...node,
        id: node.id,
        label: node.label,
        parentId: parentId,
        level: level,
        order: index,
      });
      if (node.children?.length) traverse(node.children, node.id, level + 1);
    });
  };
  traverse(items);
  return result;
};

export const removeChildrenOf = (items: IFlattenedItem[], ids: (string | number)[]): IFlattenedItem[] => {
  const excludeParentIds = [...ids];
  return items?.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      return false;
    }
    return true;
  });
};

export const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
  };
};
