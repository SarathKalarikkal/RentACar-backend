import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dealer',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
