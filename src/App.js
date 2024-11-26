import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/login';
import TeacherDashboard from './pages/teacherDashboard';
import StudentCourseSelection from './student/studentCourseSelection';
import StudentDashboard from './components/studentDashboard';
import CourseDetails from './components/courseDetails';
import Home from './components/home';
import useAutoLogout from './hooks/autoLogout';
import LogoutButton from './components/logoutButton';

function App() {
    useAutoLogout();
    const [role, setRole] = useState('');
    const [user, setUser] = useState(null); // Store the logged-in user data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const teacherToken = localStorage.getItem('teacherToken');
        const studentToken = localStorage.getItem('studentToken');

        if (teacherToken) {
            const decodedToken = JSON.parse(atob(teacherToken.split('.')[1]));
            setRole(decodedToken.role);
            setUser(decodedToken); // Save the decoded user data
        } else if (studentToken) {
            const decodedToken = JSON.parse(atob(studentToken.split('.')[1]));
            setRole(decodedToken.role);
            setUser(decodedToken);
        }

        setLoading(false); // Set loading to false after the role and user are set
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            {/* <div>
                <LogoutButton />
            </div> */}
            <Routes>
                <Route
                    path="/"
                    element={
                        !role ? (
                            <Login />
                        ) : role === 'teacher' ? (
                            <TeacherDashboard />
                        ) : (
                            <StudentCourseSelection />
                        )
                    }
                />
                <Route exact path="/home" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<LogoutButton />} />
                <Route path="/add-course" element={<TeacherDashboard />} />
                <Route path="/select-course" element={<StudentCourseSelection />} />
                <Route path="/student-dashboard"
                    element={role === 'student' ? <StudentDashboard /> : <Login />}
                />
                <Route path="/teacher-dashboard"
                    element={role === 'teacher' ? <TeacherDashboard /> : <Login />}
                />
                <Route path="/courses/:courseId" element={<CourseDetails />} /> {/* Course Details */}


            </Routes>
        </Router>
    );
}

export default App;
