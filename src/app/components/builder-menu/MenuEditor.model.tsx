import { INavItem } from '@/store/navigationStore';

export interface IFlattenedItem extends INavItem {
  parentId: number | string | null;
  order: number;
  level: number;
}

export interface IProjected {
  level?: number;
  maxDepth?: number;
  minDepth?: number;
  parentId?: number | string | null;
  ariaDropEffect?: string;
}
