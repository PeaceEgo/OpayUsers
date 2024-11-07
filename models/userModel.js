const mongoose = require('mongoose');

// Define the schema for each transaction
const transactionSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: ['transfer', 'receive'],
        required: true,
    },
    transactionNumber: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    sessionId: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    recipient: {
        type: new mongoose.Schema({
            firstName: { type: String },
            lastName: { type: String },
            mobileNumber: { type: String },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }),
        required: function() { return this.transactionType === 'transfer'; } // Recipient details are required for transfers
    },
    sender: {
        type: new mongoose.Schema({
            firstName: { type: String },
            lastName: { type: String },
            mobileNumber: { type: String },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }),
        required: function() { return this.transactionType === 'receive'; } // Sender details are required for receives
    }
});

// Define the main user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    nickName: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true }, // Using ObjectId for userId
    balance: { type: Number, default: 0 },
    transactions: { type: [transactionSchema], default: [] },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters long'] },
  });

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
