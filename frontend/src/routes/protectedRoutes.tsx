import AdminDashboard from '../pages/admin/dashboard';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminCreateUser from '../pages/admin/users/AdminCreateUsers';
import { RouteType } from '../types';

const ProtectedRoutes: RouteType[] = [
  {
    path: 'invoices',
    element: <h1>Invoices </h1>,
    parent: false,
  },
  {
    path: 'admin',
    element: <AdminDashboard />,
    parent: false,
  },
  {
    path: 'admin/users',
    element: <AdminUsers />,
    parent: false,
  },
  {
    path: 'admin/users/create',
    element: <AdminCreateUser />,
    parent: false,
  },
];

export default ProtectedRoutes;
