import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarProps } from '../../../../types';
import InstructorSidebarHeader from './InstructorSidebarHeader';
const InstructorSidebar: React.FC<SidebarProps> = ({
  isOpen,
  handleClose,
  handleOpen,
  setWidth,
  items,
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
          isOpen ? 'min-w-[15rem] w-fit' : 'w-[4rem]'
        } h-full  border-r bg-primary  duration-700 ease-in-out `}
      >
        <InstructorSidebarHeader
          isOpen={isOpen}
          handleClose={handleClose}
          handleOpen={handleOpen}
        />

        <div className="flex flex-col py-2">
          {items?.map((item, index) => (
            <Link
              key={index}
              className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-white/30"
              to={item.link}
            >
              <div className="text-white text-center ml-1">{item.icon}</div>
              {isOpen && <div className="text-white">{item.name}</div>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorSidebar;
