// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:2000"; // Replace with your backend URL

// Initialize socket connection
const socket = io(SOCKET_URL, {
    autoConnect: false,  // Set to false initially, connect manually when needed
});

export default socket;
