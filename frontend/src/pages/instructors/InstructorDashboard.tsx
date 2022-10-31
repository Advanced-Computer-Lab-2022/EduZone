import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/Admin/AdminLayout';

const InstructorDashboard = () => {
  const { id } = useParams();
  return (
    <AdminLayout>
      <div>InstructorDashboard</div>
      <div className="flex flex-col gap-2">
        <Link to={`/instructors/${id}/courses`}>
          <span className="text-primary"> Courses</span>
        </Link>

        <Link to={`/courses/create?instructorId=${id}`}>
          <span className="text-primary">Create Course</span>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default InstructorDashboard;
