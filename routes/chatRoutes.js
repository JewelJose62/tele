
const express = require("express");
const router = express.Router();
const { chatPage } = require("../controllers/chatController");
// const chatController = require("../controllers/chatController");

const Message = require("../model/Message");

// Private Chat History Route
router.get("/chat-history", async (req, res) => {
    try {
        const { user1, user2 } = req.query;

        if (!user1 || !user2) {
            return res.status(400).json({ error: "Both users must be specified" });
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ],
        }).sort({ timestamp: 1 }); // Sort messages in ascending order

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// Chat Page Route
router.get("/chat", chatPage); 

module.exports = router;

