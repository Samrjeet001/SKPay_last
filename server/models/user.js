// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    upiId: { type: String, default: '' }, // UPI ID
    mobileNumber: { type: String, default: '' }, // Mobile Number
    accountHolder: { type: String, default: '' }, // Account Holder Name
    accountNumber: { type: String, default: '' }, // Account Number
    bankName: { type: String, default: '' }, // Bank Name
    ifscCode: { type: String, default: '' }, // IFSC Code
    branchAddress: { type: String, default: '' }, // Branch Address
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const User = mongoose.model('User ', userSchema); // Removed extra space in 'User  '

export default User;