const CourseHeader = ({ course }) => (
    <div className="bg-gray-100 ">
        <div className="w-full flex justify-between items-center mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="!text-rose-700">{course.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{course.code} • {course.term}</p>
        </div>
    </div>
);

export default CourseHeader;