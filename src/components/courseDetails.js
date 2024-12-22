import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AddComment from './commentForm';
import DOMPurify from 'dompurify';
import QuestionModal from '../utils/questionModal';
import logo from '../images/favicon-96x96.png';

const socket = io(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}`);

const CourseDetails = ({fetchUserInfo,setAccountModalVisible}) => {
    const navigate = useNavigate();
    const { courseId } = useParams(); // Get courseId from route parameters
    const [course, setCourse] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionContent, setQuestionContent] = useState('');
    const [questionTitle, setQuestionTitle] = useState('');
    const [error, setError] = useState('');
    // const [message, setMessage] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken'); // Assuming token is stored in localStorage

    // Fetch course details and questions

    useEffect(() => {
        
        if (token) {
            setIsStudent(token.includes('studentToken'));
            setIsTeacher(token.includes('teacherToken'));
        }
    }, [token]);
    useEffect(() => {
        const fetchCourseAndQuestions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/get-course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.data;
                if (response.status === 200) {
                    setCourse(data.course);
                    setQuestions(data.questions);
                } else {
                    setError(data.msg || 'Failed to fetch course details');
                }
            } catch (err) {
                console.error('Error fetching course and questions:', err);
                setError('Error fetching course and questions');
            }
        };

        fetchCourseAndQuestions();
        socket.emit('joinCourseRoom', courseId);
        socket.on('newQuestion',(newQuestion)=>{
            setQuestions((prevQuestions)=>
                prevQuestions.some((question)=>question._id===newQuestion._id)?prevQuestions:[newQuestion,...prevQuestions]);
        });

        socket.on('newComment',({questionId,updatedComments})=>{
            setQuestions((prevQuestions)=>prevQuestions.map((question)=>question._id===questionId?{...question,comments:updatedComments}:question));
        });

        return () => {
            socket.emit('leaveCourseRoom',courseId);
            socket.off('newQuestion');
            socket.off('newComment');
        };
    }, [courseId, token]);
    
    // Handle adding a new question
    const getUserId = () => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken._id;
    };
    console.log("user id: ", getUserId());
    
    const handleAddQuestion = async (e) => {
        e.preventDefault();

        if (!questionContent || !questionTitle) return;

        try {
            
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/corner/course/question/add`, {
                courseId,
                content: questionContent,
                title: questionTitle,
                createdBy: getUserId()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.data;

            if (response.status === 201) {
                socket.emit('questionAdded',data.question);
                // setQuestions((prev) => [data.question,...prev]);
                setQuestionContent(''); // Clear input field
                setQuestionTitle(''); // Clear input field
                setShowModal(false);
            } else {
                setError(data.msg || 'Failed to add question');
            }
        } catch (err) {
            console.error('Error adding question:', err);
            setError('Error adding question');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('teacherToken');
        navigate('/');
    };

    const timeAgo = (timestamp) => {
        const now = new Date();
        const timeDiff = now - new Date(timestamp);
        const minutes = Math.floor(timeDiff / 1000 / 60);
        const hours = Math.floor(timeDiff / 1000 / 60 / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar ">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={logo} alt="Corner Discussion" className="logo" />
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
                            onClick={() => {handleLogout()
                                // fetchUserInfo();
                                // setAccountModalVisible(true);
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        <div className="container mt-5">
            {/* Bootstrap Navbar */}
            

            {/* Course Header */}
            <div className="text-center mb-4">
                {/* <h1 className="display-4">Course Discussion</h1> */}
                {course && <h2 className="display-6 text-muted mt-3 font-weight-bold">{course.name}</h2>}
            </div>

            {/* Questions Section */}
            <div className=" mb-3">
                <h3 className="display-6 mb-3">Questions</h3>
                <div className="text-end mb-3">
                    <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>Add Question</button>    
                </div>
            </div>

            {/* Questions Display */}
            {questions.length > 0 ? (
                questions.map((question,index) => {
                    const uniqueKey = `${question._id}-${index}`;
                    const isAnswered = question.comments.some((comment) => comment.author?.role === 'teacher');
                    return (
                    <div key={uniqueKey} className="card mb-3 shadow-sm" >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 card-title">{question.title}</h5>
                                <div>
                                    {isAnswered && (<span className="badge bg-success custom-badge me-2">Answered</span>)}
                                    <span className="badge  custom-badge"
                                    style={{
                                        backgroundColor: question.createdBy?.role === 'teacher' ? '#ffc107' : '#6c757d',
                                        color: question.createdBy?.role === 'teacher' ? '#212529' : 'white',
                                    }}>{question.createdBy?.role || 'Unknown'}</span>
                                    </div>
                                </div>
                            <p className="text-muted small" style={{fontSize: '0.9rem'}}>By {question.createdBy?.name || 'Anonymous'} - {timeAgo(question.createdAt)}</p>
                            <p className="mb-3 card-text">{question.content}</p>
                            <AddComment
                                questionId={question._id}
                                token={token}
                                onCommentAdded={(updatedComments) => {
                                    socket.emit('commentAdded',{questionId:question._id,updatedComments});
                                    setQuestions((prevQuestions) =>
                                        prevQuestions.map((q) =>
                                            q._id === question._id ? { ...q, comments:updatedComments } : q
                                        )
                                    );
                                }}
                            />
                            {/* Comments Section */}
                            <div className="mt-3">
                                <h6 className="display-6 text-muted">Comments({question.comments.length})</h6>
                                {question.comments.length > 0 ? (
                                    <ul className="list-unstyled mt-2">
                                        {question.comments
                                        
                                        .map((comment) => (
                                            <li key={comment._id} className="mb-3 comment-item" >
                                                <p className="mb-1" >
                                                    {comment.author?.role === 'teacher' && (<span className="badge bg-danger custom-badge me-2">[Teacher]</span>)}
                                                    <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text) }}></span>
                                                    <span className="text-muted small ms-2">
                                                        - {comment.author?.name || 'Anonymous'} ({timeAgo(comment.timestamp)})
                                                    </span>
                                                    
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No answers yet. Be the first to answer!</p>
                                )}
                            </div>
                        </div>
                    </div>
                    )
                })
                ) : (
                    <p>No questions yet. Be the first to ask!</p>
                )}

            {/* Modal for Adding Question */}
            <QuestionModal
                showModal={showModal}
                setShowModal={setShowModal}
                handleAddQuestion={handleAddQuestion}
                questionTitle={questionTitle}
                setQuestionTitle={setQuestionTitle}
                questionContent={questionContent}
                setQuestionContent={setQuestionContent}
            />
        </div>
        </>
    );
};

export default CourseDetails;
