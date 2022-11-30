import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import { RootState } from '../../redux/store';

const InstructorDashboard = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user);
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <p className="text-2xl">Hello, {user.name}</p>
      <div className="flex my-5">
        <div
          className="w-1/4 h-32 bg-zinc-300 text-red-800 rounded-md flex justify-center items-center cursor-pointer hover:border border-red-800"
          onClick={() => navigate(`/instructors/${id}/courses`)}
        >
          <p className="text-2xl">Courses</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorDashboard;
