import React from 'react';

const ProfileMenuItem = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="group hover:bg-primary/20 cursor-pointer">{children}</div>
  );
};

export default ProfileMenuItem;
