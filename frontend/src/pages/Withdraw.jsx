import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
    const [userData, setUserData] = useState({
        upiId: '',
        mobileNumber: '',
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        branchAddress: ''
    });
    const [isEditing, setIsEditing] = useState(false);
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
                const data = await response.json();
                setUserData(data);
            } else {
                
                navigate('/login')
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const enableEditing = () => {
        setIsEditing(true);
    };

    const saveUserData = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/user/me`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Include token in the Authorization header
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            navigate('/withdraw');
            setIsEditing(false);
        } else {
            alert('Failed to save data');
        }
    };

    const handleContinue = () => {
        navigate("/withdrew")
    };

    return (
        <div className="bg-gray-900 text-white">
            <div className="flex items-center justify-between bg-green-600 p-4 text-white w-full">
                <a href="/">
                    <i className="fas fa-arrow-left"></i>
                </a>
                <h1 className="text-lg">Withdraw</h1>
                <a >
                    <i className="fas fa-ellipsis-v"></i>
                </a>
            </div>
            <div className="mt-4 p-4">
                <div className="flex justify-end mb-4">
                    <button onClick={enableEditing} className="bg-blue-600 text-white py-2 px-4 rounded flex items-center transition duration-300 ease-in-out transform hover:bg-blue-700 active:scale-95">
                        <i className="fas fa-edit mr-2"></i>
                        Edit
                    </button>
                </div>
                <h2 className="text-xl mb-4">Bank Account Information</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="upiId">UPI ID</label>
                        <input
                            type="text"
                            id="upiId"
                            value={userData.upiId}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="mobileNumber">Mobile Number</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            value={userData.mobileNumber}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="accountHolder">Account Holder Name</label>
                        <input
                            type="text"
                            id="accountHolder"
                            value={userData.accountHolder}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="accountNumber">Account Number</label>
                        <input
                            type="text"
                            id="accountNumber"
                            value={userData.accountNumber}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="bankName">Bank Name</label>
                        <input
                            type="text"
                            id="bankName"
                            value={userData.bankName}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="ifscCode">IFSC Code</label>
                        <input
                            type="text"
                            id="ifscCode"
                            value={userData.ifscCode}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="branchAddress">Branch Address</label>
                        <input
                            type="text"
                            id="branchAddress"
                            value={userData.branchAddress}
                            onChange={handleChange}
                            placeholder="Please Enter Your Details Here"
                            className="w-full p-2 border rounded bg-gray-800 text-gray-300 border-gray-700"
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={isEditing ? saveUserData : handleContinue}
                            className="w-full bg-green-600 text-white py-2 rounded flex items-center justify-between px-4 transition duration-300 ease-in-out transform hover:bg-green-700 active:scale-95"
                        >
                            <span>{isEditing ? 'Save' : 'Continue'}</span>
                            <i className={`fas fa-${isEditing ? 'save' : 'arrow-right'}`}></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Withdraw;