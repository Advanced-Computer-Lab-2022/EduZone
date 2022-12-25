import React from 'react';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { RiMenuFoldFill, RiMenuUnfoldFill } from 'react-icons/ri';
import { SidebarHeaderProps } from '../../../../types';

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isOpen,
  handleClose,
  handleOpen,
}) => {
  return (
    <div
      className={`${
        isOpen ? 'justify-between' : 'flex-col gap-4 '
      } min-h-[3.5rem] flex items-center justify-center  text-white border-b border-white`}
    >
      {isOpen && (
        // <svg height="30" width="30" className="fill-white border border-white">
        //   <circle cx="30" cy="30" r="20" />
        // </svg>
        <p className="uppercase text-xl font-medium font-sans py-1 pl-4 pr-2">
          Eduzone
        </p>
      )}
      <div
        className="p-4 cursor-pointer "
        onClick={() => (isOpen ? handleClose() : handleOpen())}
      >
        {isOpen ? <RiMenuFoldFill size={20} /> : <RiMenuUnfoldFill size={20} />}
      </div>
    </div>
  );
};

export default SidebarHeader;
