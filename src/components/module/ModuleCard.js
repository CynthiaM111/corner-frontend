// ModuleCard.js
import { useState } from 'react';
import ModuleItemList from './ModuleItemList';
import AddContentForm from './AddModuleContentForm';
import axios from 'axios';

export default function ModuleCard({ module, teacherId, onUpdate }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAddContent, setShowAddContent] = useState(false);
    const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    const togglePublish = async () => {
        try {
            await axios.put(`${url}/corner/modules/${module._id}`, {
                isPublished: !module.isPublished
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                },
            });
            onUpdate();
        } catch (err) {
            console.error('Failed to update module', err);
        }
    };
   
    return (
        <div className="bg-gray-100 border border-gray-600  shadow overflow-hidden">
            <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <h3 className="font-medium">{module.title}</h3>
                    {module.isPublished && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            Published
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-4 gap-x-5">
                    {module.teacherId && teacherId === module.teacherId && (
                        <>
                            <button
                                onClick={(e) => {
                                    // e.stopPropagation();
                                    setShowAddContent(!showAddContent);
                                }}
                                className="text-sm font-bold text-rose-700 hover:text-rose-800"
                            >
                                {showAddContent ? 'Cancel' : '+ Content'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePublish();
                                }}
                                className={`text-sm px-2 py-1 rounded ${module.isPublished
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                            >
                                {module.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t">
                    {showAddContent && teacherId === module.teacherId && (
                        <AddContentForm
                            moduleId={module._id}
                            onSuccess={() => {
                                setShowAddContent(false);
                                onUpdate();
                            }}
                        />
                    )}
                    <ModuleItemList
                        moduleId={module._id}
                        teacherId={teacherId}
                    />
                </div>
            )}
        </div>
    );
}