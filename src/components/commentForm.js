import React, { useState } from 'react';
import axios from 'axios';


const AddComment = ({ questionId, onCommentAdded }) => {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken');

    const getUserId = () => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken._id;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/question/${questionId}/comments`,
                { text: comment  },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newComment = response.data.question.comments;
            onCommentAdded(newComment); // Update the parent with new data
            console.log(newComment);
            setComment('');
        } catch (error) {
            setError('Failed to add comment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="form-control mb-2"
            />
            <button type="submit" className="btn btn-outline-primary btn-sm">Add Comment</button>
            {error && <p className="text-danger mt-2" >{error}</p>}
        </form>
    );
};

export default AddComment;
