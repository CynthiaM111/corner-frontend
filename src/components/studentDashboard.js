import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');

    const getStudentId = () => {
        const token = localStorage.getItem('studentToken');
        
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            console.log(decodedToken);
            return decodedToken._id;
        
        }
        return null;
    };

    const fetchSelectedCourses = useCallback(async () => {
        try {
            const token = localStorage.getItem('studentToken');
            const studentId = getStudentId();
            console.log("studentId", studentId);

            try {
                const response = await axios.get(`http://localhost:5001/corner/course/get-courses/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token
                    },
                });
                console.log("response.data", response.data);
                setCourses(response.data.courses);
                console.log("courses", courses);
            } catch (error) {
                setMessage('Failed to load selected courses.');
            }
        } catch (error) {
            setMessage('Failed to load selected courses.');
        }
    }, []);

    useEffect(() => {
        fetchSelectedCourses();
    }, [fetchSelectedCourses]);

    const handleCourseSelection = () => {
        console.log('Course selection clicked');
    };

    return (
        <div>
            <h3>Your Selected Courses</h3>
            
            <button onClick={handleCourseSelection}>Select Courses</button>
            {message && <p>{message}</p>}
            <h4>Courses</h4>
            <ul>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <li key={course._id}>
                            {course.name} - {course.teacherId?.name || 'No teacher assigned'}
                        </li>
                    ))
                ) : (
                   <p>No courses selected.</p>
                )}
            </ul>
        </div>
    );
};

export default StudentDashboard;
