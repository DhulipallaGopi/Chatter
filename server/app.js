const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = express();

// Enable CORS
app.use(cors());

// Add root route for testing
app.get('/', (req, res) => {
  res.send('Chatter backend is running!');
});

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log('New client connected');

    socket.on("chat", (data) => {
        io.emit("chat", data);
    });

    socket.on("disconnect", () => {
        console.log('Client disconnected');
    });
});

// Use PORT from environment for Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
