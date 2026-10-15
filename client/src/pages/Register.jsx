import { useState } from "react";
import '../styles/Register.css';
import { useNavigate } from "react-router-dom";

export const Register = () => {

    const navigate = useNavigate() 

    // states
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: ""
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

        if(updatedFormData && updatedFormData.confirm_password.length > 0) {
            validate(updatedFormData)
        } else {
            setError("")
        }
    }

    const validate = (updatedFormData) => {
        if(updatedFormData["password"] !== updatedFormData["confirm_password"]) {
            setError("Doesn't match original password!")
        } else {
            setError("")
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();
        navigate("/login")
    }

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name:</label>
                    <input id="first_name" name="first_name" type="text" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name:</label>
                    <input id="last_name" name="last_name" type="text" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <input id="confirm_password" name="confirm_password" type="password" onChange={handleChange} required />
                    {error && <p>{error}</p>}
                </div>
                <div className="form-group">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}