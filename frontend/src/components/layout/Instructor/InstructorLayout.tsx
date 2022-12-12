import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import InstructorNavbar from './Navbar/InstructorNavbar';
import InstructorSidebar from './Sidebar/InstructorSidebar';

const InstructorLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSideBarWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(500);

  const { user } = useSelector((state: RootState) => state.auth);

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <div></div>,
      link: `/instructor/${user.id}`,
    },
    {
      name: 'Courses',
      icon: <div></div>,
      link: `/instructor/${user.id}/courses`,
    },
    {
      name: 'Profile',
      icon: <div></div>,
      link: `/instructor/${user.id}/profile`,
    },
  ];

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  return (
    <Fragment>
      <div className="flex">
        <InstructorSidebar
          setWidth={(s: any) => setSideBarWidth(s)}
          isOpen={sidebarOpen}
          handleClose={() => setSidebarOpen(false)}
          handleOpen={() => setSidebarOpen(true)}
          items={sidebarItems}
        />
        <div
          className={``}
          style={{
            marginLeft: sidebarWidth,
            width: windowWidth - sidebarWidth,
          }}
        >
          <InstructorNavbar
            windowWidth={windowWidth}
            sidebarWidth={sidebarWidth}
          />
          <div
            className="p-5 bg-zinc-100 min-h-screen pt-20 w-full"
            // style={{
            //   width: windowWidth - sidebarWidth,
            // }}
          >
            {children}
          </div>
        </div>
      </div>
    </Fragment>
    // <div>
    //   <div className="h-14"></div>
    //   <div className="bg-gray-100 min-h-screen pt-16">
    //     <div className="mx-auto md:max-w-5xl xl:max-w-7xl px-6">{children}</div>
    //   </div>
    // </div>
  );
};

export default InstructorLayout;
