import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');

    const getStudentId = () => {
        const token = localStorage.getItem('studentToken');
        
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            
            return decodedToken._id;
        
        }
        return null;
    };

    const fetchSelectedCourses = useCallback(async () => {
        try {
            const token = localStorage.getItem('studentToken');
            const studentId = getStudentId();
           
            if(!studentId){
                setMessage('Student not found');
                return;
            }

            
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/get-all-courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token
                    },
                });

            const sortedCourses = response.data.courses
                .filter((course) => !isNaN(new Date(course.createdAt).getTime()))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setCourses(sortedCourses);
                
                
            } catch (error) {
                setMessage('Failed to load selected courses.'+error.message);
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
