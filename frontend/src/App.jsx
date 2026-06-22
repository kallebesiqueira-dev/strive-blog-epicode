import { Routes, Route } from 'react-router-dom'
import NavbarMenu from './components/NavbarMenu'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'

const App = () => {
    return (
        <>
            <NavbarMenu />
            <Routes>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/posts/new" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/posts/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
            </Routes>
        </>
    )
}

export default App
