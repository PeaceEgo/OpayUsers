const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        required: function() { return this.transactionType === 'transfer'; }
    },
    sender: {
        type: new mongoose.Schema({
            firstName: { type: String },
            lastName: { type: String },
            mobileNumber: { type: String },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }),
        required: function() { return this.transactionType === 'receive'; }
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
    userId: { type: mongoose.Schema.Types.ObjectId, unique: true }, // Must match _id
    balance: { type: Number, default: 0 },
    accountNumber: { type: String, required: true, unique: true },
    transactionPin: { type: String, default: '0' },
    transactions: { type: [transactionSchema], default: [] },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters long'] },
    profilePicture: { type: String, default: '' }  // Profile picture field, initially empty
});

// Middleware to sync userId with _id
userSchema.pre('save', function(next) {
    this.userId = this._id; // Explicitly set userId to match _id
    next();
});

// Hash the transaction PIN before saving it
userSchema.pre('save', async function(next) {
    if (this.isModified('transactionPin') && this.transactionPin !== '0') {
        this.transactionPin = await bcrypt.hash(this.transactionPin, 10);
    }
    next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
