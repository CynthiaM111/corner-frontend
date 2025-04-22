// src/layouts/TeacherLayout.js
import React from 'react';
import { FaBookOpen, FaUsers, FaCog, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { useNavigate } from 'react-router-dom';


// import { useRouter } from 'next/router';
import { useLocation } from 'react-router-dom';
const TeacherLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Dashboard', icon: FaHome, path: '/teacher-dashboard' },
        { name: 'Courses', icon: FaBookOpen, path: '/teacher-courses' },
        { name: 'Students', icon: FaUsers, path: '/teacher-students' },
        { name: 'Settings', icon: FaCog, path: '/teacher-settings' },
    ];
    const handleLogout = () => {
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('studentToken');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-56 h-screen bg-white border-r border-gray-200 fixed shadow-md">
                {/* Logo */}
                <div className="flex items-center justify-center p-6 border-b border-gray-100">
                    <img
                        src="/favicon.ico"
                        alt="Company Logo"
                        className="h-8 w-8 object-contain"
                    />
                    <h1 className="text-xl font-extrabold text-rose-700 ml-2">Corner</h1>
                </div>

                {/* Menu Buttons */}
                <nav className="mt-4 flex flex-col gap-2 px-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                href={item.path}
                                key={item.name}
                                className="!no-underline w-full"
                            >
                                <button
                                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${isActive
                                            ? 'bg-rose-700 text-white shadow'
                                            : 'bg-gray-100 text-gray-700 hover:bg-rose-100 hover:text-rose-700'
                                        }`}
                                >
                                    <item.icon
                                        className={`text-base ${isActive ? 'text-white' : 'text-rose-700'}`}
                                    />
                                    {item.name}
                                </button>
                            </Link>
                        );
                    })}
                </nav>
                <button onClick={handleLogout} className="mt-4 w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-rose-100">Logout</button>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-56 p-6">
                {children}
            </div>
        </div>
    );
};

export default TeacherLayout;
