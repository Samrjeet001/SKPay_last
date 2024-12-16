// lib/db.js
import mongoose from 'mongoose';

let isConnected; // Track the connection status

export const connectToDatabase = async () => {
  if (isConnected) {
    return; // If already connected, return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true; // Set the connection status to true
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Rethrow the error for handling in the calling function
  }
};