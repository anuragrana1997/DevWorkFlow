import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ token, setToken ] = useState(
        localStorage.getItem("token")
    )

    const login = (newToken) => {
        localStorage.setItem("token", newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
    }

    const isAuthenticated = !!token;
    let user = null;
    try {
        if (token) {
            const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            user = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")));
        }
    } catch {
        user = null;
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  return useContext(AuthContext);
};
