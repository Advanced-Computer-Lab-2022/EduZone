import React, { FormEventHandler, useState } from 'react';
import InputField from '../components/common/InputField';
import Hero from './../assets/illustrations/login-hero-with-corner.svg';
import { MdEmail } from 'react-icons/md';
import { FaKey } from 'react-icons/fa';
import { BiUserCircle } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { axios, decodeToken } from '../utils';
import { setCookie } from 'cookies-next';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/features/auth.reducer';
import CircularLoadingIndicator from '../components/common/CircularLoadingIndicator';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const gender = formData.get('gender');
    const role = formData.get('role');

    const name = firstName + ' ' + lastName;
    console.log(name);
    if (password !== confirmPassword) {
      alert('Password does not match');
      return;
    }

    try {
      console.log('here');
      const res: AxiosResponse<any> = await axios({
        url: `/auth/register`,
        method: 'POST',
        data: {
          username: username,
          password: password,
          name: name,
          gender: gender,
          email: email,
          role: role,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
      if (res.status === 200) {
        setLoading(false);
        navigate('/');
      }
      if (res.status === 400) {
        alert('User already exists');
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-full from-secondary-dark to-primary bg-gradient-to-br flex">
      <div className="hidden md:block w-1/2 h-2/4">
        <img src={Hero} alt="login hero" />
      </div>
      <div className="w-3/5 h-full flex justify-center items-center space-y-4">
        <form
          className="bg-white w-1/2 h-full rounded-lg shadow-lg p-10 py-20 flex flex-col justify-center"
          onSubmit={onSubmit}
          method="POST"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign Up</h1>
          <div className="flex flex-col space-y-2">
            <label htmlFor="firstName" className="text-gray-600">
              First Name
            </label>
            <InputField
              type="text"
              name="firstName"
              placeholder="First Name"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="lastName" className="text-gray-600">
              Last Name
            </label>
            <InputField
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="text-gray-600">
              Username
            </label>
            <InputField
              icon={
                <BiUserCircle
                  size={25}
                  className=" text-gray-500 absolute ml-1"
                />
              }
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-gray-600">
              Email
            </label>
            <InputField
              icon={
                <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
              }
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-gray-600">
              Password
            </label>
            <InputField
              icon={
                <FaKey size={25} className=" text-gray-500 absolute ml-1" />
              }
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="confirmPassword" className="text-gray-600">
              Confirm Password
            </label>
            <InputField
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="gender" className="text-gray-600">
              Choose a Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" disabled selected>
                Select your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="role" className="text-gray-600">
              Applying as a :
            </label>
            <select
              name="role"
              id="role"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="" disabled selected>
                Select your option
              </option>
              <option value="trainee">Trainee</option>
              <option value="instructor">Instructor</option>
              <option value="corp_trainee">Corporate Trainee</option>
            </select>
          </div>
          <div className="flex flex-col space-y-6">
            <label htmlFor="terms" className="text-gray-600 space">
              <input type="checkbox" name="terms" id="terms" required />
              {'  '}I agree to the terms and conditions
            </label>
          </div>
          <div className="flex flex-col space-y-6">
            <button
              type="submit"
              value={'Submit'}
              className="bg-primary text-white w-full py-3 rounded-sm flex items-center justify-center"
            >
              <CircularLoadingIndicator loading={loading} />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
