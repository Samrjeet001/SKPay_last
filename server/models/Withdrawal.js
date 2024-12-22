import mongoose from 'mongoose';

const WithdrawalSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    amount: { type: Number, required: true },
    type: { type: String, default: 'Withdraw' },
    actualPayment: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    upiId: { type: String, default: '' }, // UPI ID
    mobileNumber: { type: String, default: '' }, // Mobile Number
    accountHolder: { type: String, default: '' }, // Account Holder Name
    accountNumber: { type: String, default: '' }, // Account Number
    bankName: { type: String, default: '' }, // Bank Name
    ifscCode: { type: String, default: '' }, // IFSC Code
    branchAddress: { type: String, default: '' },
    status: { type: String, default: 'Pending' } // You can set the initial status to 'Pending'
});

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);

export default Withdrawal;
