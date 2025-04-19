import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('current');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const foodRequests = [
    {
      id: 1,
      name: 'John Doe',
      distance: '2.5 km',
      location: '123 Main St',
      type: 'Farmer',
      quantity: '50 kg',
      foodType: 'Vegetables'
    },
    {
      id: 2,
      name: 'Jane Smith',
      distance: '1.8 km',
      location: '456 Oak Ave',
      type: 'Retailer',
      quantity: '100 kg',
      foodType: 'Fruits'
    },
    // Add more sample data as needed
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'current'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Current Listings
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'previous'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Previous Listings
            </button>
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === 'settings'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {request.name}
                  </h3>
                  <p className="text-sm text-gray-500">{request.type}</p>
                </div>
                <span className="text-sm text-gray-500">{request.distance}</span>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {request.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Food Type:</span> {request.foodType}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span> {request.quantity}
                </p>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800">
                  View Map
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Claim Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
