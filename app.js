const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const connectDb = require('./config/db');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const User = require('./model/User');
const Message = require('./model/Message');
const errorController = require('./controllers/errorController')

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 6000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));

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
const chatRoutes = require("./routes/chatRoutes");

app.use('/profile', profileRoutes);
app.use('/', authRoutes);
app.use("/", chatRoutes);



const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Store username with socket ID
    socket.on('user joined', async (username) => {
        users[username] = socket.id;
        console.log(`${username} connected with socket ID: ${socket.id}`);


        io.emit('active users', { active: Object.keys(users) });

        
        const undeliveredMessages = await Message.find({ receiver: username, status: 'sent' });

        for (let msg of undeliveredMessages) {
            socket.emit('private message', {
                from: msg.sender,
                message: msg.message,
                timestamp: msg.timestamp,
                status: 'delivered',
                messageId: msg._id
            });

            await Message.findByIdAndUpdate(msg._id, { status: 'delivered' });

            if (users[msg.sender]) {
                io.to(users[msg.sender]).emit('message status update', {
                    messageId: msg._id,
                    status: 'delivered'
                });
            }
        }
    });

    
    socket.on("private message", async (data) => {
        const { from, to, message, timestamp } = data;
    
        try {
            const newMessage = new Message({
                sender: from,
                receiver: to,
                message,
                timestamp,
                status: "sent"
            });
            await newMessage.save();
    
            console.log(`Message stored: ${message}`);
    
            // Send message to receiver in real-time
            if (users[to]) {
                io.to(users[to]).emit("private message", {
                    from,
                    message,
                    timestamp,
                    status: "delivered",
                    messageId: newMessage._id
                });
    
                
                await Message.findByIdAndUpdate(newMessage._id, { status: "delivered" });
    
                
                io.to(users[from]).emit("message status update", {
                    messageId: newMessage._id,
                    status: "delivered"
                });
            } else {
                io.to(users[from]).emit("message status update", {
                    messageId: newMessage._id,
                    status: "sent"
                });
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    

    socket.on("create group", async (data) => {
        io.emit("group created", data);
      });

    
    socket.on("message seen", async ({ messageId, sender }) => {
        if (!messageId) return;
    
        try {
            const message = await Message.findById(messageId);
            if (!message) return;
    
            await Message.findByIdAndUpdate(messageId, { status: "seen" });
    
            
            if (users[message.sender]) {
                io.to(users[message.sender]).emit("message status update", { messageId, status: "seen" });
            }
    
            
            if (users[message.receiver]) {
                io.to(users[message.receiver]).emit("message status update", { messageId, status: "seen" });
            }
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    });
    
    

    
    socket.on('load chat history', async ({ user1, user2 }) => {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 }  
                ]
            }).sort({ createdAt: 1 });
    
            
            if (users[user1]) {
                io.to(users[user1]).emit('chat history', messages);
            }
            if (users[user2]) {
                io.to(users[user2]).emit('chat history', messages);
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    });
    

    // Handle user disconnect
    socket.on('disconnect', () => {
        let disconnectedUser = null;
        for (const user in users) {
            if (users[user] === socket.id) {
                disconnectedUser = user;
                delete users[user];
                break;
            }
        }
        if (disconnectedUser) {
            io.emit('active users', { active: Object.keys(users) });
            console.log(`${disconnectedUser} disconnected`);
        }
    });
});

// Welcome Page Route
app.get('/', (req, res) => {
    res.render('welcome');
});


// 404 Error Handling (Wildcard Route)
app.use(errorController.get404); 

// General Error Handler (500 Errors)
app.use(errorController.get500);





app.use((req, res) => {
    console.log("404 middleware triggered for:", req.originalUrl);
    res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Oops! The page you're looking for does not exist.",
    });
});



// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
