
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },  
    receiver: { type: String, required: true },  
    message: { type: String, required: true },
    timestamp: { type: String, default: new Date().toLocaleString() },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' } 

});

module.exports = mongoose.model('Message', messageSchema);

