// src/pages/TeacherDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Sidebar from '../components/sidebar';
import CourseCard from '../components/courseCard';
import AccountModal from '../utils/accountModal';
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
            return decodedToken._id;
        }
        return null;
    };

    const fetchCourses = useCallback(async () => {
        try {
            const teacherId = getTeacherId();
            const token = localStorage.getItem('teacherToken');
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/get-courses/${teacherId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const sortedCourses = response.data.courses.filter(course => !isNaN(new Date(course.createdAt).getTime()))
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setCourses(sortedCourses);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Failed to load courses.');
        }
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/user/get-user-info`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Replace with your token retrieval logic
                },
            });

            setUser(response.data);
            console.log('User info fetched:', response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleAddCourse = async () => {
        try {
            const teacherId = getTeacherId();
            const token = localStorage.getItem('teacherToken');
            await axios.post(
                `${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/add-course`,
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
        } catch (error) {
            setMessage('Failed to add course.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('teacherToken');
        navigate('/');
    };
        
        return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/teacher-dashboard">
                        Dashboard
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <button
                            className="btn btn-outline-light"
                            onClick={() => {
                                fetchUserInfo();
                                setAccountModalVisible(true);
                            }}
                        >
                            Account
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="teacher-dashboard d-flex" style={{ height: '100vh' }}>
                <div className="main-content p-4 w-100">
                    {/* <h2 className="mb-4">Teacher Dashboard</h2> */}

                    {/* Add Course Section */}
                    <div className="add-course-section p-4 bg-light rounded shadow-sm mb-4">
                        <h4 className="mb-3">Add a New Course</h4>
                        <div className="d-flex flex-column flex-md-row align-items-start w-100">
                            <input
                                type="text"
                                className="form-control mb-3 mb-md-0 mr-md-3"
                                placeholder="Course Name"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                            <textarea
                                className="form-control mb-3 mb-md-0 mr-md-3"
                                placeholder="Course Description"
                                rows={3}
                                value={courseDescription}
                                onChange={(e) => setCourseDescription(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleAddCourse}>
                                Add Course
                            </button>
                        </div>
                    </div>
                    {message && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>{message}</strong>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setMessage('')}
                            ></button>
                        </div>
                    )}

                    <h4 className="mb-3">Your Courses</h4>
                    <div className="row">
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
    );
};

export default TeacherDashboard;