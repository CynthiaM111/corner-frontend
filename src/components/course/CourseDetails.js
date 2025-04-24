import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CourseHeader from './CourseHeader';
import CourseSidebar from './CourseSidebar';
import ModuleList from '../module/ModuleList';
import Announcements from '../announcement';
import axios from 'axios';
import TeacherLayout from '../../layouts/TeacherLayout';
import { FaBookOpen, FaBullhorn, FaComments, FaChartBar, FaFileAlt, FaRobot, FaCog, FaHome } from 'react-icons/fa';
import Discussions from '../discussion';

const CourseDetails = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const [course, setCourse] = useState(location.state?.course || null);
    const [loading, setLoading] = useState(!location.state?.course);
    const [activeTab, setActiveTab] = useState('Modules');
    const [user, setUser] = useState(null);
    const courseTabs = [
        { name: 'Home', icon: FaHome },
        { name: 'Modules', icon: FaBookOpen },
        { name: 'AI Assistant', icon: FaRobot },
        { name: 'Assignments', icon: FaFileAlt },
        { name: 'Announcements', icon: FaBullhorn },
        { name: 'Discussions', icon: FaComments },
        { name: 'Grades', icon: FaChartBar },
        { name: 'Settings', icon: FaCog },
    ];
    const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('teacherToken');
                if (!token) {
                   
                    return;
                }
                const response = await axios.get(
                    `${url}/corner/user/get-user-info`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!course) {
            const fetchCourse = async () => {
                try {
                    const response = await axios.get(
                        `${url}/corner/course/get-course/${courseId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('teacherToken')}`,
                            },
                        }
                    );
                    setCourse(response.data.course);
                } catch (error) {
                    console.error('Error fetching course:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCourse();
        }
    }, [courseId, course]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="wflex min-h-screen ">
            <TeacherLayout>
                <div className="flex-1 ml-2">
                    <CourseHeader course={course} />
                    <div className="flex">
                        <CourseSidebar
                            tabs={courseTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                        <div className="flex-1 p-6 ">
                            {activeTab === 'Modules' && (
                                <ModuleList
                                    courseId={course._id}
                                    teacherId={user.role === 'teacher' ? user.userId : null}
                                />
                            )}
                            {activeTab === 'Announcements' && (
                                <Announcements 
                                    courseId={course._id}
                                />
                            )}
                            {activeTab === 'Discussions' && (
                                <Discussions 
                                    courseId={course._id}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </TeacherLayout>
        </div>
    );
};

export default CourseDetails;