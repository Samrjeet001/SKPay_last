// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    upiId: { type: String, default: 'Enter your details' }, // UPI ID
    mobileNumber: { type: String, default: 'Enter your details' }, // Mobile Number
    accountHolder: { type: String, default: 'Enter your details' }, // Account Holder Name
    accountNumber: { type: String, default: 'Enter your details' }, // Account Number
    bankName: { type: String, default: 'Enter your details' }, // Bank Name
    ifscCode: { type: String, default: 'Enter your details' }, // IFSC Code
    branchAddress: { type: String, default: 'Enter your details' }, // Branch Address
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const User = mongoose.model('User ', userSchema); // Removed extra space in 'User  '

export default User;
