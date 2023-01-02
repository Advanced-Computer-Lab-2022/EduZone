import React, { FormEventHandler, useState } from 'react';
import { GiMale, GiFemale } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/common/InputField';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import { axios } from '../../../utils';

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState('');

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    try {
      const res = await axios({
        method: 'POST',
        url: '/users',
        data: {
          ...data,
          gender,
        },
      });
      if (res.status === 201) {
        navigate('/admin/users');
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="mb-4 text-3xl">Create User</div>
        <form onSubmit={onSubmit} className="flex flex-col space-y-4 w-1/3">
          <InputField
            type="text"
            placeholder="Full Name"
            name="name"
            required={true}
          />
          <InputField type="text" placeholder="Username" name="username" />
          <InputField type="text" placeholder="Email" name="email" />
          <InputField
            type="password"
            placeholder="Enter Password"
            name="password"
            required={true}
          />
          <InputField
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            required={true}
          />
          <label htmlFor="gender" className="text-gray-600">
            Choose your Gender
          </label>
          <div className="grid gap-4 grid-cols-2">
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

          <div className="w-full">
            <p className="mr">Corporate</p>
            <select name="corporate" id="" className="w-full p-2 border">
              <option value="choose" disabled>
                -- Choose a corporate --{' '}
              </option>
              <option value="Benya">Benya</option>
              <option value="Brightskies">Brightskies</option>
              <option value="TMG">Talaat Mostafa Group</option>
              <option value="VOID">VOID</option>
              <option value="GUC">GUC</option>
              <option value="AUC">AUC</option>
            </select>
          </div>

          <div className="w-full">
            <p className="mr">Role</p>
            <select
              name="role"
              id=""
              required={true}
              className="w-full p-2 border"
            >
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="corp_trainee">Corporate Trainee</option>
            </select>
          </div>
          <button
            type="submit"
            className="
          p-2 px-4 text-white bg-primary rounded w-32
        "
          >
            Create
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateUser;
