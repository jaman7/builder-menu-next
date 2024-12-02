import { INavItem } from '@/store/navigationStore';
import { traverseTree } from './utils';

export const addItem = (items: INavItem[], newItem: INavItem, parentId: string | number | null): INavItem[] => {
  const clone = [...items];

  if (parentId !== null) {
    const parent = traverseTree(clone, (node) => node.id === parentId);
    if (!parent) {
      throw new Error(`Parent with id ${parentId} does not exist.`);
    }
    parent.children = [...(parent.children || []), { ...newItem, level: (parent.level || 0) + 1, order: parent.children?.length || 0 }];
    return clone;
  }

  return [...clone, { ...newItem, level: 0, order: clone.length }];
};

export const deleteItem = (items: INavItem[], id: string | number | null): INavItem[] => {
  if (!id) return items;
  return (
    items
      ?.filter((item) => item.id !== id)
      ?.map((item) => ({
        ...item,
        children: deleteItem(item?.children || [], id),
      })) ?? []
  );
};

export const updateItem = (items: INavItem[], id: string | number | null, updatedFields: Partial<Omit<INavItem, 'id'>>): INavItem[] => {
  return (
    items?.map((item) => {
      if (item?.id === id) {
        return {
          ...item,
          ...updatedFields,
        };
      }
      return {
        ...item,
        children: updateItem(item?.children || [], id, updatedFields),
      };
    }) ?? []
  );
};
