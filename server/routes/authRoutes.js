import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Import the User model
import Withdrawal from '../models/Withdrawal.js'; // Import the Withdrawal model
import Deposit from '../models/Deposit.js'; // Import the Deposit model

const router = express.Router();

// Connect to MongoDB (this should be done once in your main server file)
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password, upiId, mobileNumber, accountHolder, accountNumber, bankName, ifscCode, branchAddress } = req.body;
    try {
        // Check if the user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(409).json({ message: "User  already exists" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ 
            username, 
            email, 
            password: hashPassword, 
            upiId, 
            mobileNumber, 
            accountHolder, 
            accountNumber, 
            bankName, 
            ifscCode, 
            branchAddress 
        });
        await newUser .save();

        return res.status(201).json({ message: "User  created successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '3h' });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Invalid token" });
    }
};

// Get Current User Account Details
router.get('/user/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Exclude password from the response
        const { password, ...userDetails } = user._doc;
        return res.status(200).json(userDetails);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Update User Account Details
router.post('/user/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Update user details
        const updatedData = req.body;
        Object.assign(user, updatedData);
        await user.save();

        return res.status(200).json({ message: "User  account details updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Withdrawal Route
router.post('/withdraw', verifyToken, async (req, res) => {
    const { amount, actualPayment } = req.body; // Get amount and actualPayment from request body
    const userId = req.userId; // Get userId from the token

    try {
        // Find the user and update their balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Check if the user has enough balance
        if (user.balance < parseFloat(amount)) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct the amount from the user's balance
        user.balance -= parseFloat(amount);
        await user.save();

        // Create a withdrawal request
        const withdrawalRequest = new Withdrawal({
            userId,
            username: user.username, // Store username
            email: user.email,       // Store email
            amount: parseFloat(amount), // Ensure amount is a number
            actualPayment: parseFloat(actualPayment) // Ensure actualPayment is a number
        });

        await withdrawalRequest.save();
        return res.status(201).json({ message: 'Withdrawal request submitted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error submitting withdrawal request', error });
    }
});

// Deposit Route
router.post('/deposit', verifyToken, async (req, res) => {
    const { transactionId, amount } = req.body; // Get transactionId and amount from request body
    const userId = req.userId; // Get userId from the token

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Create a new deposit record
        const depositRecord = new Deposit({
            userId,
            username: user.username, // Store username
            email: user.email,       // Store email
            transactionId,
            amount: parseFloat(amount) // Store the amount deposited
        });

        await depositRecord.save();

        // Optionally, update the user's balance if needed
         // Assuming you want to add the deposited amount to the user's balance
        // await user.save();

        return res.status(201).json({ message: 'Deposit request submitted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error submitting deposit request', error });
    }
});

// Connect to the database when the server starts
connectToDatabase();

export default router;