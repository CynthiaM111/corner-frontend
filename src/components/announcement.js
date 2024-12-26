import React, { useState, useEffect } from "react";
import axios from "axios";

const Announcements = ({ courseId }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem('studentToken') || localStorage.getItem('teacherToken');

    // Fetch existing announcements

    const getsUserRole = () =>{
        const token = localStorage.getItem('teacherToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.role;
        }
        return null;
    }
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL || "http://localhost:5001"}/corner/course/${courseId}/get-announcements`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`  // Add token in Authorization header
                        }
                    }
                );
                if (response.status === 200) {
                    setAnnouncements(response.data.announcements);
                } else {
                    setError("Failed to fetch announcements.");
                }
            } catch (err) {
                setError("Error fetching announcements.");
            }
        };

        fetchAnnouncements();
    }, [courseId, token]);

    // Handle form submission
    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
            setError("Title and content are required.");
            return;
        }

        if (!token) {
            setError("Authentication failed. Please log in.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL || "http://localhost:5001"}/corner/course/${courseId}/add-announcement`,
                newAnnouncement,
                {
                    headers: {
                        Authorization: `Bearer ${token}`  // Add token in Authorization header
                    }
                }
            );

            if (response.status === 201) {
                setSuccess("Announcement added successfully!");
                setNewAnnouncement({ title: "", content: "" });
                // Update announcements list
                setAnnouncements((prevAnnouncements) => [response.data.announcement, ...prevAnnouncements]);
            } else {
                setError("Failed to add announcement.");
            }
        } catch (err) {
            setError("Error adding announcement.");
        }
    };

    return (
        <div className="announcements-section mt-5">
            <h3 className="display-6 mb-3">Announcements</h3>

            

            {/* Error and success messages */}
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}

            {/* Add new announcement form */}
            {getsUserRole() === 'teacher' && (
            <form onSubmit={handleAddAnnouncement} className="mb-4">
                <div className="mb-3">
                    <label htmlFor="announcementTitle" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="announcementTitle"
                        className="form-control"
                        value={newAnnouncement.title}
                        onChange={(e) =>
                            setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                        }
                        placeholder="Enter announcement title"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="announcementContent" className="form-label">
                        Content
                    </label>
                    <textarea
                        id="announcementContent"
                        className="form-control"
                        value={newAnnouncement.content}
                        onChange={(e) =>
                            setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                        }
                        placeholder="Enter announcement content"
                        rows="3"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Announcement
                </button>
            </form>
            )}

            {/* List of announcements */}
            {announcements && announcements.length > 0 ? (
                <ul className="list-unstyled">
                    {announcements.map((announcement) => (
                        <li key={announcement._id} className="mb-3">
                            <h5>{announcement.title}</h5>
                            <p className="text-muted small">{new Date(announcement.createdAt).toLocaleString()}</p>
                            <p>{announcement.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No announcements yet. Stay tuned!</p>
            )}
        </div>
    );
};

export default Announcements;
