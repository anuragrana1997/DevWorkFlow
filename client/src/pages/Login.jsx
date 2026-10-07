
import { useState } from "react";
import { basicApi } from "../config/api";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));

        setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setLoading(true);

        try {
            const response = await basicApi.post("/api/auth/login", {
                email: formData.email,
                password: formData.password
            });

            if (!response.data) {
                setServerError("Login Failed!");
                return;
            }

            console.log("Login Successful!", response.data);

            // TODO: Save token using AuthContext
            // TODO: Navigate to dashboard

        } catch (error) {
            console.error(error);

            setServerError(
                error.response?.data?.message ||
                "Unable to connect to Server!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />

                    {errors.email && (
                        <p style={{ color: "red" }}>
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />

                    {errors.password && (
                        <p style={{ color: "red" }}>
                            {errors.password}
                        </p>
                    )}
                </div>

                {serverError && (
                    <p role="alert" style={{ color: "red" }}>
                        {serverError}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
