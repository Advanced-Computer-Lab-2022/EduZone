import React from 'react';
import { Link, Router, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { IoMdHome, IoIosArrowBack } from 'react-icons/io';
const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen pt-16">
        <div className="mx-auto md:max-w-5xl xl:max-w-7xl px-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
