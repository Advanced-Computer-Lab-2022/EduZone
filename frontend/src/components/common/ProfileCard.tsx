import React, { useState } from 'react';
import { FaUserAlt, FaInfoCircle, FaLock } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { MdEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import UpdateUser from '../users/UpdateUser';
import Divider from './Divider';
import Modal from './Modal';

const ProfileCard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full py-10 space-y-5">
      <Modal
        open={modalOpen}
        close={() => setModalOpen(false)}
        title="Update User"
      >
        <UpdateUser />
      </Modal>
      <div className="flex flex-col items-center ">
        <div className="relative">
          <div className="absolute bg-gray-100 text-primary shadow-lg rounded-full p-2 top-0 right-0">
            <MdEdit size={25} />
          </div>
          {user.img ? (
            <img
              src={user.img}
              alt="profile"
              className="w-32 h-32 rounded-full"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-primary font-medium text-6xl flex items-center justify-center text-white">
              {user?.name.toUpperCase()[0]}
            </div>
          )}
        </div>
        <p className="text-xl font-medium text-gray-800  mt-4">
          {user.name.toUpperCase()}
        </p>
        <p className=" text-gray-500">@{user.username}</p>
      </div>
      <Divider />
      <div className="space-y-5 w-full flex flex-col">
        <button
          className="self-end text-sm text-primary"
          onClick={() => setModalOpen(true)}
        >
          Edit Profile
        </button>
        <div>
          <div className="flex items-baseline gap-2 text-gray-500 text-sm">
            <FaUserAlt />
            <p>Name</p>
          </div>
          <p className="text-lg">{user.name}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-gray-500  text-sm">
            <HiMail size={20} />
            <p>Email</p>
          </div>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-gray-500  text-sm">
            <FaLock size={18} />
            <p>Password</p>
          </div>
          <Link to={'change-password'}>
            <button className="self-end  text-primary">Change Password</button>
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-2 text-gray-500  text-sm">
            <FaInfoCircle size={18} />
            <p>Bio</p>
          </div>
          <p className=" text-gray-800">
            {user.bio ?? "You haven't added a bio yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
