import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/features/auth.reducer';
import { RootState } from '../../../../redux/store';
import Avatar from '../common/ProfileMenu/Avatar';
import ProfileMenu from '../common/ProfileMenu/ProfileMenu';
import CurrencyConverter from './CurrencyConverter';
import SearchBar from './SearchBar';

const TraineeNavbar = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  return (
    <div className="h-14 bg-white flex items-center justify-center shadow-md fixed w-full z-30">
      <div className="container md:max-w-[70%] xl:max-w-[80%] px-6 flex items-center justify-between mx-auto h-full px-6 ">
        <Link to="/" className="text-lg text-primary font-medium ">
          Placeholder
        </Link>
        <div className="w-3/5">
          <SearchBar
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const query = formData.get('query');
              navigate(`/courses?query=${query}`);
            }}
          />
        </div>
        {isAuthenticated ? (
          // <button
          //   onClick={() => {
          //     dispatch(logout());
          //     navigate('/login');
          //   }}
          // >
          //   Logout
          // </button>
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

export default TraineeNavbar;
