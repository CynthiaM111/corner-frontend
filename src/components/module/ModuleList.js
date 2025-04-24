// ModuleList.js
import { useState, useEffect } from 'react';
import ModuleCard from './ModuleCard';
import AddModuleForm from './AddModuleForm';
import axios from 'axios';

export default function ModuleList({ courseId, teacherId }) {
    const [modules, setModules] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    const token = localStorage.getItem('teacherToken');

    const fetchModules = async () => {
        try {
            const res = await axios.get(`${url}/corner/modules/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = res.data;
            setModules(data);
        } catch (err) {
            console.error('Failed to fetch modules', err)
        }
    }

    // Call this on component mount
    useEffect(() => {
        fetchModules();
    }, [courseId]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Course Modules</h2>
                {teacherId && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Module'}
                    </button>
                )}
            </div>

            {showAddForm && (
                <AddModuleForm
                    courseId={courseId}
                    teacherId={teacherId}
                    onSuccess={() => {
                        setShowAddForm(false);
                        fetchModules();
                    }}
                />
            )}

            <div className="space-y-4">
                {modules.map(module => (
                    <ModuleCard
                        key={module._id}
                        module={module}
                        teacherId={teacherId}
                        onUpdate={fetchModules}
                    />
                ))}
            </div>
        </div>
    );
}