import { INavItem } from '@/src/app/store/navigationStore';
import { IFlattenedItem } from '@/src/app/components/builder-menu/MenuEditor.model';
import { Modifier, UniqueIdentifier } from '@dnd-kit/core';

export const buildTreeFromFlatten = (flattenedItems: IFlattenedItem[]): INavItem[] => {
  const root: INavItem = { id: 'root', children: [], label: 'root' };
  const nodes: Record<string, INavItem> = { [root.id]: root };
  const items = flattenedItems?.map((item) => ({ ...item, children: [] })) ?? [];
  for (const item of items) {
    const { id, children, label } = item || {};
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

export const buildTreeFromFlattenIteratively = (flattenedItems: IFlattenedItem[]): INavItem[] => {
  const map = new Map<string | number, IFlattenedItem>();
  const root: IFlattenedItem[] = [];
  const idSet = new Set<string | number>();

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
      throw new Error(`Parent with parentId ${parentId} not found for id ${id}`);
    }
    map.set(id, newItem);
  });

  return root;
};

export const findItem = (items: INavItem[], itemId: UniqueIdentifier): INavItem => {
  const item = items?.find(({ id }) => id === itemId);
  if (!item) throw new Error(`Item with id ${itemId} not found`);
  return item;
};

export const updateOrderAndLevel = (items: INavItem[], currentLevel: number = 0): INavItem[] => {
  return (
    items?.map((item, index) => {
      const updatedItem: INavItem = {
        ...item,
        order: index,
        level: currentLevel,
        children: item.children ? updateOrderAndLevel(item.children, currentLevel + 1) : [],
      };
      return updatedItem;
    }) ?? []
  );
};

export const flatten = (items: INavItem[], parentId: string | number | null = null, level = 0): IFlattenedItem[] => {
  return (
    items?.reduce<IFlattenedItem[]>((acc, item, index) => {
      const children = item.children ?? [];
      return [...acc, { ...item, parentId, level, order: index }, ...flatten(children, item.id, level + 1)];
    }, []) ?? []
  );
};

export const flattenTree = (items: INavItem[]): IFlattenedItem[] => {
  return flatten(items);
};

export const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
  };
};
