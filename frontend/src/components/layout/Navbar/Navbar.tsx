import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/features/auth.reducer';
import { RootState } from '../../../redux/store';
import Avatar from '../../common/Avatar';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="h-14 bg-white flex items-center justify-center shadow-md fixed w-full z-30">
      <div className="container max-w-7xl flex items-center justify-between mx-auto h-full">
        <div className="text-lg text-primary font-medium ">Placeholder</div>
        <div className="w-3/5">
          <SearchBar />
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
            <div className="text-xl border p-1">🇪🇬 EGP</div>
            <Avatar
              name={user?.name}
              img="https://avatars.githubusercontent.com/u/30694445?v=4"
            />
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
