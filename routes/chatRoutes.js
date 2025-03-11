



const express = require("express");
const router = express.Router();
const { chatPage } = require("../controllers/chatController");
const Message = require('../model/Message');

router.get('/chat-history', async (req, res) => {
    const { user1, user2 } = req.query;
    try {
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Error fetching chat history');
    }
});
router.get("/chat", chatPage); // Ensure this route exists

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const chatController = require("../controllers/chatController");
// const { protect } = require("../middlewares/auth"); // Ensure authentication

// const Message = require('../model/Message');

// // ✅ Render Chat Page (Private & Group Chats)
// router.get("/chat", protect, chatController.chatPage);

// // ✅ Fetch Private Chat History Between Two Users
// router.get("/messages/:senderId/:receiverId", protect, chatController.getMessages);

// // ✅ Send a Private Message
// router.post("/send", protect, chatController.sendMessage);

// // ✅ Fetch Group Chat Messages
// router.get("/group/:groupId/messages", protect, chatController.getGroupMessages);

// // ✅ Send a Message to a Group
// router.post("/group/send", protect, chatController.sendGroupMessage);

// // ✅ Fetch Chat History (General Endpoint for Private Chat)
// router.get("/chat-history", protect, async (req, res) => {
//     const { user1, user2 } = req.query;
//     try {
//         const messages = await Message.find({
//             $or: [
//                 { sender: user1, receiver: user2 },
//                 { sender: user2, receiver: user1 }
//             ]
//         }).sort({ createdAt: 1 });

//         res.json({ success: true, messages });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Error fetching chat history" });
//     }
// });

// module.exports = router;









