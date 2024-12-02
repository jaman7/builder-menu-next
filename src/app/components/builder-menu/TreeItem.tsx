import React, { Suspense } from 'react';
import { forwardRef, HTMLAttributes, useState } from 'react';
import useNavigationStore, { INavItem } from '@/store/navigationStore';
import classNames from 'classnames';
import MenuItem from './MenuItem/MenuItem';
import Collapse from '@/shared/components/Collapse';
import MenuForm from './MenuForm';
const RecursiveItem = React.lazy(() => import('./RecursiveItem'));
import './TreeItem.scss';

export interface IProps extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  id: string | number;
  item?: INavItem;
  navChildren?: INavItem[];
  childCount?: number;
  clone?: boolean;
  depth?: number;
  disableInteraction?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  value?: string | number;
  show?: string;
  indentationWidth?: number;
  onEdit?: () => void;
  onAddNew?: (parentId?: string | number | null) => void;
  onCollapse?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

const TreeItem = forwardRef<HTMLDivElement, IProps>(
  (
    {
      id,
      item,
      navChildren,
      childCount,
      clone,
      depth,
      indentationWidth,
      disableInteraction,
      ghost,
      handleProps,
      indicator,
      onCollapse,
      onAddNew,
      onEdit,
      style,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    const [parentId, setParentId] = useState<string | number | null>(null);
    const { toggleCollapse, isCollapseOpen, deleteNavItem } = useNavigationStore(); // Globalny stan
    const openCollapse = isCollapseOpen(id);

    const calcIndentationWidth = (level: number | null) => (indentationWidth || 0) * (level || 0);

    const ItemStyle = {
      ...(!clone
        ? {
            paddingLeft: `${calcIndentationWidth(depth as number)}px`,
          }
        : {}),
    } as React.CSSProperties;

    const threeStyle = {
      ...style,
      height:
        (ghost && indicator) || (ghost && indicator && childCount && childCount - 1 > 0)
          ? `${(childCount as number) * 76 + ((childCount as number) - 1) * 3}px`
          : 'auto',
    } as React.CSSProperties;

    const styleLielement = classNames('flex justify-between w-full', {
      'menu-item': true,
      clone,
      ghost,
      indicator,
      disableInteraction,
    });

    const handleToggleCollapse = () => {
      toggleCollapse(id);
    };

    const onHandleEdit = (): void => {
      setParentId?.(null);
      handleToggleCollapse();
    };

    const onHandleDelete = (): void => {
      deleteNavItem(id);
    };

    const onHandleAddNew = (parentId?: string | number | null): void => {
      setParentId?.(parentId ?? null);
      handleToggleCollapse();
    };

    const onHandleCancel = (): void => {
      handleToggleCollapse();
      setParentId?.(null);
    };

    const onSubmitCloseForm = (): void => {
      handleToggleCollapse();
      setParentId?.(null);
    };

    const paddingEditCollapse = () => (parentId ? { paddingLeft: calcIndentationWidth(1) } : {});

    return (
      <li className={styleLielement} ref={wrapperRef} style={ItemStyle} {...props}>
        <div {...handleProps} className="item-detail w-full cursor-default" ref={ref} style={threeStyle}>
          <MenuItem onEdit={onHandleEdit} onDelete={onHandleDelete} onAddNew={(id) => onHandleAddNew(id)} item={item} id={id} />

          {clone && childCount && childCount > 1 ? (
            <div className={'children-clone-list'} style={{ overflow: 'hidden' }}>
              <Suspense fallback={<div>Ładowanie...</div>}>
                {navChildren &&
                  navChildren?.map((child: any) => {
                    return <RecursiveItem key={`${child.id}-clone`} item={child} nDepth={1} />;
                  })}
              </Suspense>
            </div>
          ) : null}

          <Collapse isOpen={openCollapse} padding={paddingEditCollapse()}>
            <MenuForm
              data={openCollapse && !parentId ? item : null}
              parentId={parentId && openCollapse ? parentId : null}
              onSubmit={() => onSubmitCloseForm()}
              onCancel={onHandleCancel}
            />
          </Collapse>
        </div>
      </li>
    );
  }
);

export default React.memo(TreeItem);
