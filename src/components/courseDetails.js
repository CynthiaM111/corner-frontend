import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AddComment from './commentForm';
import DOMPurify from 'dompurify';
import QuestionModal from '../utils/questionModal';
import Announcements from './announcement';
import logo from '../images/favicon-96x96.png';
import ModuleModal from '../utils/moduleModal';
import Modules from './module';
import { FaBook, FaBell, FaComments, FaGraduationCap, FaFileAlt, FaCog } from 'react-icons/fa';
const socket = io(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}`);

const CourseDetails = ({ fetchUserInfo, setAccountModalVisible }) => {
    const navigate = useNavigate();
    const { courseId } = useParams(); // Get courseId from route parameters
    const [course, setCourse] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionContent, setQuestionContent] = useState('');
    const [questionTitle, setQuestionTitle] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState('');
    // const [message, setMessage] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [user, setUser] = useState({});
    const [userRole, setUserRole] = useState('student');
    const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken'); // Assuming token is stored in localStorage
    const [modules, setModules] = useState([]);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [newModuleName, setNewModuleName] = useState('');
    const [activeTab, setActiveTab] = useState('modules');

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
        socket.on('newQuestion', (newQuestion) => {
            setQuestions((prevQuestions) =>
                prevQuestions.some((question) => question._id === newQuestion._id) ? prevQuestions : [newQuestion, ...prevQuestions]);
        });

        socket.on('newComment', ({ questionId, updatedComments }) => {
            setQuestions((prevQuestions) => prevQuestions.map((question) => question._id === questionId ? { ...question, comments: updatedComments } : question));
        });
        // socket.on('newAnnouncement',(newAnnouncement)=>{
        //     setAnnouncements((prev) => [newAnnouncement, ...prev]);
        // });

        return () => {
            socket.emit('leaveCourseRoom', courseId);
            socket.off('newQuestion');
            socket.off('newComment');
        };
    }, [courseId, token]);

    // Handle adding a new question
    const getUserId = () => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.userId;
    };

    const getsUserRole = () => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.role;
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        if (!questionContent || !questionTitle) return;

        try {

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}/corner/course/question/add`, {
                courseId,
                content: questionContent,
                title: questionTitle,
                createdBy: getUserId(),
                isAnonymous: isAnonymous
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.data;

            if (response.status === 201) {
                socket.emit('questionAdded', data.question);
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

    const handleAddModule = () => {
        if (newModuleName.trim()) {
            setModules((prevModules) => [...prevModules, { id: Date.now(), name: newModuleName, content: [] }]);
            setNewModuleName('');
            setShowModuleModal(false);
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
        <div className="flex">
            {/* Sidebar */}
            <div className="bg-orange-100 border-r border-gray-300 min-w-[90px] h-screen">
                <div className="p-4 flex justify-center ">
                    <img
                        src="/favicon.ico" // Path to your favicon in the public folder
                        alt="Course Menu Favicon"
                        className="w-12 h-12" // Adjust size as needed (e.g., 48x48px)
                    />
                </div>
                <ul className="flex flex-col  h-[calc(100vh-100px)] m-0 p-0 gap-4">
                    {[ {name: 'modules', icon: <FaBook />}, {name: 'announcements', icon: <FaBell />}, {name: 'discussions', icon: <FaComments />}, {name: 'grades', icon: <FaGraduationCap />}, {name: 'assignments', icon: <FaFileAlt />}, {name: 'settings', icon: <FaCog />}].map((tab) => (
                        <li key={tab.name} className={`w-full transition-colors duration-200 relative ${activeTab === tab.name ? 'bg-blue-900' : ''}`}>
                            <button
                                className={`w-full text-center px-8 py-8 ${activeTab === tab.name
                                        ? ' text-white font-medium'
                                        : 'text-blue-900 hover:bg-blue-100 font-semibold'
                                    }`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                {/* Icon above text */}
                                <span className="text-xl mb-1">{tab.icon}</span>
                                <span>{tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main content */}
            <div className="flex-grow p-6">
                <h2 className="text-gray-600 text-2xl font-medium mb-2">{course?.name || 'Course Name'}</h2>
                <hr className="mb-6" />

                {activeTab === 'modules' && (
                    <Modules
                        courseId={courseId}
                        modules={modules}
                        setModules={setModules}
                        showModuleModal={showModuleModal}
                        setShowModuleModal={setShowModuleModal}
                        newModuleName={newModuleName}
                        setNewModuleName={setNewModuleName}
                        handleAddModule={handleAddModule}
                    />
                )}

                {activeTab === 'announcements' && <Announcements courseId={courseId} />}

                {activeTab === 'discussions' && (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Questions</h3>
                        <div className="text-right mb-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                onClick={() => setShowModal(true)}
                            >
                                Add Question
                            </button>
                        </div>
                        {questions.length > 0 ? (
                            questions.map((question, index) => {
                                const uniqueKey = `${question._id}-${index}`;
                                const isAnswered = question.comments.some(c => c.author?.role === 'teacher');
                                return (
                                    <div key={uniqueKey} className="bg-white shadow rounded p-4 mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h5 className="text-lg font-semibold">{question.title}</h5>
                                            <div className="space-x-2">
                                                {isAnswered && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Answered</span>}
                                                <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded">
                                                    {question.createdBy?.role || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            By {question.isAnonymous ? 'Anonymous' : question.createdBy?.name} • {timeAgo(question.createdAt)}
                                        </p>
                                        <p className="mb-4">{question.content}</p>

                                        <AddComment
                                            questionId={question._id}
                                            token={token}
                                            onCommentAdded={(updatedComments) => {
                                                socket.emit('commentAdded', { questionId: question._id, updatedComments });
                                                setQuestions((prev) =>
                                                    prev.map((q) => (q._id === question._id ? { ...q, comments: updatedComments } : q))
                                                );
                                            }}
                                        />

                                        <div className="mt-4">
                                            <h6 className="font-medium mb-2">Comments ({question.comments.length})</h6>
                                            {question.comments.map((comment) => (
                                                <div key={comment._id} className="mb-2 text-sm">
                                                    <p>
                                                        {comment.author?.role === 'teacher' && <strong>[Teacher]</strong>}{' '}
                                                        <span
                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }}
                                                        />
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No questions yet.</p>
                        )}
                    </>
                )}

                {activeTab === 'grades' && <p>Grades section coming soon...</p>}
                {activeTab === 'assignments' && <p>Assignments section coming soon...</p>}
                {activeTab === 'settings' && <p>Settings section coming soon...</p>}
            </div>
        </div>
    );
};

export default CourseDetails;
