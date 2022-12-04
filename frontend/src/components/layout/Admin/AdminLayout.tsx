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

export default AdminLayout;

/*
import Head from 'next/head';
import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { LayoutProps } from '../../../types/components';
import Loading from '../atoms/Loading';
import Navbar from '../../navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import Toast from '../atoms/Toast';
import axios from '../../../utils/custom_axios';
import { getUser } from '../../../redux/hooks/auth.hook';
import { getCookie } from 'cookies-next';
import {
  getMetadataState,
  setCompany,
  setCurrentModule,
  setModules,
} from '../../../redux/reducers/metadata.reducer';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSideBarWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(500);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    if (!metadata_state.modules) {
      getMetadata();
    }
  }, [ isLoading]);
  return (
    <Fragment>
      {isLoading && <h1>Loading...</h1>}
      <div className='flex'>
        <Sidebar
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
          <Navbar windowWidth={windowWidth} sidebarWidth={sidebarWidth} />
          <div
            className='p-5 bg-zinc-100 min-h-screen pt-20 w-full'
            // style={{
            //   width: windowWidth - sidebarWidth,
            // }}
          >
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
*/
