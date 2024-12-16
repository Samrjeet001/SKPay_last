import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import qr from '../assets/qrcode.png'; // Adjust the path based on your folder structure

const Deposit_redirect = () => {
    const [transactionId, setTransactionId] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const location = useLocation();
    const { amount } = location.state || {}; // Get the amount from the state
    const [canRequestDeposit, setCanRequestDeposit] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/user/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in the Authorization header
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // User data fetched successfully
            } else {
                navigate('/login');
            }
        };

        fetchUserData();

        // Check if the user can request a deposit
        const lastRequestTime = localStorage.getItem('lastDepositRequestTime');
        if (lastRequestTime) {
            const timeElapsed = Date.now() - lastRequestTime;
            const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
            if (timeElapsed < threeHours) {
                setCanRequestDeposit(false);
                setTimeRemaining(threeHours - timeElapsed);
            }
        }
    }, [navigate]);

    useEffect(() => {
        let timer;
        if (!canRequestDeposit && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1000) {
                        setCanRequestDeposit(true);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [canRequestDeposit, timeRemaining]);

    const handleSubmit = async () => {
        if (!transactionId) {
            document.getElementById('msg').innerHTML = 'Please enter a valid transactionId.';
            return;
        }

        if (!canRequestDeposit) {
            const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60));
            alert(`You can request a deposit again in ${hoursRemaining} hour(s).`);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ transactionId, amount }) // Send transactionId and amount
            });

            if (response.status === 201) {
                alert('Request submitted. Please wait for review. The transaction processing will take some time. If you have any queries, visit our help portals.');
                setTransactionId(''); // Reset the input field
                localStorage.setItem('lastDepositRequestTime', Date.now()); // Store the current time
                setCanRequestDeposit(false); // Disable further requests
                navigate('/'); // Replace with your desired route
            } else {
                alert('Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="w-full bg-gray-800 shadow-md">
                <div className="flex items-center justify-between bg-green-600 p-4 text-white w-full">
                    <a href="/">
                        <i className="fas fa-arrow-left"></i>
                    </a>
                    <h1 className="text-lg">Deposit</h1>
                    <a href="/transaction">
                        <i className="fas fa-ellipsis-v"></i>
                    </a>
                </div>
            </div>
            <div className="mt-8 w-full px-4 text-center">
 <h1 className="text-lg">Recharge Confirmation</h1>
                <p className="mt-4">You are about to recharge: <strong>{amount}</strong></p>
                <p className="text-gray-400 mb-4">
                    Please complete the payment using the QR code and enter the transaction ID of the transaction in the field below.
                </p>
                <img 
                    alt="A placeholder QR code image with a text 'QR Code' in the center" 
                    className="w-64 h-64 mx-auto" 
                    src={qr}
                />
            </div>
            <div className="mt-8 w-full px-4 text-center">
                <p className="mt-4">Network: TRC20</p>
                <p className="mt-4">Address: TMnKSoqjeFxb2oAUkRhiRn7k1nAeJzq7hT</p>
            </div>
            <div className="mt-8 w-full px-4">
                <label className="block text-gray-400 mb-2" htmlFor="transactionId">Transaction ID</label>
                <input 
                    className="border border-gray-600 rounded-lg p-2 w-full text-gray-400 outline-none bg-gray-800" 
                    id="transactionId" 
                    placeholder="Enter Transaction ID" 
                    type="text" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)} // Update state on input change
                />
                <div className="mt-4 text-red-400 text-center text-sm">
                    <p id='msg'></p>
                </div>
                <button 
                    className="w-full bg-green-600 text-white py-2 rounded-lg mt-4" 
                    onClick={handleSubmit}
                    disabled={!canRequestDeposit} // Disable button if user cannot request
                >
                    Submit
                </button>
                {!canRequestDeposit && (
                    <p className="text-red-400 text-center mt-2">
                        You can request a deposit again in {Math.ceil(timeRemaining / (1000 * 60 * 60))} hour(s).
                    </p>
                )}
            </div>
        </div>
    );
};

export default Deposit_redirect;