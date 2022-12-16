import React from 'react';

const ProfileMenuItem = ({ children }: { children: JSX.Element }) => {
  return <div className="hover:bg-slate-200 cursor-pointer">{children}</div>;
};

export default ProfileMenuItem;
