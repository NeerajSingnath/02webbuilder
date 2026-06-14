import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import Dashboard from './pages/Dashboard';
import Editor_ from './pages/Editor';
import Generate from './pages/Generate';
import Home from './pages/Home';
import LiveSite from './pages/LiveSite';
export const serverUrl = 'http://localhost:3000';

const App = () => {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={userData ? <Dashboard /> : <Home />}
        />
        <Route path="/generate" element={userData ? <Generate /> : <Home />} />
        <Route
          path="*"
          element={<Navigate to={userData ? '/dashboard' : '/'} />}
        />
        <Route path="/editor/:id" element={userData ? <Editor_ /> : <Home />} />
        <Route path="/site/:id" element={<LiveSite />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
