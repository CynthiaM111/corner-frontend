// EditItemForm.js
import { useState, useEffect } from 'react';

export default function EditItemForm({ item, onSuccess, onCancel }) {
    const [title, setTitle] = useState(item.title);
    const [content, setContent] = useState(item.content?.text || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTitle(item.title);
        setContent(item.content?.text || '');
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/module-items/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                },
                body: JSON.stringify({
                    title,
                    ...(item.type === 'text' && { textContent: content })
                })
            });

            if (res.ok) {
                onSuccess();
            }
        } catch (err) {
            console.error('Failed to update item', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />

            {item.type === 'text' && (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded min-h-[150px]"
                    required
                />
            )}

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}