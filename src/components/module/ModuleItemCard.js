// ModuleItemCard.js
import { useState } from 'react';
import axios from 'axios';
import EditItemForm from './EditItemForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ModuleItemCard({ item, teacherId, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    
    const handleDelete = async () => {
        try {
            await axios.delete(`${url}/corner/module-items/${item._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                }
            });
            onDelete();
        } catch (err) {
            console.error('Failed to delete item', err);
        }
    };

    const togglePublish = async () => {
        try {
            await axios.put(`${url}/corner/module-items/${item._id}`, {
                isPublished: !item.isPublished
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                },
            });
            onUpdate();
        } catch (err) {
            console.error('Failed to update item', err);
        }
    };

    return (
        <div className="p-4 hover:bg-gray-50">
            {isEditing ? (
                <EditItemForm
                    item={item}
                    onCancel={() => setIsEditing(false)}
                    onSuccess={() => {
                        setIsEditing(false);
                        onUpdate();
                    }}
                />
            ) : (
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-medium">{item.title}</h4>
                        {item.type === 'text' && (
                            <p className="text-gray-600 mt-1">{item.content?.text || 'No text content'}</p>
                        )}
                        {item.type === 'document' && (
                            <a
                                href={item.file.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rose-600 hover:underline mt-1 inline-block"
                            >
                                Download File {item.file.originalname}
                            </a>
                        )}
                        {item.type === 'link' && (
                            <a
                                href={item.content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rose-600 hover:underline"
                            >
                            {item.title || item.content.url}
                        </a>
                    )}
                    </div>

                    {teacherId && (
                        <div className="flex space-x-2 gap-x-5">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                <FaEdit className="text-gray-600 hover:text-gray-800 size-5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                <FaTrash className="text-gray-600 hover:text-gray-800 size-5" />
                            </button>
                            <button
                                onClick={togglePublish}
                                className={`text-sm px-2 py-1 rounded ${item.isPublished
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                            >
                                {item.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}