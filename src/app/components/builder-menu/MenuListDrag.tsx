import React from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useMemo } from 'react';
import useNavigationStore from '@/store/navigationStore';
import { dropAnimationConfig, indentationWidth, measuring } from './MenuEditor.const';
import { createPortal } from 'react-dom';
import {
  adjustTranslate,
  buildTreeFromFlatten,
  childrenCount,
  childrensItems,
  flattenTree,
  levelProjection,
  updateOrderAndLevel,
} from '@/shared/helpers/tree';
import TreeItem from './TreeItem';

interface IProps {
  style?: 'bordered' | 'shadow';
}

const MenuListDrag: React.FC<IProps> = ({ style }) => {
  const { navigation, setDragState, resetDragState, setNavigation } = useNavigationStore();
  const { activeId, overId, offsetLeft } = useNavigationStore((state) => state.dragState);

  const flattenedMenu = useMemo(() => flattenTree(navigation), [navigation]);

  const activeItem = useMemo(() => (activeId ? flattenedMenu?.find(({ id }) => id === activeId) : null), [activeId, flattenedMenu]);

  const projected = useMemo(() => {
    if (!activeId || !overId) return null;
    return levelProjection(flattenedMenu, activeId, overId, offsetLeft ?? 0, indentationWidth);
  }, [activeId, overId, offsetLeft, flattenedMenu]);

  const sortedIds = useMemo(() => flattenedMenu?.map(({ id }) => id) ?? [], [flattenedMenu]) ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const resetState = useCallback((): void => {
    resetDragState();
    document.body.style.setProperty('cursor', '');
  }, [resetDragState]);

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const isDragIcon = document.querySelector('.drag-handle');
      if (!isDragIcon) return;
      setDragState({ activeId: active.id, overId: active.id });
      document.body.style.cursor = 'grabbing';
    },
    [setDragState]
  );

  const handleDragMove = useCallback(
    ({ delta }: DragMoveEvent) => {
      setDragState({ offsetLeft: delta.x });
    },
    [setDragState]
  );

  const handleDragOver = useCallback(
    ({ over }: DragOverEvent) => {
      setDragState({ overId: over?.id ?? null });
    },
    [setDragState]
  );

  const handleDragCancel = (): void => {
    resetState();
  };

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent): void => {
      if (!projected || !over) {
        resetState();
        return;
      }

      const { level, parentId } = projected;
      const clonedItems = [...flattenedMenu];
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      if (activeIndex < 0 || overIndex < 0) {
        resetState();
        return;
      }
      const activeTreeItem = clonedItems[activeIndex];
      clonedItems[activeIndex] = { ...activeTreeItem, level: level ?? 0, parentId: parentId ?? null };
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTreeFromFlatten(sortedItems);
      setNavigation(updateOrderAndLevel(newItems));
      resetDragState();

      resetState();
    },
    [projected, flattenedMenu, resetDragState, resetState, setNavigation]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Picked up item ${active.id}.`,
          onDragOver: ({ active, over }) =>
            over ? `Dragging item ${active.id} over ${over.id}.` : `Dragging item ${active.id} with no valid drop target.`,
          onDragEnd: ({ active, over }) => `Dropped item ${active.id} ${over ? `on ${over.id}` : ''}.`,
          onDragCancel: ({ active }) => `Canceled dragging item ${active.id}.`,
        },
      }}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <ul className="bg-secondary flex flex-col rounded-lg">
          {flattenedMenu &&
            flattenedMenu?.map((item) => (
              <TreeItem
                key={item.id}
                id={item.id}
                value={item.id?.toString()}
                item={item}
                show={activeId && activeItem ? true.toString() : false.toString()}
                indentationWidth={indentationWidth}
                depth={item.id === activeId && projected ? projected.level : item.level}
                indicator={style === 'bordered'}
                childCount={childrenCount(navigation ?? [], activeId) + 1}
              />
            ))}

          {createPortal(
            <DragOverlay
              dropAnimation={dropAnimationConfig}
              modifiers={style === 'bordered' ? [adjustTranslate] : undefined}
              style={{ overflow: 'hidden' }}
            >
              {activeId && activeItem?.id === activeId ? (
                <TreeItem
                  id={activeId}
                  depth={activeItem?.level > 0 ? 0 : activeItem?.level}
                  item={flattenedMenu?.find((el) => el.id === activeId)}
                  clone={activeId !== null && childrenCount(flattenedMenu ?? [], activeId) > 0}
                  childCount={childrenCount(navigation ?? [], activeId) + 1}
                  value={activeId?.toString()}
                  indentationWidth={indentationWidth}
                  navChildren={childrensItems(navigation, activeId)}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default MenuListDrag;
