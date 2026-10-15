import { useState } from "react";
import "../styles/Login.css";

export const Login = () => {

    // states
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    // functions
    const handleChange = (e) => {
        const {name, value} = e.target;
        
        const updatedFormData = {
            ...formData,
            [name]: value
        }
        setFormData(updatedFormData)

        validate(updatedFormData)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
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

                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}