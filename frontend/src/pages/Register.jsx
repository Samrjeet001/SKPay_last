import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const signup = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      
      // Redirect to login page or perform other actions
      navigate('/login')
      // window.location.href = '/login'; // Example redirection
    } else {
      document.getElementById('msg').innerHTML='An error occurred during signup.'
      // alert(data.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-lg p-4 sm:p-8">
        <div className="relative">
          <img
            alt="Cryptocurrency symbols and graphics"
            className="w-full h-48 sm:h-64 object-cover rounded-t-lg"
            height="256"
            src="https://storage.googleapis.com/a1aa/image/Y48bxE9Evf0nYiDc93VAcoDsgVyhOnBTUdIGq1urfDdIYK7TA.jpg"
            width="512"
          />
        </div>
        <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
            Create Your Account
          </h2>
          <form id="signupForm" onSubmit={signup}>
            <div className="mb-4 sm:mb-6">
              <input
                className="w-full px-4 py-2 sm:py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <input
                className="w-full px-4 py-2 sm:py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 sm:mb-6 password-container relative">
              <input
                className="w-full px-4 py-2 sm:py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                id="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer`}
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="mb-4 sm:mb-6 password-container relative">
              <input
                className="w-full px-4 py-2 sm:py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                id="confirmPassword"
                placeholder="Re-enter Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer`}
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
            <div className="mt-4 text-red-400 text-center text-sm">
                        <p  id='msg'></p>
                    </div>
            <button
              className="w-full py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
              type="submit"
            >
              Sign Up
            </button>
            <div className="text-center mt-4 sm:mt-6">
              <Link to="/login" className="text-sm text-gray-400">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;