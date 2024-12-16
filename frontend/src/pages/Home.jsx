import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [index, setIndex] = useState(0);
  const [amount, setAmount] = useState('');
  const [userData, setUserData] = useState(null); // State to hold user data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu
  const currentRate = 96; // Current rate in INR
  const navigate = useNavigate();

  const slides = [
    {
      alt: "A detailed description of a Bitcoin image",
      src: "https://storage.googleapis.com/a1aa/image/NSSgwFCIvd5oLZ7A5yuj3QSdzxQOj4H47Ja69GJEljfqdm9JA.jpg"
    },
    {
      alt: "A detailed description of an Ethereum image",
      src: "https://storage.googleapis.com/a1aa/image/Y9xk9a1eNTWEGaXGFzqmQL1bZTHIG4iDT7NDXz1KVqHpdm9JA.jpg"
    },
    {
      alt: "A detailed description of a Litecoin image",
      src: "https://storage.googleapis.com/a1aa/image/9cABWeB3VnXIJyOZgdXJZG10WZ1ol23qHLtWe47pUzaW7M7TA.jpg"
    },
    {
      alt: "A detailed description of a Ripple image",
      src: "https://storage.googleapis.com/a1aa/image/aHxL2NTynezETKgEIJun8OImEBXl9yxn2rIAB55es73T7M7TA.jpg"
    },
    {
      alt: "A detailed description of a Dogecoin image",
      src: "https://storage.googleapis.com/a1aa/image/50hAPmPxEtqFBBhUWrchrXAVIKsei0J6Fr9tYngZyNGodm9JA.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      fetchUserData(token); // Fetch user data if token exists
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Set user data in state
      } else {
        console.error('Failed to fetch user data:', response.statusText);
        // alert('Failed to fetch user data. Please log in again.');
        localStorage.removeItem('token'); // Clear token if fetch fails
        navigate('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // alert('An error occurred while fetching user data.');
      localStorage.removeItem('token'); // Clear token on error
      navigate('/login'); // Redirect to login
    }
  };

  const handleDotClick = (i) => {
    setIndex(i);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const calculateINR = () => {
    return amount * currentRate;
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to login page
  };

  const toggleDropdown = () => {
    setIsDropdownOpen (!isDropdownOpen);
  };

  return (
    <div className="font-poppins bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl text-gray-100 flex items-center">
            Home
          </div>
          <nav className="hidden md:flex space-x-4">
            <a>{userData ? userData.balance : 'User '}</a>
            <a href="https://wa.me/message/OHVGTOHS46BBB1">Whatsapp Help</a>
            <a href="https://t.me/+TCFZcU8CAe4xYTFl">Telegram Help</a>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-100">Logout</button>
          </nav>
          <div className="md:hidden relative">
            <button onClick={toggleDropdown} className="text-gray-400 hover:text-gray-100 focus:outline-none text-2xl">
              <i className="fas fa-bars"></i>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                <span className="block px-4 py-2 text-gray-400">Balance: {userData ? userData.balance : 'Loading...'}</span>
                <span className="block px-4 py-2 text-gray-400"><a href="https://wa.me/message/OHVGTOHS46BBB1">Whatsapp Help</a></span>
                <span className="block px-4 py-2 text-gray-400"><a href="https://t.me/+TCFZcU8CAe4xYTFl">Telegram Help</a></span>
                
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-700">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-4">
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg border border-gray-700 mb-8">
          <div className="flex transition-transform duration-500 ease-in-out transform-gpu" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((slide, i) => (
              <div className="w-full flex-shrink-0" key={i}>
                <img alt={slide.alt} className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md" src={slide.src} />
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 space-x-2" id="dots">
            {slides.map((_, i) => (
              <button className={`w-3 h-3 rounded-full ${i === index ? 'bg-gray-100' : 'bg-gray-400'}`} key={i} onClick={() => handleDotClick(i)}></button>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={() => { navigate('/deposit') }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded text-lg">Deposit</button>
          <button onClick={() => { navigate('/withdraw') }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded text-lg">Withdraw</button>
        </div>
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Exchange Calculator</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="amount">Amount in USDT:</label>
              <input className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" id="amount" name="amount" value={amount} onChange={handleAmountChange} type="text" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" id="amount-inr">Amount: {calculateINR()} INR</label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" id="current-rate">Current rate: {currentRate} INR</label>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;