import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, default: 'Admin' },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const AdminCheck = mongoose.model('Admin ', adminSchema); // Removed extra space in 'User  '

export default AdminCheck;
