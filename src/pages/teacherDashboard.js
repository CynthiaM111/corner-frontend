// src/pages/TeacherDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Sidebar from '../components/sidebar';
import CourseCard from '../components/course/CourseCard';
import AccountModal from '../utils/accountModal';
import TeacherLayout from '../layouts/TeacherLayout';
import '../styles/teacherdash.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
  
    const [message, setMessage] = useState('');
    const [accountModalVisible, setAccountModalVisible] = useState(false);
    const [user, setUser] = useState({});
    const token = localStorage.getItem('teacherToken')||localStorage.getItem('studentToken');

    const getTeacherId = () => {
        const token = localStorage.getItem('teacherToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.userId;
        }
        return null;
    };
  
    
    const fetchCourses = useCallback(async () => {
        try {
            
            
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/get-teacher-courses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
console.log("Fetched courses: ", response.data.courses);
setCourses(response.data.courses);
            // const sortedCourses = response.data.courses
            //     .filter(course => !isNaN(new Date(course.createdAt).getTime()))
            //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // setCourses(sortedCourses);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Failed to load courses.'+error.message);
        }
    }, [token]);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/user/get-user-info`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Replace with your token retrieval logic
                },
            });
            const userInfo = response.data;
            setUser(userInfo);
            console.log('User info fetched:', userInfo);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchUserInfo();
    }, [fetchCourses, fetchUserInfo]);

    const handleAddCourse = async () => {
        try {
            const teacherId = getTeacherId();

            const token = localStorage.getItem('teacherToken');
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}/corner/course/add-course`,
                { name: courseName, teacherId, description: courseDescription },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Course added successfully!');
            fetchCourses();
            setCourseName('');
            setCourseDescription('');
           
        } catch (error) {
            setMessage('Failed to add course.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('teacherToken');
        // localStorage.removeItem('studentToken');
        navigate('/');
    };
        
        return (

            <TeacherLayout>
                <div className="w-full p-4">
                    {/* Reduced padding from p-6 to p-4 for tighter layout */}
                    {/* Clean Header */}
                    <div className="border-b border-gray-200 pb-3 mb-4 w-full">
                        {/* Reduced pb-4 to pb-3 and mb-6 to mb-4 for less vertical spacing */}
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    </div>

                    <div className="flex h-screen bg-gray-100">
                        <div className="flex-1 p-5 overflow-y-auto">
                            {/* Add Course Section */}
                            <div className="p-5 bg-gray-100 rounded shadow-sm mb-6 bg-white">
                                <h4 className="mb-4 text-lg font-semibold">Add a New Course</h4>
                                <div className="flex flex-col md:flex-row md:items-start gap-4 w-full">
                                    <input
                                        type="text"
                                        className="min-w-[250px] h-10 px-3 border border-gray-300 rounded-md flex-grow"
                                        placeholder="Course Name"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                    />
                                    <textarea
                                        className="min-w-[250px] h-10 px-3 border border-gray-300 rounded-md flex-grow resize-none"
                                        placeholder="Course Description"
                                        rows={3}
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                    />
                                    <button
                                        className="min-w-[150px] h-10 px-5 bg-rose-700 text-white font-bold rounded-md hover:bg-rose-800"
                                        onClick={handleAddCourse}
                                    >
                                        Add Course
                                    </button>
                                </div>
                            </div>

                            {/* Success Message */}
                            {message && (
                                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded relative">
                                    <strong>{message}</strong>
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-green-800"
                                        aria-label="Close"
                                        onClick={() => setMessage('')}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* Your Courses */}
                            <h4 className="mb-4 text-lg text-rose-700 font-semibold ">Your Courses</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map((course) => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Account Modal */}
                    <AccountModal
                        accountModalVisible={accountModalVisible}
                        setAccountModalVisible={setAccountModalVisible}
                        user={user}
                        onLogout={handleLogout}
                    />
                </div>
            </TeacherLayout>
        );
};

export default TeacherDashboard;