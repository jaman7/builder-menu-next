import { IFlattenedItem, IProjected } from '@/src/app/components/builder-menu/MenuEditor.model';
import { INavItem } from '@/src/app/store/navigationStore';
import { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { traverseTreeIteratively } from './utils';

export const getDragDepth = (offset: number, indentationWidth: number): number => {
  return Math.round(offset / indentationWidth);
};

export const getMaxDepth = ({ previousItem }: { previousItem: IFlattenedItem }): number => {
  return previousItem ? previousItem.level + 1 : 0;
};

export const getMinDepth = ({ nextItem }: { nextItem: IFlattenedItem }): number => {
  return nextItem ? nextItem.level : 0;
};

const countChildrenhelper = (items: INavItem[], count = 0): number => {
  return items.reduce((acc, { children }) => {
    if (children?.length) return countChildrenhelper(children, acc + 1);
    return acc + 1;
  }, count);
};

export const childrenCount = (items: INavItem[], id: UniqueIdentifier | null): number => {
  const item = findItemDeep(items, id!);
  return item ? countChildrenhelper(item?.children ?? []) : 0;
};

export const childrensItems = (items: INavItem[], id: UniqueIdentifier): INavItem[] => {
  return findItemDeep(items, id)?.children ?? [];
};

export const findItemDeep = (items: INavItem[], id: string | number): INavItem | undefined =>
  traverseTreeIteratively(items, (item) => item.id === id);

export const findMaxId = (items: INavItem[]): number => {
  let maxId = 0;
  items.forEach((item) => {
    if (typeof item.id === 'number') maxId = Math.max(maxId, item?.id);
    if (item?.children && item?.children?.length) maxId = Math.max(maxId, findMaxId(item?.children));
  });
  return maxId;
};

export const findParentById = (items: INavItem[], childId: string | number): INavItem | undefined => {
  for (const item of items) {
    if (item.children?.some((child) => child.id === childId)) {
      return item;
    }
    if (item.children) {
      const found = findParentById(item.children, childId);
      if (found) return found;
    }
  }
  return undefined;
};

export const levelProjection = (
  items: IFlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
): IProjected => {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragLevel = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.level + dragLevel;
  const maxDepth = getMaxDepth({
    previousItem,
  });

  const minDepth = getMinDepth({ nextItem });
  let level = projectedDepth;
  if (projectedDepth >= maxDepth) {
    level = maxDepth;
  } else if (projectedDepth < minDepth) {
    level = minDepth;
  }

  const getParentId = (): string | number | null => {
    if (level === 0 || !previousItem) return null;
    if (level === previousItem.level) return previousItem.parentId;
    if (level > previousItem.level) return previousItem.id;

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.level === level)?.parentId;
    return newParent ?? null;
  };
  return { level, maxDepth, minDepth, parentId: getParentId(), ariaDropEffect: 'move' };
};
