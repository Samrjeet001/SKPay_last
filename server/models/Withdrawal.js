import mongoose from 'mongoose';

const WithdrawalSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    amount: { type: Number, required: true },
    actualPayment: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' } // You can set the initial status to 'Pending'
});

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);

export default Withdrawal;