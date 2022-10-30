import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import { axios } from '../../../utils';

const AdminUsers = () => {
  const [users, setUsers] = React.useState([] as any[]);
  const getUsers = async () => {
    try {
      const { data } = await axios({ url: '/users' });
      console.log(data);
      setUsers(data as any[]);
      // setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getUsers();
  }, []);
  return (
    <AdminLayout>
      <button className="p-2 px-4 text-white bg-primary rounded">
        <Link to="/admin/users/create">Create User</Link>
      </button>
      <table className="w-2/3">
        <thead className="text-left border-b-primary border-b">
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id} className="">
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminUsers;
