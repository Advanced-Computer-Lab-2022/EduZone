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
        {/* {!(location.pathname == '/') && (
          <div className="container mx-auto my-3">
            <Link
              className="container mx-auto items-center flex gap-0.5 text-gray-400"
              to={'/'}
            >
              <IoIosArrowBack
                size={20}
                className="transform -translate-y-[1px]"
              />
              <p>Back</p>
            </Link>
          </div>
        )} */}
        <div className="mx-auto container max-w-7xl">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
