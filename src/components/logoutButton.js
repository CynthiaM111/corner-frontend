// src/components/LogoutButton.js
import React from 'react';
import '../styles/logoutbtn.css';
const LogoutButton = () => {
    // Check if the user is logged in (either student or teacher token)
    const isLoggedIn = localStorage.getItem('teacherToken') || localStorage.getItem('studentToken');

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('studentToken');

        // Redirect to the login page
        window.location.href = '/login';
    };

    if (!isLoggedIn) return null;  // Don't show button if not logged in

    return (
        <button className="logout-button" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
