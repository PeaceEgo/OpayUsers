const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/dotenv');

// transfer logic
const fetchUserByAccountNumber = async (req, res) => {
  const { accountNumber } = req.params; // Receiver's account number
  const { senderAccountNumber, amount } = req.body; // Sender's account number and amount for transfer

  try {
    if (accountNumber.length !== 11) {
      return res.status(400).json({ message: 'Account number must be 11 digits' });
    }

    // Find receiver by account number
    const receiver = await User.findOne({ accountNumber });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver account number not found' });
    }

    // If transfer data is provided, proceed with the transfer logic
    if (senderAccountNumber && amount) {
      // Validate input
      if (senderAccountNumber.length !== 11 || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer data' });
      }

      // Find sender by account number
      const sender = await User.findOne({ accountNumber: senderAccountNumber });
      if (!sender) {
        return res.status(404).json({ message: 'Sender account number not found' });
      }

      // Check sender's balance
      if (sender.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      // Perform transfer
      sender.balance -= amount;
      receiver.balance += amount;

      // Save updated balances
      await sender.save();
      await receiver.save();

      return res.status(200).json({
        message: 'Transfer successful',
        transactionDetails: {
          sender: {
            accountNumber: sender.accountNumber,
            name: `${sender.firstName} ${sender.lastName}`,
            remainingBalance: sender.balance,
          },
          receiver: {
            accountNumber: receiver.accountNumber,
            name: `${receiver.firstName} ${receiver.lastName}`,
            updatedBalance: receiver.balance,
          },
          amount,
        },
      });
    }

    // If no transfer data is provided, simply return the receiver's details
    res.status(200).json({
      message: 'User fetched successfully',
      recipientDetails: {
        name: `${receiver.firstName} ${receiver.lastName}`,
        accountNumber: receiver.accountNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create User
const createUser = async (req, res) => {
  console.log(req.body); 
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      nickName,
      gender,
      dateOfBirth,
      mobileNumber,
      balance,
    } = req.body;

    // Check if email or mobile number already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingMobile = await User.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique 11-digit account number
    const accountNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickName,
      gender,
      dateOfBirth,
      mobileNumber,
      balance,
      accountNumber, // Assign generated account number
      transactionPin: '0', // Default transaction pin
    });

    // Save the user
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set Transaction PIN
const setTransactionPin = async (req, res) => {
  const { userId } = req.params;
  const { transactionPin } = req.body;

  try {
    // Validate input
    if (!transactionPin || transactionPin.toString().length !== 4) {
      return res.status(400).json({
        message: 'Transaction PIN must be a 4-digit number',
      });
    }

    // Hash the new transaction PIN
    const hashedPin = await bcrypt.hash(transactionPin.toString(), 10);

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { transactionPin: hashedPin },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Transaction PIN updated successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = { ...req.body };

  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User and generate JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.userId.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token, userData: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Single User
const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User fetched successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUser,
  fetchUserByAccountNumber,
  setTransactionPin,
};
