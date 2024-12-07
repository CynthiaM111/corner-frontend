import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Quill from 'quill';
import DOMPurify from 'dompurify';
import 'quill/dist/quill.snow.css';
import '../styles/comment.css';

const AddComment = ({ questionId, onCommentAdded }) => {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const quillRef = useRef(null);
    const quillInstance = useRef(null);
    const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken');

    useEffect(() => {
        if (!quillInstance.current && quillRef.current) {
            // Initialize Quill only if ref is set
            quillInstance.current = new Quill(quillRef.current, {
                theme: 'snow', // Use the Snow theme
                placeholder: 'Write your comment...',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'], // Formatting options
                        [{ list: 'ordered' }, { list: 'bullet' }], // Lists
                        ['link', 'image'], // Link and image
                    ],
                },
            });
        }
    }, []);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const quill= quillInstance.current;
        const rawHTML = quill.root.innerHTML.trim();
        const sanitizedHTML = DOMPurify.sanitize(rawHTML);

        if (!sanitizedHTML || sanitizedHTML === '<p><br></p>') {
            setError('Comment cannot be empty');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/question/${questionId}/comments`,
                { text: sanitizedHTML  },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newComment = response.data.question.comments;
            onCommentAdded(newComment); // Update the parent with new data
            quill.setContents([])
            setComment('');
        } catch (error) {
            setError('Failed to add comment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div
                ref={quillRef}
                className="quill-editor mb-2"
                style={{ width: '100%', minHeight: '150px', border: '1px solid #ccc' }}
            ></div>
            <button type="submit" className="btn btn-primary btn-sm w-auto">
                Add Comment
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
        </form>
    );
};

export default AddComment;
