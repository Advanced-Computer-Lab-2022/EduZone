import { RouteType } from '../types';

const ProtectedRoutes: RouteType[] = [
  {
    path: 'invoices',
    element: <h1>Invoices </h1>,
    parent: false,
  },
];

export default ProtectedRoutes;
