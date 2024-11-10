import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ExplorePage from './pages/ExplorePage'
import LikesPage from './pages/LikesPage'

function App() {
  return (
    <>
      <div className="flex text-white">
        <Sidebar />
        <div className="mx-auto my-5 max-w-5xl flex-1 transition-all duration-300">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/likes" element={<LikesPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
