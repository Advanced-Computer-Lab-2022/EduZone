import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../../../redux/store';
import ProfileMenu from '../../common/navbar/ProfileMenu/ProfileMenu';
import CurrencyConverter from '../../common/navbar/trainee/CurrencyConverter';
import SearchBar from '../../common/navbar/trainee/SearchBar';

const InstructorNavbar: React.FC<{
  sidebarWidth: number;
  windowWidth: number;
}> = ({ sidebarWidth, windowWidth }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  return (
    <div
      className="h-14 border-b bg-zinc-00 bg-white shadow-sm flex justify-between items-center px-6 fixed z-30 "
      style={{
        width: windowWidth - sidebarWidth,
      }}
    >
      <div className="w-full px-6 flex items-center justify-between mx-auto h-full ">
        <Link to="/" className="text-lg text-primary font-medium ">
          Placeholder
        </Link>

        {isAuthenticated ? (
          <div className="flex gap-4 items-center">
            <CurrencyConverter />
            {/* <Avatar
              name={user?.name}
              img="https://avatars.githubusercontent.com/u/30694445?v=4"
            /> */}
            <ProfileMenu />
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default InstructorNavbar;
