import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/student.css';
// import AccountModal from '../utils/accountModal';

const StudentCourseSelection = () => {
    
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const navigate = useNavigate();
    const [accountModalVisible, setAccountModalVisible] = useState(false);
    const [user, setUser] = useState({});

    // Get student ID from the token
    const getStudentId = () => {
        const token = localStorage.getItem('studentToken');

        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken._id;
        }
        return null;
    };

    // Load enrolled courses from localStorage
    const loadEnrolledCourses = () => {
        return JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    };


    // Fetch all available courses when the component is mounted
    useEffect(() => {
        setEnrolledCourses(loadEnrolledCourses());
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/get-all-courses`);
                setCourses(response.data.courses);
            } catch (error) {
                setMessage('Failed to load courses.');
            }
        };

        fetchCourses();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('studentToken');
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/user/get-user-info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data.user); // Assuming the response data has the user info
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            setMessage('Failed to load user info');
        }
    };

    // Handle course selection (enroll or remove)
    const handleCourseSelection = (courseId) => {
        setSelectedCourses((prevSelectedCourses) => {
            if (prevSelectedCourses.includes(courseId)) {
                return prevSelectedCourses.filter(id => id !== courseId); // Deselect if already selected
            } else {
                return [...prevSelectedCourses, courseId]; // Add to selected if not selected
            }
        });
    };

    // Handle submitting the selected courses for enrollment
    const handleSubmit = async (e) => {
        e.preventDefault();
        const studentId = getStudentId();
        const courseIds = selectedCourses;

        if (!studentId) {
            setMessage('Student ID not found. Please log in again.');
            return;
        }

        try {
            const token = localStorage.getItem('studentToken');
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/enroll-in-courses`,
                { studentId: studentId, courses: courseIds },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Courses enrolled successfully!');
                // Update the enrolled courses state
                const updatedEnrolledCourses = [...enrolledCourses, ...selectedCourses];
                setEnrolledCourses(updatedEnrolledCourses);
                setSelectedCourses([]); // Clear selected courses

                // Save the updated list of enrolled courses to localStorage
                localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));
            }
        } catch (error) {
            setMessage('Failed to enroll in courses. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        navigate('/home');
    };
    

    // Render content based on the active tab
    const renderContent = () => {
        if (activeTab === 'Dashboard') {
            return (
                <div>
                    <h3>My Enrolled Courses</h3>
                    <ul className="list-group">
                        {enrolledCourses.length > 0 ? (
                            enrolledCourses.map((courseId) => {
                                const course = courses.find((c) => c._id === courseId);
                                return (
                                    course && (
                                        <li key={courseId} className="list-group-item d-flex justify-content-between">
                                            <span>{course.name} - {course.teacherId?.name || 'No teacher assigned'}</span>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => navigate(`/courses/${courseId}`)}
                                            >
                                                View Course
                                            </button>
                                        </li>
                                    )
                                );
                            })
                        ) : (
                            <p>No enrolled courses yet.</p>
                        )}
                    </ul>
                </div>
            );
        } else if (activeTab === 'Courses') {
            return (
                <div>
                    <h3>Available Courses</h3>
                    {selectedCourses.length > 0 && (
                        <button className="btn btn-primary mb-3" onClick={handleSubmit}>
                            Confirm Enrollment
                        </button>
                    )}
                    <ul className="list-group">
                        {courses.map((course) => (
                            <li key={course._id} className="list-group-item d-flex justify-content-between">
                                <span>{course.name} - {course.teacherId?.name || 'No teacher assigned'}</span>
                                {enrolledCourses.includes(course._id) ? (
                                    <button className="btn btn-success btn-sm" disabled>
                                        Enrolled
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleCourseSelection(course._id)}
                                    >
                                        {selectedCourses.includes(course._id) ? 'Remove' : 'Enroll'}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else if (activeTab === 'Account') {
            return (
                <div>
                <button
                    onClick={() => {
                        fetchUserInfo();
                        setAccountModalVisible(true);
                        }}
                    className="btn btn-primary"
                    >
                        Manage yourAccount
                        
                    </button>
                

                { accountModalVisible && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Account Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setAccountModalVisible(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {user && user.name && user.role ? (
                                        <>
                                            <p>
                                                <strong>Name:</strong> {user.name}
                                            </p>
                                            <p>
                                                <strong>Role:</strong> {user.role}
                                            </p>
                                        </>
                                    ) : (
                                        <p>Loading user details...</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setAccountModalVisible(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div>
            {/* Bootstrap Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark custom-navbar mb-4">
                <div className="container">
                    <a className="navbar-brand" href="#">Student Portal</a>
                    <div className="navbar-nav">
                        <a
                            className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('Dashboard')}
                        >
                            Dashboard
                        </a>
                        <a
                            className={`nav-link ${activeTab === 'Courses' ? 'active' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('Courses')}
                        >
                            Courses
                        </a>
                        <a
                            className={`nav-link ${activeTab === 'Account' ? 'active' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('Account')}
                        >
                            Account
                        </a>
                    </div>
                </div>
            </nav>

            {/* Render content based on active tab */}
            <div className="container">
                {renderContent()}
                {message && (
                    <div className="alert alert-info mt-3 alert-dismissible fade show" role="alert">
                        {message}
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            onClick={() => setMessage('')}
                            aria-label="Close"></button>
                    </div>
                )}
            </div>
            
        </div>
        
    );
};

export default StudentCourseSelection;