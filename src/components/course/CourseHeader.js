const CourseHeader = ({ course }) => (
    <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{course.code} • {course.term}</p>
        </div>
    </div>
);

export default CourseHeader;