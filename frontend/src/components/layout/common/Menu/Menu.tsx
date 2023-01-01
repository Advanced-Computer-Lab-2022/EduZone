import React, { useRef, useState } from 'react';
import useOutsideClickHandler from '../../../../hooks/useOutsideClickHandler';
import MenuContent from './MenuContent';

const Menu: React.FC<{
  children: JSX.Element | JSX.Element[];
  action: JSX.Element;
}> = ({ children, action }) => {
  const [openMenu, setOpenMenu] = useState({ open: false, type: '' } as {
    open: boolean;
    type: 'hover' | 'click' | '';
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  useOutsideClickHandler(
    menuRef,
    () => setOpenMenu({ open: false, type: '' }),
    actionRef
  );
  return (
    <div className="relative">
      <div
        onClick={() =>
          setOpenMenu((state) => ({ open: !state.open, type: 'click' }))
        }
        className="cursor-pointer"
        ref={actionRef}
      >
        {action}
      </div>
      {openMenu.open && <MenuContent ref={menuRef}>{children}</MenuContent>}
    </div>
  );
};

export default Menu;
