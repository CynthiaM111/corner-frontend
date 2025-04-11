// src/layouts/TeacherLayout.js
import React from 'react';
import { FaBookOpen, FaUsers, FaCog, FaHome } from 'react-icons/fa';
import Link from 'next/link';
const TeacherLayout = ({ children }) => {
    const menuItems = [
        { name: 'Dashboard', icon: FaHome, path: '/teacher-dashboard' },
        { name: 'Courses', icon: FaBookOpen, path: '/teacher-courses' },
        { name: 'Students', icon: FaUsers, path: '/teacher-students' },
        { name: 'Settings', icon: FaCog, path: '/teacher-settings' },
      ];
    return (
        <div className="flex min-h-screen bg-gray-50 fixed">
            {/* Main Sidebar - This appears on all teacher pages */}
            <div className="w-52 h-screen bg-white border-r border-gray-200 fixed">
                {/* Logo Section */}
                <div className="p-4 mb-0 flex items-center justify-center">
                    <img
                        src="/favicon.ico"
                        alt="Company Logo"
                        className="h-10 object-contain"
                    />
                    <h1 className="text-2xl font-bold ml-2 text-blue-900">Corner</h1>
                </div>

                {/* Main Menu Items */}
                <nav className="mt-0 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.name} className="p-2 rounded-md hover:bg-gray-100 cursor-pointer ">
                            <Link href={item.path}>
                                <div className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                    <item.icon className="mr-2" />
                                    {item.name}
                                </div>
                            </Link>
                            {/* ... your existing menu item code ... */}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-52">
                {children}
            </div>
        </div>
    );
};

export default TeacherLayout;