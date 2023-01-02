import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Modal from '../../../components/common/Modal';
import AdminBatchCourses from '../../../components/courses/AdminBatchCourses';
import AdminBatchPromotion from '../../../components/courses/AdminBatchPromotion';
import AdminLayout from '../../../components/layout/Admin/AdminLayout';
import { axios } from '../../../utils';
import courses from '../../courses/courses';

const AdminUsers = () => {
  const [users, setUsers] = React.useState([] as any[]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCorporate, setSelectedCorporate] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([] as any[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState([] as any[]);
  const [selectedCourses, setSelectedCourses] = useState([] as any[]);
  const [usersStats, setUsersStats] = useState({
    total: 0,
    trainees: 0,
    instructors: 0,
    corp_trianees: 0,
  });
  const [courses, setCourses] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const getAllCourses = async () => {
    setLoading(true);
    const res = await axios({
      method: 'GET',
      url: '/courses',
    });
    setCourses(res.data.courses);
    console.log(res.data.courses);
    setLoading(false);
  };
  const getUsers = async () => {
    try {
      const { data } = await axios({ url: '/users' });
      console.log(data);
      setUsers(data as any[]);
      setFilteredUsers(data as any[]);

      setUsersStats({
        total: data.length,
        trainees: data.filter((user: any) => user.role === 'trainee').length,
        instructors: data.filter((user: any) => user.role === 'instructor')
          .length,
        corp_trianees: data.filter((user: any) => user.role === 'corp_trainee')
          .length,
      });
      // setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  const onSelect = (value: string) => {
    if (selectedCourses.includes(value)) {
      setSelectedCourses(
        (selectedCourses as string[]).filter((item) => item !== value)
      );
    } else {
      setSelectedCourses([...selectedCourses, value]);
    }
  };
  const onRemove = (value: string) => {
    setSelectedCourses(
      (selectedCourses as string[]).filter((item) => item !== value)
    );
  };

  const selectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map((course) => course._id.toString()));
    }
  };
  React.useEffect(() => {
    if (courses.length === 0) getAllCourses();
    if (users.length === 0) getUsers();
    else {
      setFilteredUsers(
        users.filter((user: any) => {
          if (selectedRole === 'all' && selectedCorporate === 'all')
            return true;
          if (selectedRole === 'all' && selectedCorporate !== 'all')
            return user.corporate === selectedCorporate;
          if (selectedRole !== 'all' && selectedCorporate === 'all')
            return user.role === selectedRole;
          if (selectedRole !== 'all' && selectedCorporate !== 'all')
            return (
              user.role === selectedRole && user.corporate === selectedCorporate
            );
        })
      );
    }
  }, [selectedCorporate, selectedRole]);

  return (
    <AdminLayout>
      <Modal
        title="Add Courses"
        open={modalOpen}
        close={() => {
          setModalOpen(false);
          setSelectedCourses([]);
        }}
      >
        <AdminBatchCourses
          selectedUsers={selectedUser}
          courses={courses}
          closeModal={() => {
            setModalOpen(false);
            setSelectedCourses([]);
          }}
          selected={selectedCourses}
          onSelect={onSelect}
          onRemove={onRemove}
          selectAll={selectAll}
        />
      </Modal>
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          <FaUsers className="text-2xl mr-2" />
          <h1 className="text-2xl font-semibold">
            Users
            <span className="text-gray-500 ml-2 text-base">
              ({filteredUsers.length})
            </span>
          </h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <label htmlFor="role" className="mr-2">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="border border-gray-300 rounded p-2 bg-gray-200"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All</option>
              <option value="trainee">Trainee</option>
              <option value="instructor">Instructor</option>
              <option value="corp_trainee">Corporate Trainee</option>
            </select>
          </div>
          <div className="flex items-center ml-4">
            <label htmlFor="corporate" className="mr-2">
              Corporate
            </label>
            <select
              name="corporate"
              id="corporate"
              className="border border-gray-300 rounded p-2 bg-gray-200"
              value={selectedCorporate}
              onChange={(e) => setSelectedCorporate(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Benya">Benya</option>
              <option value="Brightskies">Brightskies</option>
              <option value="TMG">Talaat Mostafa Group</option>
              <option value="VOID">VOID</option>
              <option value="GUC">GUC</option>
              <option value="AUC">AUC</option>
            </select>
          </div>
        </div>
        <div>
          <button
            className=" p-2 px-4 text-white bg-primary rounded mb-5 mr-5 disabled:opacity-50"
            disabled={selectedUser.length === 0}
            onClick={() => setModalOpen(true)}
          >
            Add Courses
          </button>
          <button className=" p-2 px-4 text-white bg-primary rounded mb-5">
            <Link to="/admin/users/create">Create User</Link>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="w-10 px-5">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUser(filteredUsers.map((user) => user._id));
                    } else {
                      setSelectedUser([]);
                    }
                  }}
                  checked={selectedUser.length === filteredUsers.length}
                />
              </th>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Username
              </th>
              <th scope="col" className="py-3 px-6">
                Email
              </th>
              <th scope="col" className="py-3 px-6">
                Role
              </th>
              <th scope="col" className="py-3 px-6">
                Corporate
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr className="">
                <td
                  className="bg-white border-b   py-4 px-6 font-medium"
                  colSpan={5}
                >
                  No Users Found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user: any) => {
                return (
                  <tr
                    className="bg-white border-b  hover:bg-gray-50 "
                    key={user?._id}
                  >
                    <td scope="col" className="w-10 px-5">
                      <input
                        type="checkbox"
                        checked={selectedUser.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUser([...selectedUser, user._id]);
                          } else {
                            setSelectedUser(
                              selectedUser.filter((id) => id !== user._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <th
                      scope="row"
                      className="py-4 pr-6 font-medium text-gray-900  "
                    >
                      <div className="flex break-normal	items-center">
                        <img
                          src={
                            user?.img ||
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                          }
                          alt="avatar"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <p>{user?.name}</p>
                      </div>
                    </th>
                    <td className="py-4 px-6 uppercase">{user?.username}</td>

                    <td className="py-4 px-6">
                      <span className="text-gray-700">{user?.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{user?.role}</span>
                    </td>
                    <td className="py-4 px-6 " align="center">
                      <span className="text-gray-700">{user?.corporate}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
