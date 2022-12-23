import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/Admin/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>Admin</div>
        <div>
          <Link
            to="/admin/users"
            className="p-2 px-4 bg-primary text-white rounded-md"
          >
            Users
          </Link>
          <Link
            to="/admin/reported-problems"
            className="p-2 px-4 bg-primary text-white rounded-md"
          >
            Reported Problems
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
