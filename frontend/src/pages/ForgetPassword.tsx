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
//import { forgetPassword } from './backend/src/routes/router';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email');
    try {
      const res: AxiosResponse<any> = await axios({
        url: `/auth/forget-password`,
        method: 'POST',
        data: {
          email,
        },
      });

      if (res.status === 200) {
        setLoading(false);
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="h-screen from-secondary-dark to-primary bg-gradient-to-br flex items-center justify-center">
      <div className="w-3/5  flex justify-center items-center">
        <form
          className="bg-white w-1/2 h-2/3 rounded-lg shadow-lg p-10 py-16 flex flex-col justify-evenly"
          onSubmit={onSubmit}
        >
          <div className="space-y-6">
            <div>
              <p className="text-3xl font-medium text-center">
                Forget Password
              </p>
              <p className="text-sm text-center text-gray-400 ">
                We are going to send you an email with the reset link
              </p>
            </div>
            <div className="">
              <p className="text-gray-600">Please enter your Email</p>
              <InputField
                placeholder="email@email.com"
                icon={
                  <MdEmail size={25} className=" text-gray-500 absolute ml-1" />
                }
                name="email"
              />
            </div>
            <input
              value={'Submit'}
              type="submit"
              className="bg-primary text-white w-full py-3 rounded-sm flex items-center justify-center cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default ForgetPassword;
