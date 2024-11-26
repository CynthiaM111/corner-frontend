import React, { useState } from 'react';
import { signupUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/signupPage.css'; // Import the CSS file

const Signup = () => {
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await signupUser(formData);
            setMessage("Signup successful!");
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } catch (error) {
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>

            {error && <p className="error-message">{error}</p>} {/* Show error message */}

            <form onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <select
                    className="select-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                <button className="signup-button" type="submit">
                    Sign Up
                </button>
            </form>

            {message && <p className="message">{message}</p>} {/* Show success message */}
        </div>
    );
};

export default Signup;
