import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExplorePage from './pages/ExplorePage';
import LikesPage from './pages/LikesPage';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { authUser } = useAuthContext();
  console.log('Usuário Autenticado:', authUser);

  return (
    <>
      <div className="flex text-white">
        <Sidebar />
        <div className="mx-auto my-5 max-w-5xl flex-1 transition-all duration-300">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
            />
            <Route
              path="/explore"
              element={authUser ? <ExplorePage /> : <Navigate to={'/login'} />}
            />
            <Route
              path="/likes"
              element={authUser ? <LikesPage /> : <Navigate to={'/login'} />}
            />
          </Routes>
          <Toaster />
        </div>
      </div>
    </>
  );
}

export default App;
