// const mongoose = require('mongoose');

// const GroupSchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
//     members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users in the group
//     messages: [
//         {
//             senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//             senderName: { type: String },
//             content: { type: String, required: true },
//             timestamp: { type: Date, default: Date.now }
//         }
//     ],
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Group', GroupSchema);



const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    members: [{ type: String, required: true }], // List of user IDs
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
});

module.exports = mongoose.model("Group", groupSchema);
