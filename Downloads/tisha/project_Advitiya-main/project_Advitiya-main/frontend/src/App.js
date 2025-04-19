import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import './index.css';
import NgosCarousel from "./components/carousel";
import Navbar from './components/navbar'; 
import Footer from "./components/footer";
import Login from "./components/login";
import HowItWorks from './components/work'
import FoodWasteAwareness from './components/aware'
import SocialImpact from './components/impact'
import Ngosign from './components/ngosign'
import FarmerSurplus from "./components/addfood";
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/dashboard';

// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:8000';

// Add request interceptor to handle errors
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  const [ngoData, setNgoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/ngo/list/");
        setNgoData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching NGO data:", error);
        setError("Failed to fetch NGO data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  const HomePage = () => (
    <>
      <NgosCarousel />
      <HowItWorks />
      <FoodWasteAwareness />
      <SocialImpact />
      {/* Display NGO Data */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Registered NGOs</h2>
        {loading ? (
          <div>Loading NGO data...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ngoData.map((ngo) => (
              <div key={ngo.id} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900">{ngo.organization}</h3>
                <p className="mt-2 text-gray-600">{ngo.city}, {ngo.state}</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Contact: {ngo.phone_number}</p>
                  <p className="text-sm text-gray-500">Email: {ngo.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/ngo/signup" element={<Ngosign />} />
        <Route path="/farmer-retailer/signup" element={<div>Farmer/Retailer Signup Page</div>} />
        <Route 
          path="/addfood" 
          element={
            <ProtectedRoute>
              <FarmerSurplus />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
