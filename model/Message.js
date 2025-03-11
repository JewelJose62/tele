// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   message: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now }
// });

// const Message = mongoose.model('Message', messageSchema);
// module.exports = Message;



const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },  // Store username as String
    receiver: { type: String, required: true },  // Store username as String
    message: { type: String, required: true },
    timestamp: { type: String, default: new Date().toLocaleString() },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' }  // Status field

});

module.exports = mongoose.model('Message', messageSchema);

