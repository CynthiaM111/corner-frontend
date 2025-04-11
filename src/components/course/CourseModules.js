import { useState } from 'react';
import { FaPlus, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const CourseModules = ({ courseId }) => {
    const [modules, setModules] = useState([]);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [expandedModules, setExpandedModules] = useState({});

    const handleCreateModule = () => {
        if (!newModuleTitle.trim()) return;

        const newModule = {
            id: Date.now().toString(),
            title: newModuleTitle,
            items: [],
            createdAt: new Date().toISOString(),
        };

        setModules([...modules, newModule]);
        setNewModuleTitle('');
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Course Modules</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Module title"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCreateModule}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FaPlus className="inline mr-1" /> Add Module
                    </button>
                </div>
            </div>

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