import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthLayout } from "../components/AuthLayout";

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

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/register",
                formData
            )
            if(response && response.data) {
                navigate("/login")
            } else {
                throw new Error("Registration Failed!")
            }   
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <AuthLayout eyebrow="GET STARTED" title="Create your account" description="Join your team and start tracking your work.">
            <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-name-row">
                    <div className="auth-field">
                        <label htmlFor="first_name">First name</label>
                        <input id="first_name" name="first_name" type="text" autoComplete="given-name"
                            onChange={handleChange} required />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="last_name">Last name</label>
                        <input id="last_name" name="last_name" type="text" autoComplete="family-name"
                            onChange={handleChange} required />
                    </div>
                </div>
                <div className="auth-field">
                    <label htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" autoComplete="email"
                        placeholder="you@example.com" onChange={handleChange} required />
                </div>
                <div className="auth-field">
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" autoComplete="new-password"
                        onChange={handleChange} required />
                </div>
                <div className="auth-field">
                    <label htmlFor="confirm_password">Confirm password</label>
                    <input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password"
                        onChange={handleChange} required />
                </div>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <button className="auth-primary-button" type="submit">Create account</button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </AuthLayout>
    )
}
