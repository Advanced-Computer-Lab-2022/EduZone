import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootState } from './redux/store';
import { ProtectedRoutes, UnProtectedRoutes } from './routes';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <div className="App">
      <Routes>
        {UnProtectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {isAuthenticated ? (
          ProtectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        {/* <Route path="login" element={<LoginPage />} /> */}
        {/*<Route path="invoices" element={<Invoices />} /> */}
      </Routes>
    </div>
  );
}

export default App;
