import React, { Fragment, useEffect, useState } from 'react';
import AdminNavbar from './Navbar/AdminNavbar';
import AdminSidebar from './Sidebar/AdminSidebar';

const AdminLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSideBarWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(500);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  return (
    <Fragment>
      <div className="flex">
        <AdminSidebar
          setWidth={(s: any) => setSideBarWidth(s)}
          isOpen={sidebarOpen}
          handleClose={() => setSidebarOpen(false)}
          handleOpen={() => setSidebarOpen(true)}
        />
        <div
          className={``}
          style={{
            marginLeft: sidebarWidth,
            width: windowWidth - sidebarWidth,
          }}
        >
          <AdminNavbar windowWidth={windowWidth} sidebarWidth={sidebarWidth} />
          <div className="p-5 bg-zinc-100 min-h-screen pt-20 w-full px-16">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminLayout;
