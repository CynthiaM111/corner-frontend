import { FaPlus, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import AddModuleForm from '../module/AddModuleForm';
import { useState } from 'react';

const CourseModules = ({ courseId, teacherId }) => {
    const [showAddModuleForm, setShowAddModuleForm] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };
  

    return (
        <div className="space-y-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-500">Course Modules</h2>
            <button
                className="flex items-center font-bold px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ backgroundColor: '#b91c1c' }}
                onClick={() => {
                    setShowAddModuleForm(true);
                }}
            >
                <FaPlus className="mr-2 ml-2" /> Add Module
            </button>

            {showAddModuleForm && (
                <AddModuleForm
                    courseId={courseId}
                    onSuccess={() => setShowAddModuleForm(false)}
                    teacherId={teacherId}
                />
            )}

            {modules.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No modules created yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {modules.map(module => (
                        <div key={module.id} className="bg-white rounded-lg shadow overflow-hidden">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="flex items-center">
                                    {expandedModules[module.id] ? (
                                        <FaChevronDown className="text-gray-500 mr-3" />
                                    ) : (
                                        <FaChevronRight className="text-gray-500 mr-3" />
                                    )}
                                    <h3 className="font-medium">{module.title}</h3>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(module.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {expandedModules[module.id] && (
                                <div className="p-4 border-t">
                                    {/* Module content will go here */}
                                    <p className="text-gray-500 text-sm">Module content coming soon</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseModules;