import React from 'react';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { RiMenuFoldFill, RiMenuUnfoldFill } from 'react-icons/ri';
import { SidebarHeaderProps } from '../../../../types';

const InstructorSidebarHeader: React.FC<SidebarHeaderProps> = ({
  isOpen,
  handleClose,
  handleOpen,
}) => {
  return (
    <div
      className={`${
        isOpen ? 'justify-between' : 'flex-col gap-4 py-2'
      } min-h-[3.5rem] flex items-center justify-center  py-1 pl-4 pr-2 text-white`}
    >
      {isOpen && (
        <svg height="30" width="30" className="fill-white border border-white">
          <circle cx="30" cy="30" r="20" />
        </svg>
      )}
      <div className="p-2 cursor-pointer">
        {isOpen ? (
          <RiMenuFoldFill size={20} onClick={() => handleClose()} />
        ) : (
          <RiMenuUnfoldFill size={20} onClick={() => handleOpen()} />
        )}
      </div>
    </div>
  );
};

export default InstructorSidebarHeader;
