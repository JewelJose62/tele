


const Message = require('../model/Message')
const User = require("../model/User");
const jwt = require('jsonwebtoken')

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Chat.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Store chat messages (Handled by Socket.io)
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.user.id;

    const newMessage = new Chat({ sender, receiver, message });
    await newMessage.save();

    res.json({ message: "Message sent!",newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};






exports.chatPage = async (req, res) => {
  if (!req.session.token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const loggedInUser = await User.findById(decoded.id).select("profile.username");

    if (!loggedInUser) return res.redirect("/login");

    // Fetch all users except the logged-in user, only those with a valid username
    const users = await User.find({
      _id: { $ne: decoded.id },
      "profile.username": { $exists: true, $ne: "" }
    }).select("profile.username");
    console.log("Fetched users:", users); // Check your server logs
    res.render("chat", { username: loggedInUser.profile.username, users });
    
  } catch (error) {
    console.error("Error loading chat page:", error);
    res.redirect("/login");
  }
};
