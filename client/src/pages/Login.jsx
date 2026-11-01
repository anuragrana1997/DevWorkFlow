import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";

export const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();
    // states
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")

    // functions
    const handleChange = (e) => {
        const {name, value} = e.target;
        
        const updatedFormData = {
            ...formData,
            [name]: value
        }
        setFormData(updatedFormData)

    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/login", formData)
            if(response.data.jwt_token) {
                login(response.data.jwt_token)
                navigate("/dashboard")
            } else {
                throw new Error("Login Failed!")
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message)
        }
    }

    return (
        <AuthLayout eyebrow="SIGN IN" title="Welcome back" description="Sign in to see your tasks and projects.">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" name="email" autoComplete="email"
                        placeholder="you@example.com" onChange={handleChange} required />
                </div>

                <div className="auth-field">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" autoComplete="current-password"
                        placeholder="Enter your password" onChange={handleChange} required />
                </div>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <button className="auth-primary-button" type="submit">Sign in</button>
            </form>
            <div className="auth-divider"><span>New to DevWorkflow?</span></div>
            <Link className="auth-secondary-button" to="/register">Create an account</Link>
        </AuthLayout>
    )
}
