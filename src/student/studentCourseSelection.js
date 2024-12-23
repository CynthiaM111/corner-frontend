import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountModal from '../utils/accountModal';
import '../styles/student.css';

const StudentCourseSelection = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const navigate = useNavigate();
    const [accountModalVisible, setAccountModalVisible] = useState(false);
    const [user, setUser] = useState({});
    const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken');
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5001';

    // Function to fetch and set user details
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${baseUrl}/corner/user/get-user-info`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            console.log("user: ", response.data.user);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            setMessage('Failed to load user info.');
        }
    };

    // Load enrolled courses from localStorage
    const loadEnrolledCourses = () => {
        return JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    };

    // Fetch courses on component mount
    useEffect(() => {
        setEnrolledCourses(loadEnrolledCourses());

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseUrl}/corner/course/get-student-courses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourses(response.data.courses);
            } catch (error) {
                setMessage(`Failed to load courses. ${error.message}`);
            }
        };

        fetchCourses();
        
        fetchUserInfo();
    }, [token]);

    // Handle course selection (enroll or remove)
    const handleCourseSelection = (courseId) => {
        setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.includes(courseId)
                ? prevSelectedCourses.filter((id) => id !== courseId)
                : [...prevSelectedCourses, courseId]
        );
    };

    // Handle submitting the selected courses for enrollment
    const handleSubmit = async (e) => {
        e.preventDefault();
        const studentId = user?._id;

        // if (!studentId) {
        //     setMessage('Student ID not found. Please log in again.');
        //     return;
        // }

        try {
            const response = await axios.post(
                `${baseUrl}/corner/course/enroll-in-courses`,
                { studentId, courses: selectedCourses },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setMessage('Courses enrolled successfully!');
                const updatedEnrolledCourses = [...enrolledCourses, ...selectedCourses];
                setEnrolledCourses(updatedEnrolledCourses);
                setSelectedCourses([]);
                localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));
            }
        } catch (error) {
            setMessage('Failed to enroll in courses. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        navigate('/');
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
        } 
        return null;
    };
        

    return (
        <div>
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
                            className={`nav-link` }
                            href="#"
                            onClick={() =>{
                                fetchUserInfo();setAccountModalVisible(true)}}
                        >
                            Account
                        </a>
                    </div>
                </div>
            </nav>

            <div className="container">
                {renderContent()}
                {message && (
                    <div className="alert alert-info mt-3" role="alert">
                        {message}
                    </div>
                )}
            </div>
           
            {accountModalVisible && (
                <AccountModal
                    accountModalVisible={accountModalVisible}
                    setAccountModalVisible={setAccountModalVisible}
                    user={user}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default StudentCourseSelection;
