import React, { useState,  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Recharge = () => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate(); 
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
                 
                 
              } else {
                  
                  navigate('/login')
              }
          };
  
          fetchUserData();
      }, []);


  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const handleDetermineClick = () => {
    // Validate the amount
    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount < 1) {
      document.getElementById('msg').innerHTML='Please enter a valid amount.'
      // alert('Please enter a valid amount greater than or equal to 1.');
      return;
    }

    // Navigate to the next page and pass the amount as state
    navigate('/depositnow', { state: { amount: parsedAmount } }); // Replace '/depositnow' with your actual route
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="p-0 bg-gray-900">
        <div className="flex items-center justify-between bg-green-600 p-4 text-white w-full">
          <a href="/">
            <i className="fas fa-arrow-left"></i>
          </a>
          <h1 className="text-lg">Recharge</h1>
          <a>
            <i className="fas fa-ellipsis-v"></i>
          </a>
        </div>
        <div className="mt-0 p-4">
          <div className="flex space-x-2">
            <button className="bg-gray-800 text-gray-300 py-2 px-4 rounded border border-gray-700">
              Top up tutorial
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Recharge amount</label>
            <input
              type="text"
              id="amountInput"
              placeholder="Please enter the recharge amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-2 p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[300, 500, 1000, 2000, 5000, 10000].map((value) => (
              <button
                key={value}
                onClick={() => handleAmountClick(value)}
                className="bg-gray-800 text-gray-300 py-2 px-4 rounded border border-gray-700"
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-4 text-red-400 text-center text-sm">
                        <p  id='msg'></p>
                    </div>
          <div className="mt-4">
            <button 
              className="w-full bg-green-600 text-white py-2 rounded" 
              onClick={handleDetermineClick} // Call the function on click
            >
              Determine
            </button>
          </div>
          <div className="mt-4 text-gray-400 text-center text-sm">
                        <p>1: 500-999 Bonus 10 USDT.</p>
                        <p>2: 1000-1999 Bonus 40 USDT.</p>
                        <p>3: 2000-4999 Bonus 80 USDT.</p>
                        <p>4: 5000-10000 Bonus 160 USDT.</p>
                       
                    </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;