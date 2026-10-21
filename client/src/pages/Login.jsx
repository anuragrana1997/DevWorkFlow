import { useState } from "react";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
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
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                formData
            )
            if(response) {
                console.log(response)
                login(response)
                navigate("/dashboard")
            } else {
                throw new Error("Login Failed!")
            }
        } catch (error) {
            console.log(error.message)
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