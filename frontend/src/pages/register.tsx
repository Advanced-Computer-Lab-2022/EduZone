import React, { FormEventHandler, useState } from 'react';
import InputField from '../components/common/InputField';
import Hero from './../assets/illustrations/login-hero-with-corner.svg';
import { MdEmail } from 'react-icons/md';
import { FaKey } from 'react-icons/fa';

import { Link, useNavigate } from 'react-router-dom';
import { axios, decodeToken } from '../utils';
import { setCookie } from 'cookies-next';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/features/auth.reducer';
import CircularLoadingIndicator from '../components/common/CircularLoadingIndicator';
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    return;
    try {
      const res:
        | AxiosResponse<{ accessToken: string; refreshToken: string }, any>
        | any = await axios({
        url: `/auth/login`,
        method: 'POST',
        data: {
          username,
          password,
        },
      });
      // const { accessToken, refreshToken, lastLogin } = res.data;
      if (res.status === 200) {
        setCookie('access-token', res.data?.accessToken);
        setCookie('refresh-token', res.data?.refreshToken);
        const user = decodeToken(res.data?.accessToken);
        dispatch(login(user));
        setLoading(false);
        if (res.data?.lastLogin === null) {
          navigate(
            user?.role === 'instructor'
              ? '/instructor-policy'
              : '/trainee-policy'
          );
        } else {
          navigate(
            user?.role === 'instructor' ? `/instructor/${user.id}` : '/'
          );
        }
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };
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
          className="bg-white w-1/2 h-2/3 rounded-lg shadow-lg p-10 py-16 flex flex-col justify-evenly"
          onSubmit={onSubmit}
        >
          <div className="">
            <p className="text-3xl text-primary font-medium">
              Create your account
            </p>
            <p className="text-gray-600">Please fill your data below</p>
          </div>
          <div className="space-y-4">
            <div className="text-red-500">Change logos</div>
            <InputField
              placeholder="Enter your first Name"
              icon={
                <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
              }
              name="firstName"
            />
            <InputField
              placeholder="Enter your last Name"
              icon={
                <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
              }
              name="lastName"
            />
            <InputField
              placeholder="Enter your username"
              icon={
                <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
              }
              name="username"
            />
            <InputField
              placeholder="Enter your email"
              icon={
                <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
              }
              name="email"
            />
            <InputField
              placeholder="Enter your password"
              type="password"
              icon={
                <FaKey size={23} className=" text-gray-500 absolute ml-1" />
              }
              name="password"
            />
            <div>GENDER</div>
            <button className="bg-primary text-white w-full py-3 rounded-sm flex items-center justify-center">
              <CircularLoadingIndicator loading={loading} />
              Register
            </button>
          </div>
          <div>
            <p className="text-center mt-4 text-gray-500">
              Already have an account?{' '}
              <Link
                to={'/login'}
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
