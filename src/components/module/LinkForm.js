// LinkForm.js
import { useState } from 'react';

export default function LinkForm({ moduleId, onSuccess }) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/module-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                },
                body: JSON.stringify({
                    moduleId,
                    title,
                    type: 'link',
                    url
                })
            });

            if (res.ok) {
                onSuccess();
                setTitle('');
                setUrl('');
            }
        } catch (err) {
            console.error('Failed to add link', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
                >
                    {isLoading ? 'Saving...' : 'Save Link'}
                </button>
            </div>
        </form>
    );
}