import React from 'react';

const MenuContent = React.forwardRef<
  HTMLDivElement,
  { children: JSX.Element[] | JSX.Element }
>(({ children }, ref) => {
  return (
    <div
      className="bg-white shadow-lg rounded-md absolute right-0 top-14 z-50 w-72 flex flex-col overflow-hidden"
      ref={ref}
    >
      {children}
    </div>
  );
});

MenuContent.displayName = 'MenuContent';
export default MenuContent;
