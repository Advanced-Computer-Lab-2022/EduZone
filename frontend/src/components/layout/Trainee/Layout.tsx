import React from 'react';
import { Link, Router, useLocation, useNavigate } from 'react-router-dom';
//import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { IoMdHome, IoIosArrowBack } from 'react-icons/io';
import TraineeNavbar from '../common/navbar/trainee/TraineeNavbar';
import { IoArrowBackOutline } from 'react-icons/io5';
const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <TraineeNavbar />
      {/* back btn */}

      <div className="bg-gray-100 min-h-screen pt-16">
        <div className="mx-auto md:max-w-[70%] xl:max-w-[80%] px-6">
          {location.pathname !== '/' && (
            <button
              className="flex items-center gap-1 mt-2 hover:underline hover:text-primary"
              onClick={() => navigate(-1)}
            >
              <IoArrowBackOutline size={15} />
              <span className="">back</span>
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
