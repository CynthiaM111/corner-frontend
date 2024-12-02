import { io } from 'socket.io-client';

// Use an environment variable or a fallback for the backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.onrender.com';

// Initialize the Socket.IO client
const socket = io(BACKEND_URL, {
    transports: ['websocket'], // Use WebSocket explicitly to avoid transport issues
    withCredentials: true,    // Include credentials if needed
});

// Log connection events for debugging
socket.on('connect', () => {
    console.log('Connected to backend:', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
});

export default socket;
