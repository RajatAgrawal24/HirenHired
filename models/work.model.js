const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open'
    },
    assignedFreelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer'
    }
});

module.exports = mongoose.model('Work', WorkSchema);
