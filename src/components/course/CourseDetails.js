import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CourseHeader from './CourseHeader';
import CourseSidebar from './CourseSidebar';
import CourseModules from './CourseModules';
import axios from 'axios';
import TeacherLayout from '../../layouts/TeacherLayout';
import { FaBookOpen, FaBullhorn, FaComments, FaChartBar, FaFileAlt, FaRobot, FaCog, FaHome } from 'react-icons/fa';
const CourseDetails = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const [course, setCourse] = useState(location.state?.course || null);
    const [loading, setLoading] = useState(!location.state?.course);
    const [activeTab, setActiveTab] = useState('Modules');
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


    useEffect(() => {
        if (!course) {
            const fetchCourse = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001'}/corner/course/get-course/${courseId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('teacherToken')}`,
                            },
                        }
                    );
                    setCourse(response.data.course);
                } catch (error) {
                    console.error('Error fetching course:', error);
                    // Handle error (maybe redirect)
                } finally {
                    setLoading(false);
                }
            };
            fetchCourse();
        }
    }, [courseId, course]);

    if (loading) {
        return <div>Loading course details...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <TeacherLayout>

                {/* Course Content */}
                <div className="flex-1 ml-52">
                    <CourseHeader course={course} />

                    <div className="flex">
                        {/* Course-specific sidebar */}
                        <CourseSidebar
                            tabs={courseTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        {/* Main content area */}
                        <div className="flex-1 p-6">
                            {activeTab === 'Modules' && (
                                <CourseModules courseId={course.id} />
                            )}
                            {/* We'll add other tabs later */}
                        </div>
                    </div>
                </div>
            </TeacherLayout>
        </div>

  );
};

export default CourseDetails;