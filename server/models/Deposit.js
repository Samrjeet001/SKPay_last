import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true }, // You can store the amount if needed
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' } // You can set the initial status to 'Pending'
});

const Deposit = mongoose.model('Deposit', DepositSchema);

export default Deposit;