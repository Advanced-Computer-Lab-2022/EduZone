import React, { FormEventHandler } from 'react';
import InputField from '../components/common/InputField';
import Hero from './../assets/illustrations/login-hero-with-corner.svg';
import { MdEmail } from 'react-icons/md';
import { FaKey } from 'react-icons/fa';
import axios from 'axios';
const onSubmit: FormEventHandler = (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('password');
  const res = axios({
    url: `/auth/login`,
    method: 'POST',
    data: {
      username,
      password,
    },
  });
};
const LoginPage = () => {
  return (
    <div className="h-screen from-secondary-dark to-primary bg-gradient-to-br flex">
      <div className="relative h-full  w-2/5">
        <img
          src={Hero}
          alt="Bottom Corner"
          className="absolute bottom-0 -left-0 w-full"
        />
      </div>
      <div className="w-3/5  flex justify-center items-center">
        <form
          className="bg-white w-1/2 h-2/3 rounded-lg shadow-lg p-10 py-16"
          onSubmit={onSubmit}
        >
          <p className="text-3xl text-primary font-medium">Welcome back...</p>
          <p className="text-gray-600">
            Please enter your username and password
          </p>
          <InputField
            placeholder="example@hakim.com"
            icon={
              <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
            }
            name="username"
          />
          <InputField
            placeholder="Enter Password"
            type="password"
            icon={<FaKey size={23} className=" text-gray-500 absolute ml-1" />}
            name="password"
          />
          <button className="bg-primary text-white w-full py-3 rounded-sm mt-6">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
