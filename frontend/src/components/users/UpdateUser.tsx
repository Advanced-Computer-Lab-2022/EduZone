import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUser } from '../../redux/features/auth.reducer';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';

const UpdateUser = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const dispatch = useDispatch();
  const onCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setBio(user.bio);
  };
  const onUpdate = async () => {
    const data = {
      name,
      email,
      bio,
    };
    const res = await axios({
      url: `/users/${user.id}`,
      method: 'PUT',
      data,
    });
    if (res.status === 202) {
      dispatch(
        updateUser({
          ...res.data,
          refreshToken: undefined,
          password: undefined,
          lastLogin: undefined,
          id: res.data._id,
          _id: undefined,
          __v: undefined,
        })
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col flex-wrap w-2/3 mx-auto justify-center items-center">
        {/* <Link to={'change-password'}>
          <button className="text-primary hover:underline">
            Change Password
          </button>
        </Link> */}
        <div className="flex-col gap-4 my-4 justify-center flex-wrap  lg:flex">
          <div className="flex flex-col ">
            <label htmlFor="">Name</label>
            <input
              type="text"
              className="px-4 border-2 border-gray-300 rounded-md p-2 w-96"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Email</label>
            <input
              type="text"
              className="border-2 px-4 border-gray-300 rounded-md p-2 w-96"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="">Bio</label>
          <textarea
            name="bio"
            id="bio"
            className="border-2 border-gray-300 rounded-md lg:w-full  w-full px-4 py-3"
            placeholder="Enter your biography"
            value={bio}
            rows={5}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="flex w-[49rem] space-x-6 justify-center mt-5">
        <button
          className="border-2   border-gray-400 w-40 text-gray-700 px-4 py-2 rounded-md mt-4"
          onClick={() => onCancel()}
        >
          Cancel
        </button>
        <button
          disabled={
            name === user.name && email === user.email && bio === user.bio
          }
          className="bg-primary w-40 text-white px-4 py-2 rounded-md mt-4 disabled:bg-primary/50 disabled:cursor-not-allowed"
          onClick={() => onUpdate()}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateUser;
