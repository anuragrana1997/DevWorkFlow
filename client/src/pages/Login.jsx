import { useState } from "react";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";
import { api } from "../config/api";
import { useNavigate } from "react-router-dom";

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
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={handleChange} required />
                </div>
                {error && <p>{error}</p>}
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}
