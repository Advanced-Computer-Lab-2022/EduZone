import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/features/auth.reducer';
import { RootState } from '../../../redux/store';
import Avatar from '../../common/Avatar';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="h-14 bg-white flex items-center justify-center shadow-md fixed w-full">
      <div className="container max-w-7xl flex items-center justify-between mx-auto h-full">
        <div className="text-lg text-primary font-medium">Placeholder</div>
        <div className="w-3/5">
          <form className="w-full" onSubmit={(e) => console.log(e)}>
            {/*Search bar */}
            <div className="relative ">
              <input
                type="text"
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-gray-400"
                placeholder="Search"
              />
              <div className="absolute top-0 left-0 flex items-center h-full ml-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>

                <div className="relative">
                  {/* <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div> */}
                </div>
              </div>
            </div>
          </form>
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
