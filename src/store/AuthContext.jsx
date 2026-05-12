import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false);
    }, []) // restore after refresh

    const login = (userData, authToken) => {
        setUser(userData)
        setToken(authToken) // store login data
        localStorage.setItem("token", authToken)
        localStorage.setItem("user", JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider> //make auth data available to entire app
    )
}

export function useAuth() {
    return useContext(AuthContext)
}