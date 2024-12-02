import { create } from 'zustand';
import { addItem, deleteItem, findMaxId, flattenTree, updateItem } from '@/shared/helpers/tree';
import { IFlattenedItem } from '../components/builder-menu/MenuEditor.model';

export interface INavItem {
  id: string | number;
  label?: string;
  url?: string;
  parentId?: string | number | null;
  level?: number | null;
  order?: number | null;
  collapsed?: boolean;
  children?: INavItem[];
}

export type INavItemType = INavItem[];

export interface DragState {
  activeId: string | number | null;
  overId: string | number | null;
  offsetLeft: number | null;
}

interface NavigationStore {
  navigation: INavItem[];
  flattenedNavigation: IFlattenedItem[];
  dragState: DragState;
  openCollapseMap: Record<string | number, boolean>;
  setNavigation: (items: INavItem[]) => void;
  addNavItem: (item: Omit<INavItem, 'id'>, parentId?: string | number | null) => void;
  updateNavItem: (id: string | number | null, updatedItem: Omit<INavItem, 'id'>) => void;
  deleteNavItem: (id: string | number | null) => void;
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
  toggleCollapse: (id: string | number) => void;
  isCollapseOpen: (id: string | number) => boolean;
}

const useNavigationStore = create<NavigationStore>((set, get) => ({
  navigation: [],
  flattenedNavigation: [],
  dragState: { activeId: null, overId: null, offsetLeft: null },
  openCollapseMap: {},
  setNavigation: (items: INavItem[]) =>
    set(() => {
      const flattened = flattenTree(items);
      return { navigation: items, flattenedNavigation: flattened };
    }),
  addNavItem: (item, parentId = null) =>
    set((state) => {
      const newId = typeof state?.navigation?.[0]?.id === 'string' ? Date.now().toString() : findMaxId(state?.navigation) + 1;
      const newItem: INavItem = {
        id: newId,
        label: item.label ?? '',
        url: item?.url ?? '',
        parentId: parentId ?? null,
        level: 0,
        order: 0,
        children: [],
      };
      const updatedNavigation = addItem(state?.navigation, newItem, parentId);
      return { navigation: updatedNavigation, flattenedNavigation: flattenTree(updatedNavigation) };
    }),
  updateNavItem: (id, updatedItem) =>
    set((state) => {
      const nav = updateItem(state.navigation, id, updatedItem);
      return { navigation: nav, flattenedNavigation: flattenTree(nav) };
    }),
  deleteNavItem: (id) =>
    set((state) => {
      const nav = deleteItem(state.navigation, id);
      return { navigation: nav, flattenedNavigation: flattenTree(nav) };
    }),
  setDragState: (state: Partial<DragState>) =>
    set((current) => ({
      dragState: { ...current.dragState, ...state },
    })),
  resetDragState: () =>
    set(() => ({
      dragState: { activeId: null, overId: null, offsetLeft: null },
    })),
  toggleCollapse: (id: string | number) =>
    set((state) => ({
      openCollapseMap: {
        ...state.openCollapseMap,
        [id]: !state.openCollapseMap[id],
      },
    })),
  isCollapseOpen: (id: string | number) => get().openCollapseMap[id] || false,
}));

export default useNavigationStore;
