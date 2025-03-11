// const io = require("socket.io")(server);
// const chat = require("./model/chat");


// // Track active users and their socket IDs
// let activeUsers = {};
// let userSockets = {}; // This stores the socket ID for each user

// // Handle WebSocket connections
// io.on('connection', (socket) => {
//   console.log('New user connected');

//   // Handle user joining and store their socket ID
//   socket.on('user joined', (username) => {
//     socket.username = username;  // Store the username in the socket object
//     activeUsers[username] = socket.id; // Store the socket ID of the user
//     userSockets[socket.id] = username; // Store the username against the socket ID

//     io.emit('active users', Object.keys(activeUsers)); // Send updated list of active users to all clients
//   });

//   // Handle private chat messages
//   socket.on('private message', (toUser, msg) => {
//     const receiverSocketId = activeUsers[toUser]; // Get the receiver's socket ID

//     if (receiverSocketId) {
//       // Create a "room" for this private conversation
//       const roomName = [socket.username, toUser].sort().join('-'); // A unique room name for the user pair

//       // Join both users in the private room
//       socket.join(roomName);
//       io.to(receiverSocketId).emit('chat message', { from: socket.username, message: msg, room: roomName });
//       socket.emit('chat message', { from: socket.username, message: msg, room: roomName });
//     } else {
//       // If user is not found, send an error message
//       socket.emit('chat message', { from: 'System', message: 'User not found!' });
//     }
//   });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         // Remove the user from active users when they disconnect
//         delete activeUsers[socket.username];
//         delete userSockets[socket.id];
    
//         io.emit('active users', Object.keys(activeUsers)); // Emit the updated active users list
//         console.log('User disconnected');
//       });
//     });