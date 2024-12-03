import { INavItem } from '@/store/navigationStore';
import { traverseTreeIteratively } from './utils';
import { produce } from 'immer';

export const addItem = (items: INavItem[], newItem: INavItem, parentId: string | number | null): INavItem[] => {
  return produce(items, (draft) => {
    if (parentId !== null) {
      const parent = traverseTreeIteratively(draft, (node) => node.id === parentId);
      if (!parent) {
        throw new Error(`Parent with id ${parentId} does not exist.`);
      }
      parent.children = [...(parent.children || []), { ...newItem, level: (parent?.level || 0) + 1, order: parent?.children?.length || 0 }];
    } else {
      draft.push({ ...newItem, level: 0, order: draft.length });
    }
  });
};

export const deleteItem = (items: INavItem[], id: string | number | null): INavItem[] => {
  return produce(items, (draft) => {
    const recursiveDelete = (nodes: INavItem[]): INavItem[] => {
      return nodes.filter((node) => {
        if (node.id === id) return false;
        if (node.children?.length) {
          node.children = recursiveDelete(node.children);
        }
        return true;
      });
    };
    draft.splice(0, draft.length, ...recursiveDelete(draft));
  });
};

export const updateItem = produce((draft: INavItem[], id: string | number | null, updatedFields: Partial<Omit<INavItem, 'id'>>) => {
  const stack = [...draft];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node?.id === id) {
      Object.assign(node, updatedFields);
      break;
    }
    if (node?.children?.length) stack.push(...node.children);
  }
});
