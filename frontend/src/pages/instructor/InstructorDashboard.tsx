import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import InstructorLayout from '../../components/layout/Instructor/InstructorLayout';
import { RootState } from '../../redux/store';

const InstructorDashboard = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  return (
    <InstructorLayout>
      <p className="text-2xl">Hello, {user.name}</p>
      <div className="flex my-5">
        <div
          className="w-1/4 h-32 bg-zinc-300 text-primary rounded-md flex justify-center items-center cursor-pointer hover:border border-primary"
          onClick={() => navigate(`/instructor/${id}/courses`)}
        >
          <p className="text-2xl">Courses</p>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;
