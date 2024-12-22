import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Import the User model
import Withdrawal from "../models/Withdrawal.js"; // Import the Withdrawal model
import Deposit from "../models/Deposit.js"; // Import the Deposit model
import AdminCheck from "../models/Admin.js";
import StaticVaraible from "../models/Static.js";

const router = express.Router();
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    upiId,
    mobileNumber,
    accountHolder,
    accountNumber,
    bankName,
    ifscCode,
    branchAddress,
  } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User  already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      upiId,
      mobileNumber,
      accountHolder,
      accountNumber,
      bankName,
      ifscCode,
      branchAddress,
    });
    await newUser.save();
    return res.status(201).json({ message: "User  created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "3h",
    });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
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

router.get("/user/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    const { password, ...userDetails } = user._doc;
    return res.status(200).json(userDetails);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/user/me", verifyToken, async (req, res) => {
  console.log("here")
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    const updatedData = req.body;
    Object.assign(user, updatedData);
    await user.save();
    return res
      .status(200)
      .json({ message: "User  account details updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/withdraw", verifyToken, async (req, res) => {
  const { amount, actualPayment } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    if (user.balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= parseFloat(amount);
    await user.save();
    const withdrawalRequest = new Withdrawal({
      userId,
      username: user.username, // Store username
      email: user.email, // Store email
      amount: parseFloat(amount), // Ensure amount is a number
      actualPayment: parseFloat(actualPayment),
      upiId: user.upiId, // UPI ID
      mobileNumber: user.mobileNumber, // Mobile Number
      accountHolder: user.accountHolder, // Account Holder Name
      accountNumber: user.accountNumber, // Account Number
      bankName: user.bankName, // Bank Name
      ifscCode: user.ifscCode, // IFSC Code
      branchAddress: user.branchAddress, // Ensure actualPayment is a number
    });
    await withdrawalRequest.save();
    return res
      .status(201)
      .json({ message: "Withdrawal request submitted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error submitting withdrawal request", error });
  }
});

router.post("/deposit", verifyToken, async (req, res) => {
  const { transactionId, amount } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    const depositRecord = new Deposit({
      userId,
      username: user.username, // Store username
      email: user.email, // Store email
      transactionId,
      amount: parseFloat(amount), // Store the amount deposited
    });
    await depositRecord.save();
    return res
      .status(201)
      .json({ message: "Deposit request submitted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error submitting deposit request", error });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/orders", async (req, res) => {
  try {
    const orders = await Deposit.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/withdraw/orders", async (req, res) => {
  try {
    const withdraw_orders = await Withdrawal.find();
    res.json(withdraw_orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/update-balance", async (req, res) => {
  const { id, email, amount } = req.body;
  try {
    const user = await User.findOne({ email });
    const order = await Deposit.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User  not found" });
    }
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    user.balance = (user.balance || 0) + parseFloat(amount);
    await user.save();
    order.status = "Complete";
    await order.save();
    res.json({
      success: true,
      message: "Balance updated and order status changed to complete",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/reject", async (req, res) => {
  const { id, email } = req.body;
  try {
    const user = await User.findOne({ email });
    const order = await Deposit.findById(id); // Assuming 'id' is the _id of the order
    if (!user) {
      return res.json({ success: false, message: "User  not found" });
    }
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    order.status = "Rejected"; // Set the order status to "Complete"
    await order.save();
    res.json({
      success: true,
      message: "Balance updated and order status changed to complete",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/withdraw/done", async (req, res) => {
  const { id, email } = req.body;

  try {
    // Find the user by email in the User schema
    const user = await User.findOne({ email });
    // Find the order by id in the Deposit schema
    const order = await Withdrawal.findById(id); // Assuming 'id' is the _id of the order

    if (!user) {
      return res.json({ success: false, message: "User  not found" });
    }

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Update user's balance
    

    // Update order status
    order.status = "Complete"; // Set the order status to "Complete"
    await order.save();

    // Send success response
    res.json({
      success: true,
      message: "Balance updated and order status changed to complete",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



//New Dashboard
//Deposits List
router.get("/deposits", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const deposits = await Deposit.find({ email: user.email });
    return res.status(200).json(deposits);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
//Withdrawal List
router.get("/withdrawals", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const withdrawals = await Withdrawal.find({ email: user.email });
    return res.status(200).json(withdrawals);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
// Balance Main Page
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/update/statics", async (req, res) => {
  const { currentrate } = req.body;
  try {
    const id ='6742b690622c133cc0a6637a';
    const row = await StaticVaraible.findById(id); // Assuming 'id' is the _id of the order
   
    row.currentrate = currentrate; // Set the order status to "Complete"
    await row.save();
    
    return res.status(200).json({ message: "Static value set successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/statics", async (req, res) => {
  try {
    const id = '6742b690622c133cc0a6637a'; // Replace with dynamic ID if needed
    const row = await StaticVaraible.findById(id); // Assuming 'id' is the _id of the document

    if (!row) {
      return res.status(404).json({ message: "Static value not found." });
    }
// Ensure this matches your model's property name
    return res.status(200).json(row.currentrate); // Return the found document
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/admin/me", verifyToken, async (req, res) => {
  try {
    const user = await AdminCheck.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminCheck.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "3h",
    });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

connectToDatabase();

export default router;
