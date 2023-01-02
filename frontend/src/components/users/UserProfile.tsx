import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import UpdateUser from './UpdateUser';

const UserProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <div
        className={`flex flex-col items-center pt-8 pb-4 mt-4 ${
          user.role === 'instructor' ? 'border-r-2 border-r-primary' : ''
        } `}
      >
        <div>
          {user.img ? (
            <img
              src={user.img}
              alt="profile"
              className="w-52 h-52 rounded-full"
            />
          ) : (
            <div className="w-52 h-52 rounded-full bg-gray-300 font-medium text-6xl flex items-center justify-center text-gray-500">
              {user?.name.toUpperCase()[0]}
            </div>
          )}
          <p className="text-xl font-semibold text-gray-500 text-center my-2">
            {user.role.toUpperCase()}
          </p>
        </div>
      </div>
      <UpdateUser />
    </div>
  );
};

export default UserProfile;
