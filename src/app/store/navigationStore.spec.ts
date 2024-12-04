import { act } from '@testing-library/react';
import useNavigationStore, { INavItem } from './navigationStore';

describe('Navigation Store', () => {
  beforeEach(() => {
    useNavigationStore.setState({
      navigation: [],
      dragState: { activeId: null, overId: null, offsetLeft: null },
      openCollapseMap: {},
    });
  });

  it('should initialize with default values', () => {
    const store = useNavigationStore.getState();
    expect(store.navigation).toEqual([]);
  });

  it('should set navigation items', () => {
    const navItems: INavItem[] = [{ id: 1, label: 'Test', parentId: null }];

    act(() => {
      useNavigationStore.getState().setNavigation(navItems);
    });

    const store = useNavigationStore.getState();
    expect(store.navigation).toEqual(navItems);
  });

  it('should add a new navigation item', () => {
    act(() => {
      useNavigationStore.getState().addNavItem({ label: 'New Item', url: '/test' });
    });

    const store = useNavigationStore.getState();
    expect(store.navigation).toHaveLength(1);
    expect(store.navigation[0]).toMatchObject({
      label: 'New Item',
      url: '/test',
      parentId: null,
    });
  });

  it('should toggle collapse state', () => {
    act(() => {
      useNavigationStore.getState().toggleCollapse(1);
    });

    let store = useNavigationStore.getState();
    expect(store.isCollapseOpen(1)).toBeTruthy();

    act(() => {
      useNavigationStore.getState().toggleCollapse(1);
    });

    store = useNavigationStore.getState();
    expect(store.isCollapseOpen(1)).toBeFalsy();
  });

  it('should update an existing navigation item', () => {
    const initialItems: INavItem[] = [{ id: 1, label: 'Old Label', parentId: null }];
    act(() => {
      useNavigationStore.getState().setNavigation(initialItems);
    });

    act(() => {
      useNavigationStore.getState().updateNavItem(1, { label: 'Updated Label' });
    });

    const store = useNavigationStore.getState();
    expect(store.navigation[0]).toMatchObject({ id: 1, label: 'Updated Label' });
  });

  it('should not update a non-existent navigation item', () => {
    act(() => {
      useNavigationStore.getState().setNavigation([]);
    });

    act(() => {
      useNavigationStore.getState().updateNavItem(999, { label: 'Invalid Update' });
    });

    const store = useNavigationStore.getState();
    expect(store.navigation).toHaveLength(0); // Ensure no item was added or modified
  });

  it('should delete an existing navigation item', () => {
    const initialItems: INavItem[] = [{ id: 1, label: 'To Delete', parentId: null }];
    act(() => {
      useNavigationStore.getState().setNavigation(initialItems);
    });

    act(() => {
      useNavigationStore.getState().deleteNavItem(1);
    });

    const store = useNavigationStore.getState();
    expect(store.navigation).toHaveLength(0);
  });

  it('should handle deletion of a non-existent item gracefully', () => {
    act(() => {
      useNavigationStore.getState().setNavigation([]);
    });

    act(() => {
      useNavigationStore.getState().deleteNavItem(999);
    });

    const store = useNavigationStore.getState();
    expect(store.navigation).toEqual([]);
  });

  it('should set the drag state', () => {
    const dragState = { activeId: 1, overId: 2, offsetLeft: 50 };

    act(() => {
      useNavigationStore.getState().setDragState(dragState);
    });

    const store = useNavigationStore.getState();
    expect(store.dragState).toEqual(dragState);
  });

  it('should reset the drag state', () => {
    const initialDragState = { activeId: 1, overId: 2, offsetLeft: 50 };

    act(() => {
      useNavigationStore.getState().setDragState(initialDragState);
    });

    act(() => {
      useNavigationStore.getState().resetDragState();
    });

    const store = useNavigationStore.getState();
    expect(store.dragState).toEqual({ activeId: null, overId: null, offsetLeft: null });
  });

  it('should toggle the collapse state for an item', () => {
    act(() => {
      useNavigationStore.getState().toggleCollapse(1);
    });

    const store = useNavigationStore.getState();
    expect(store.isCollapseOpen(1)).toBeTruthy();

    act(() => {
      useNavigationStore.getState().toggleCollapse(1);
    });

    expect(store.isCollapseOpen(1)).toBeFalsy();
  });

  it('should reset the state to its initial values', () => {
    act(() => {
      useNavigationStore.getState().setNavigation([{ id: 1, label: 'Test', parentId: null }]);
      useNavigationStore.getState().setDragState({ activeId: 1, overId: 2, offsetLeft: 50 });
      useNavigationStore.getState().toggleCollapse(1);
    });

    act(() => {
      useNavigationStore.getState().resetState();
    });

    const store = useNavigationStore.getState();
    expect(store.navigation).toEqual([]);
    expect(store.dragState).toEqual({ activeId: null, overId: null, offsetLeft: null });
    expect(store.openCollapseMap).toEqual({});
  });

  it('should delete a node along with its children', () => {
    const items = [
      {
        id: 1,
        label: 'Root',
        parentId: null,
        children: [{ id: 2, label: 'Child', parentId: 1, children: [] }],
      },
    ];

    act(() => {
      useNavigationStore.getState().setNavigation(items);
      useNavigationStore.getState().deleteNavItem(1);
    });

    const state = useNavigationStore.getState();
    expect(state.navigation).toHaveLength(0);
  });

  it('should toggle collapse state for nested nodes', () => {
    act(() => {
      useNavigationStore.getState().toggleCollapse(1);
    });
    expect(useNavigationStore.getState().isCollapseOpen(1)).toBeTruthy();
    act(() => {
      useNavigationStore.getState().toggleCollapse(1);
    });
    expect(useNavigationStore.getState().isCollapseOpen(1)).toBeFalsy();
  });

  it('should add a node as a child at a specific level', () => {
    const items = [{ id: 1, label: 'Root', parentId: null, children: [] }];

    act(() => {
      useNavigationStore.getState().setNavigation(items);
      useNavigationStore.getState().addNavItem({ label: 'Child' }, 1);
    });

    const state = useNavigationStore.getState();
    expect(state.navigation[0].children).toHaveLength(1);
    expect(state.navigation[0].children?.[0]).toMatchObject({ label: 'Child', parentId: 1 });
  });
});
