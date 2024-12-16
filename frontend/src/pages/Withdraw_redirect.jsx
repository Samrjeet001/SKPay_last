import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Withdraw_redirect = () => {
    const [userData, setUserData] = useState(null);
    const [amount, setAmount] = useState('');
    const [actualPayment, setActualPayment] = useState('0 INR');
    const navigate = useNavigate();
    const currentRate = 96; // Current rate in INR

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://skpay-final.onrender.com/auth/user/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const calculatePayment = (e) => {
        const value = e.target.value;
        setAmount(value);
        const actualPaymentValue = value * currentRate;
        setActualPayment(`${actualPaymentValue} INR`);
    };

    const handleWithdraw = async () => {
        // Check if the amount is greater than the user's balance
        if (userData && parseFloat(amount) > userData.balance) {
            alert('Withdrawal amount cannot exceed your balance.');
            return; // Prevent further execution
        }

        const token = localStorage.getItem('token');
        const withdrawalData = {
            amount: amount,
            actualPayment: actualPayment.replace(' INR', '') // Remove ' INR' from the actual payment string
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/withdraw`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(withdrawalData)
            });

            if (response.ok) {
                alert('Withdrawal request submitted successfully!');
                // Update user balance in the state
                setUserData((prevData) => ({
                    ...prevData,
                    balance: prevData.balance - parseFloat(amount) // Deduct the withdrawal amount from the balance
                }));
                // Optionally, you can reset the amount and actual payment here
                setAmount('');
                setActualPayment('0 INR');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting withdrawal request:', error);
            alert('An error occurred while submitting the withdrawal request.');
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-start text-white">
            <div className="w-full bg-gray-800 shadow-md">
                <div className="flex items-center justify-between bg-green-600 p-4 text-white w-full">
                    <a href="/">
                        <i className="fas fa-arrow-left"></i>
                    </a>
                    <h1 className="text-lg">Withdraw</h1>
                    <a>
                        <i className="fas fa-ellipsis-v"></i>
                    </a>
                </div>
                <div className="p-4">
                    <div className="text-center text-green-400 text-lg font-semibold">
                        Amount of Money
                    </div>
                    <div className="text-center text-green-400 text-2xl font-bold">
                        {userData ? `${userData.balance} USDT` : 'Loading...'} {/* Display balance */}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="amount" className="block text-gray-400 mb-2">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            placeholder="Please Enter the Transfer Amount"
                            className="border border-gray-600 rounded-lg p-2 w-full text-gray-400 outline-none bg-gray-800"
                            onChange={calculatePayment}
                        />
                        <div className="border border-gray-600 rounded-lg p-2 flex justify-between items-center mb-2 mt-4">
                            <span className="text-gray-400">Current Rate</span>
                            <span className="text-green-400">{currentRate} INR</span>
                        </div>
                        <div className="border border-gray-600 rounded-lg p-2 flex justify-between items-center mb-2">
                            <span className="text-gray-400">Actual Payment</span>
                            <span className="text-green-400">{actualPayment}</span>
                        </div>
                    </div>
                    <div className="mt-4 text-gray-400 text-sm">
                        <p>1: The minimum withdrawal amount is: 200 Rs</p>
                        <p>2: Withdrawal time: Monday to Friday 03:30:00 am to 15:30:00 pm</p>
                        <p>3: The withdrawal fee is: 8%</p>
                        <p>4: Once you submit the withdrawal, the bank will queue up to process it for you, and your withdrawal will be credited to your bank account within 2-48 hours. If your withdrawal is not received within 48 hours, please contact your manager to inquire.</p>
                        <p>5: IFSC should be 11 characters, the fifth character should be the number "0", not the letter "O". If the bank information you fill in is incorrect, your withdrawal will fail.</p>
                    </div>
                    <button onClick={handleWithdraw} className="w-full bg-green-600 text-white py-2 rounded-lg mt-4">
                        Determine
                    </button>
                </div>
            </div>
        </div>
 );
};

export default Withdraw_redirect;