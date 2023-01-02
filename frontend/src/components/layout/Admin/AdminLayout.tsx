import React, { Fragment, useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { HiReceiptRefund } from 'react-icons/hi';
import {
  MdSpaceDashboard,
  MdOndemandVideo,
  MdPerson,
  MdRemoveRedEye,
  MdReportProblem,
  MdOutlineReport,
  MdReport,
} from 'react-icons/md';
import { TbLockAccess } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import AdminNavbar from './Navbar/AdminNavbar';
import AdminSidebar from './Sidebar/AdminSidebar';

const AdminLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <MdSpaceDashboard size={25} />,
      link: `/admin`,
    },
    {
      name: 'Users',
      icon: <FaUsers size={25} />,
      link: `/admin/users`,
    },
    {
      name: 'Courses',
      icon: <MdOndemandVideo size={25} />,
      link: `/admin/courses`,
    },
    {
      name: 'Access Requests',
      icon: <TbLockAccess size={25} />,
      link: `/admin/access-requests`,
    },
    {
      name: 'Refund Requests',
      icon: <HiReceiptRefund size={25} />,
      link: `/admin/refund-requests`,
    },
    {
      name: 'Reported Problems',
      icon: <MdReport size={25} />,
      link: `/admin/reported-problems`,
    },
    {
      name: 'Preview Courses',
      icon: <MdRemoveRedEye size={25} />,
      link: `/`,
    },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSideBarWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(600);

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
          items={sidebarItems}
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
