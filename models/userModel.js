// const mongoose = require('mongoose');

// // Define the schema for each transaction
// const transactionSchema = new mongoose.Schema({
//   transactionType: {
//     type: String,
//     enum: ['transfer', 'receive'],
//     required: true,
//   },
//   transactionNumber: { type: String, required: true }, // Unique transaction number
//   sessionId: { type: String, required: true }, // Unique session ID
//   transactionDate: { type: Date, default: Date.now, required: true }, // Auto-filled
//   amount: { type: Number, required: true }, // Transaction amount
//   fee: { type: Number, default: 0 }, // Optional fee
//   recipient: {
//     type: new mongoose.Schema({
//       name: { type: String, required: true }, // Recipient's name
//       accountNumber: { type: String, required: true }, // Recipient's account number
//     }),
//     required: function () {
//       return this.transactionType === 'transfer';
//     }, // Recipient is required for transfers
//   },
//   sender: {
//     type: new mongoose.Schema({
//       name: { type: String, required: true }, // Sender's name
//       accountNumber: { type: String, required: true }, // Sender's account number
//     }),
//     required: function () {
//       return this.transactionType === 'receive';
//     }, // Sender is required for receiving
//   },
// });

// // Define the main user schema
// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   nickName: { type: String },
//   gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
//   dateOfBirth: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true }, // Auto-generated user ID
//   balance: { type: Number, default: 0 },
//   accountNumber: {
//     type: String,
//     unique: true,
//     required: true,
//     default: function () {
//       return Math.floor(10000000000 + Math.random() * 90000000000).toString();
//     }, // Automatically generates an 11-digit account number
//   },
//   transactionPin: {
//     type: Number,
//     default: 0, // Default transaction pin is 0 until set
//   },
//   transactions: {
//     type: [transactionSchema],
//     default: [],
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: [6, 'Password must be at least 6 characters long'],
//   },
// });

// // Create the User model
// const User = mongoose.model('User', userSchema);

// module.exports = User;


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
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    balance: { type: Number, default: 0 },
    accountNumber: { type: String, required: true, unique: true },
    transactionPin: { type: String, default: '0' },
    transactions: { type: [transactionSchema], default: [] },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters long'] },
});

// Hash the transaction PIN before saving it
userSchema.pre('save', async function(next) {
    if (this.isModified('transactionPin') && this.transactionPin !== '0') {
        this.transactionPin = await bcrypt.hash(this.transactionPin, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
