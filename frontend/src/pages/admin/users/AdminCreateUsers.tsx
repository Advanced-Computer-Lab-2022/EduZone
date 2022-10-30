import React, { FormEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/common/InputField';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import { axios } from '../../../utils';

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    try {
      const res = await axios({
        method: 'POST',
        url: '/users',
        data,
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
        <div className="grid grid-cols-2">
          <p className="col-span-2">Gender</p>
          <div>
            <input
              type="radio"
              name="gender"
              className="mr-2"
              value="male"
              required={true}
            />
            <label htmlFor="">Male</label>
          </div>
          <div>
            <input
              type="radio"
              name="gender"
              className="mr-2"
              value="female"
              required={true}
            />
            <label htmlFor="">Female</label>
          </div>
        </div>
        <div>
          <p className="mr">Role</p>
          <select name="role" id="" required={true}>
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
    </AdminLayout>
  );
};

export default AdminCreateUser;
