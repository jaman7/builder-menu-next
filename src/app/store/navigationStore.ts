import { create } from 'zustand';
import { addItem, deleteItem, findMaxId, updateItem } from '../shared/helpers/tree';

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
  resetState: () => void;
}

export const initialState: Partial<NavigationStore> = {
  navigation: [],
  dragState: { activeId: null, overId: null, offsetLeft: null },
  openCollapseMap: {},
};

const useNavigationStore = create<NavigationStore>((set, get) => ({
  navigation: [],
  dragState: { activeId: null, overId: null, offsetLeft: null },
  openCollapseMap: {},
  resetState: () =>
    set(() => {
      return { ...initialState };
    }),
  setNavigation: (items: INavItem[]) =>
    set(() => {
      return { navigation: items };
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
      return { navigation: updatedNavigation };
    }),
  updateNavItem: (id, updatedItem) =>
    set((state) => {
      const itemExists = state.navigation.some((item) => item.id === id);
      if (!itemExists) return state;

      const nav = updateItem(state.navigation, id, updatedItem);
      return { navigation: nav };
    }),
  deleteNavItem: (id) =>
    set((state) => {
      const nav = deleteItem(state.navigation, id);
      return { navigation: nav };
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
