// components/CourseForm.js
import React, { useState } from 'react';
import axios from 'axios';

const CourseForm = ({ teacherId }) => {
    const [courseName, setCourseName] = useState('');
    const [message, setMessage] = useState('');

    // Function to get teacher ID from JWT in localStorage
    const getTeacherId = () => {
        const token = localStorage.getItem('teacherToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
            return decodedToken._id; // Assuming the teacher's ID is stored in the '_id' field
        }
        return null;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const teacherId = getTeacherId();
        if (!teacherId) {
            setMessage('Teacher ID not found. Please log in again.');
            return;
        }
        try {
            const response = await axios.post(`${process.env.BASE_URL||process.env.DEV_BASE_URL}/corner/course/add-course`, {
                name: courseName,
                teacherId: teacherId,
            });
            setMessage(response.data.message || 'Course added successfully');
            setCourseName(''); // Clear the form on success
        } catch (error) {
            setMessage('Failed to add course. Please try again.');
        }
    };

    return (
        <div>
            <h3>Add a New Course</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
                <button type="submit">Add Course</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CourseForm;
