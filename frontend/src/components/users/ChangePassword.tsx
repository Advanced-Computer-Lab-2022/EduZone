import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { showMessage } from '../../redux/features/ui.reducer';
import { RootState } from '../../redux/store';
import { axios } from '../../utils';

const ChangePassword: React.FC<{ isReset?: boolean }> = ({ isReset }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const onResetPassword = async () => {
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    const url = isReset
      ? `/auth/reset-password/${token}`
      : `/auth/change-password`;
    const headers = isReset
      ? {}
      : { Authorization: `Bearer ${getCookie('access-token')}` };
    try {
      const res = await axios({
        url,
        method: 'PUT',
        data: {
          password,
          oldPassword,
        },
        headers,
      });

      if (res.status === 202) {
        dispatch(
          showMessage({
            text: 'Password Changed Successfully',
            type: 'success',
          })
        );
        if (isReset) navigate('/login');
        else if (location.state?.from) navigate(`/instructor/${user?.id}`);
        else navigate(-1);
      } else {
        dispatch(
          showMessage({
            text: 'Something went wrong',
            type: 'error',
          })
        );
      }
    } catch (err) {
      const { response } = err as AxiosError;
      if (response?.status === 400) {
        dispatch(
          showMessage({
            text: ((err as AxiosError).response?.data as any)?.message,
            type: 'error',
          })
        );
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center mt-[20%]">
      <div className="flex flex-col gap-4 w-1/3 items-center">
        {!isReset && (
          <div className="flex flex-col">
            <label htmlFor="">Old Password</label>
            <input
              type="password"
              className="px-4 border-2 border-gray-300 rounded-md p-2 w-96"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        )}
        <div className="flex flex-col">
          <label htmlFor="">Password</label>
          <input
            type="password"
            className="px-4 border-2 border-gray-300 rounded-md p-2 w-96"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Confirm Password</label>
          <input
            type="password"
            className="px-4 border-2 border-gray-300 rounded-md p-2 w-96"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md w-96"
          onClick={onResetPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
