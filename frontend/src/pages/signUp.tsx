import React, { FormEventHandler, useState } from 'react';
import RefInputField from '../components/common/RefInputField';
import Hero from './../assets/illustrations/login-hero-with-corner.svg';
import { MdEmail, MdOutlineErrorOutline } from 'react-icons/md';
import { FaKey, FaUserAlt } from 'react-icons/fa';
import { BiUserCircle } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { axios, decodeToken } from '../utils';
import { setCookie } from 'cookies-next';
import { AxiosError, AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/features/auth.reducer';
import CircularLoadingIndicator from '../components/common/CircularLoadingIndicator';
import { GiMale, GiFemale } from 'react-icons/gi';
import { BsShieldLockFill } from 'react-icons/bs';
import { RiFileUserFill } from 'react-icons/ri';
import { showMessage } from '../redux/features/ui.reducer';
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const firstRef = React.useRef<HTMLInputElement>(null);
  const lastRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);
  const [gender, setGender] = useState('');
  const [error, setError] = useState({ show: false, message: '' });
  const onRegister = async () => {
    setLoading(true);

    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (password !== confirmPassword) {
      setLoading(false);
      setError({
        show: true,
        message: 'Passwords do not match',
      });
      return;
    }
    const firstName = firstRef.current?.value;
    const lastName = lastRef.current?.value;
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const name = firstName + ' ' + lastName;

    const userData = {
      username,
      password,
      name,
      gender,
      email,
    };
    // console.log(userData);
    // return;

    try {
      console.log('HERE');
      const res: AxiosResponse<any> = await axios({
        url: `/auth/register`,
        method: 'POST',
        data: userData,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // return
      console.log(res);
      if (res.status === 200) {
        setCookie('access-token', res.data?.accessToken);
        setCookie('refresh-token', res.data?.refreshToken);
        const user = decodeToken(res.data?.accessToken);
        dispatch(login(user));
        setLoading(false);
        // if (res.data?.lastLogin === null) {
        navigate(
          user?.role === 'instructor' ? '/instructor-policy' : '/trainee-policy'
        );
        // } else {
        //   navigate(
        //     user?.role === 'instructor' ? `/instructor/${user.id}` : '/'
        //   );
        // }
      }
    } catch (err) {
      setLoading(false);
      setError({
        show: true,
        message: (err as any)?.response?.data?.message,
      });
      console.log(err);
    }
  };
  return (
    // <div className="flex flex-col md:flex-row items-center justify-center h-full from-secondary-dark to-primary bg-gradient-to-br">
    <div className="h-screen from-secondary-dark to-primary bg-gradient-to-br flex">
      <div className="relative h-full  w-2/5">
        <img
          src={Hero}
          alt="Bottom Corner"
          className="absolute bottom-0 -left-0 w-full"
        />
      </div>
      <div className="w-4/5 h-full flex justify-center items-center ">
        <div className="bg-white w-1/2 rounded-lg shadow-lg p-10 py-20 flex flex-col justify-center space-y-2">
          <div className="mb-4">
            <h1 className="text-3xl text-primary font-medium">
              Create your account
            </h1>
            <p className="text-gray-600 text-sm">Please fill your data below</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="firstName" className="text-gray-600">
                First Name
              </label>
              <RefInputField
                icon={
                  <FaUserAlt
                    size={20}
                    className=" text-gray-500 absolute ml-1"
                  />
                }
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                ref={firstRef}
              />
            </div>
            <div className="flex flex-col  w-full">
              <label htmlFor="lastName" className="text-gray-600">
                Last Name
              </label>
              <RefInputField
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                ref={lastRef}
              />
            </div>
          </div>
          <div className="flex flex-col ">
            <label htmlFor="username" className="text-gray-600">
              Username
            </label>
            <RefInputField
              icon={
                <RiFileUserFill
                  size={20}
                  className=" text-gray-500 absolute ml-1"
                />
              }
              type="text"
              name="username"
              placeholder="Username"
              required
              ref={usernameRef}
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="email" className="text-gray-600">
              Email
            </label>
            <RefInputField
              icon={
                <MdEmail size={20} className=" text-gray-500 absolute ml-1" />
              }
              type="email"
              name="email"
              placeholder="Email"
              required
              ref={emailRef}
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="password" className="text-gray-600">
              Password
            </label>
            <RefInputField
              icon={
                <FaKey size={20} className=" text-gray-500 absolute ml-1" />
              }
              type="password"
              name="password"
              placeholder="Password"
              required
              ref={passwordRef}
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="confirmPassword" className="text-gray-600">
              Confirm Password
            </label>
            <RefInputField
              icon={
                <BsShieldLockFill
                  size={20}
                  className=" text-gray-500 absolute ml-1"
                />
              }
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              ref={confirmPasswordRef}
            />
          </div>

          <label htmlFor="gender" className="text-gray-600">
            Choose your Gender
          </label>
          <div className="flex w-full gap-4 pb-4">
            <div className="w-full">
              <input
                type="radio"
                name={'gender'}
                id={'male'}
                value={'male'}
                className="hidden peer"
                required
                onChange={(e) => setGender('male')}
              />
              <label
                htmlFor={'male'}
                className="inline-flex justify-between items-center px-5 w-full text-gray-500  rounded-sm border border-gray-200 cursor-pointer py-3  peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 bg-gray-50 "
              >
                <div className="w-full flex items-center gap-4">
                  <GiMale size={18} /> <span>Male</span>
                </div>
              </label>
            </div>
            <div className="w-full">
              <input
                type="radio"
                name={'gender'}
                id={'female'}
                className="hidden peer"
                required
                value={'female'}
                onChange={(e) => setGender('female')}
                // onChange={(e) =>
                //   onSelectAnswer(q?._id?.toString() ?? '', answer._id ?? '')
                // }
              />
              <label
                htmlFor={'female'}
                className="inline-flex justify-between items-center px-5 py-3 w-full text-gray-500 rounded-sm border border-gray-200 cursor-pointer  peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 bg-gray-50 "
              >
                <div className="w-full flex items-center gap-4">
                  <GiFemale size={18} /> <span>Female</span>
                </div>
              </label>
            </div>
          </div>
          {error.show && (
            <div className=" bg-red-400/30 text-red-500 border p-3 px-5 border-red-500 flex gap-2 items-center">
              <MdOutlineErrorOutline size={20} />
              <p className=" text-sm">{error.message}</p>
            </div>
          )}
          <div className="flex flex-col space-y-6 pt-4">
            <button
              onClick={() => onRegister()}
              className="bg-primary text-white w-full py-3 rounded-sm flex items-center justify-center"
            >
              <CircularLoadingIndicator loading={loading} />
              Submit
            </button>
          </div>
          <div>
            <p className="text-center mt-4 text-gray-500">
              Already have an account?{' '}
              <Link to={'/login'} className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
