// src/components/CourseCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/coursecard.css';

const CourseCard = ({ course }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">{course.description ? course.description.substring(0, 100) : 'No description available'}</p>
                    <Link to={`/courses/${course._id}`} className="btn btn-primary course-card-button">
                        View Course
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
