import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/loginPage.css'; // Import the CSS file


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/auth/login`, { email, password });
            setMessage('Verification code sent to your email');

            const verifyResponse = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/auth/verify-code`, { email, verificationCode, });
            const { role, token } = verifyResponse.data;

            // Clear existing tokens
            localStorage.removeItem('teacherToken');
            localStorage.removeItem('studentToken');

            // Save token to localStorage based on the role
            if (role === 'teacher') {
                localStorage.setItem('teacherToken', token);
            } else if (role === 'student') {
                localStorage.setItem('studentToken', token);
            }

            setRole(role); // Set role based on login response

            if (role === 'teacher') {
                setMessage('Login successful! You are a teacher.');
            } else {
                setMessage('Login successful! You are a student.');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <Link to="/signup">Signup</Link>

            {error && <p className="error-message">{error}</p>} {/* Show error message */}

            <input
                className="input-field"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-button" onClick={handleLogin}>Login</button>
            {/* <button  onClick={() => window.location.href = '/signup'}>Signup</button> */}

            {message && <p className="message">{message}</p>} {/* Show success message */}

            {role === 'teacher' && (
                <div>
                    <button className="dashboard-button" onClick={() => navigate('/add-course')}>
                        Go to Teacher Dashboard
                    </button>
                </div>
            )}

            {role === 'student' && (
                <div>
                    <button className="dashboard-button" onClick={() => navigate('/select-course')}>
                        Go to Student Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;
