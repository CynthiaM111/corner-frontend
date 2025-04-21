// ModuleItemList.js
import { useState, useEffect } from 'react';
import ModuleItemCard from './ModuleItemCard';
import axios from 'axios';
export default function ModuleItemList({ moduleId, teacherId }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
 

    const fetchItems = async () => {
        try {
            const res = await axios.get(`${url}/corner/module-items/${moduleId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                }
            });
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch items', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [moduleId]);

    if (isLoading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="divide-y">
            {items.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No content added yet
                </div>
            ) : (
                items.map(item => (
                    <ModuleItemCard
                        key={item._id}
                        item={item}
                        teacherId={teacherId}
                        onDelete={fetchItems}
                        onUpdate={fetchItems}
                    />
                ))
            )}
        </div>
    );
}