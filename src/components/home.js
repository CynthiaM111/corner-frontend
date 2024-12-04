import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="welcome-text">
                <h1 className="display-4 text-center">Welcome to Corner!</h1>
                <p className="lead text-center">
                    Your hub for engaging in course discussions, asking questions, and collaborating with peers and instructors.
                </p>
            </div>

            <div className="auth-buttons text-center">
                <Link to="/login" className="btn btn-lg btn-primary mx-3">Login</Link>
                <Link to="/signup" className="btn btn-lg btn-outline-light mx-3">Sign Up</Link>
            </div>
        </div>
    );
};

export default Home;