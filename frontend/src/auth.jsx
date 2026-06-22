import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadMe = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            const { user } = await api.get('/me')
            setUser(user)
        } catch {
            localStorage.removeItem('token')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMe()
    }, [])

    const login = async (email, password) => {
        const { token } = await api.post('/login', { email, password }, { auth: false })
        localStorage.setItem('token', token)
        await loadMe()
    }

    const loginWithToken = async (token) => {
        localStorage.setItem('token', token)
        await loadMe()
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
