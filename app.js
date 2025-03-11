const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const connectDb = require('./config/db');
const http = require('http')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const socketIo = require('socket.io')
const User = require('./model/User')
const PORT = 3000;
const Message = require('./model/Message')
const Group = require('./model/Group'); // Group Model

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);




// ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads')); // Serve uploaded images


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.messages = req.flash();
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', profileRoutes);

// app.use(require('./routes/profile'));



app.use('/', authRoutes);
// app.use('/chat', chatRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/", chatRoutes);






let users = {}; // Store connected users
io.on('connection', (socket) => {
  console.log('A user connected');




  // Handle user joining
  socket.on('user joined', (username) => {
    users[username] = socket.id;  // Store the username with socket ID
    console.log(`${username} joined.`);
    io.emit('active users', { active: Object.keys(users) }); // Broadcast updated list
});

    // Handle private messages
    socket.on('private message', async (data) => {
      const { to, from, message } = data;
      const timestamp = new Date().toISOString(); // Store timestamp

      // Ensure 'to' user exists before sending
      if (users[to]) {
          try {
              // Save message to database with 'sent' status
              const newMessage = new Message({
                  sender: from,
                  receiver: to,
                  message,
                  timestamp,
                  status: 'sent'
              });

              await newMessage.save();

              // Emit the message to both sender and receiver
              io.to(users[to]).emit('private message', { from, message, timestamp, status: 'sent' });
              io.to(socket.id).emit('private message', { from, message, timestamp, status: 'sent' });
          } catch (err) {
              console.error('Error saving message to DB:', err);
          }
      } else {
          console.error("User not found:", to);
      }
  });

  // Handle message delivered (receiver gets message)
  socket.on('message delivered', async (data) => {
      try {
          await Message.findByIdAndUpdate(data.messageId, { status: 'delivered' });

          // Notify sender that message is delivered
          io.to(users[data.sender]).emit('message status update', {
              messageId: data.messageId,
              status: 'delivered'
          });
      } catch (err) {
          console.error('Error updating message status:', err);
      }
  });

  // Handle message seen (receiver opens chat)
  socket.on('message seen', async (data) => {
      try {
          await Message.findByIdAndUpdate(data.messageId, { status: 'seen' });

          // Notify sender that message is seen
          io.to(users[data.sender]).emit('message status update', {
              messageId: data.messageId,
              status: 'seen'
          });
      } catch (err) {
          console.error('Error updating message status:', err);
      }
  });

  // Handle user disconnect
//   socket.on('disconnect', () => {
//       for (let username in users) {
//           if (users[username] === socket.id) {
//               delete users[username];
//               io.emit('active users', { active: Object.keys(users) });
//               break;
//           }
//       }
//       console.log('A user disconnected');
//   });
// });


 // User joins a group
 socket.on("joinGroup", ({ groupId, userId }) => {
  socket.join(groupId);
  console.log(`User ${userId} joined group ${groupId}`);
});

// Handle group messages
socket.on("groupMessage", async ({ groupId, senderId, content }) => {
  try {
      const user = await User.findById(senderId);
      if (!user) return;
      const senderName = user.profile.username;

      io.to(groupId).emit("newGroupMessage", { senderId, senderName, content });

      await Group.findByIdAndUpdate(groupId, {
          $push: { messages: { senderId, senderName, content } }
      });
  } catch (error) {
      console.error("Error sending group message:", error);
  }
});

// Handle user disconnect
socket.on('disconnect', () => {
  for (let username in users) {
      if (users[username] === socket.id) {
          delete users[username];
          io.emit('active users', { active: Object.keys(users) });
          break;
      }
  }
  console.log('A user disconnected');
});
});





// Welcome Page Route
app.get('/welcome', (req, res) => {
    res.render('welcome'); // This will render welcome.ejs
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
