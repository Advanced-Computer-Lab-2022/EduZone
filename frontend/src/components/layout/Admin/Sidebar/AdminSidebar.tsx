import React, { useEffect, useState } from 'react';
import { SidebarProps } from '../../../../types';
import AdminSidebarHeader from './AdminSidebarHeader';
const AdminSidebar: React.FC<SidebarProps> = ({
  isOpen,
  handleClose,
  handleOpen,
  setWidth,
}) => {
  // get component width by ref

  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // component width
    if (ref.current) {
      const width = ref.current.offsetWidth;
      setWidth(width);
    }
  }, [setWidth]);
  return (
    <div
      className=" h-screen fixed border-r flex transition ease-in-out duration-300"
      ref={ref}
    >
      <div
        className={`${
          isOpen ? 'min-w-[12rem] w-fit' : 'w-[4rem]'
        } h-full  border-r bg-red-800  duration-700 ease-in-out `}
      >
        <AdminSidebarHeader
          isOpen={isOpen}
          handleClose={handleClose}
          handleOpen={handleOpen}
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
