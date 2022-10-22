import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<h1>Home </h1>} />
        <Route path="login" element={<LoginPage />} />
        {/*<Route path="invoices" element={<Invoices />} /> */}
      </Routes>
    </div>
  );
}

export default App;
