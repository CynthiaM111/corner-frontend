import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/courses/${course._id}`, { state: { course } });
    };

    return (
        <div className="col-md-4 mb-4">
            <div
                className="card h-100 cursor-pointer hover-shadow"
                onClick={handleClick}
            >
                <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text text-muted">{course.description}</p>
                </div>
                <div className="card-footer bg-transparent">
                    <small className="text-muted">
                        Created: {new Date(course.createdAt).toLocaleDateString()}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;