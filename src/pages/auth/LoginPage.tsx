import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, provide quick login options
  const handleQuickLogin = async (role: string) => {
    let demoEmail = '';
    
    switch (role) {
      case 'admin':
        demoEmail = 'admin@relieflink.org';
        break;
      case 'responder':
        demoEmail = 'responder@relieflink.org';
        break;
      case 'volunteer':
        demoEmail = 'volunteer@relieflink.org';
        break;
      case 'civilian':
        demoEmail = 'civilian@relieflink.org';
        break;
      default:
        return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(demoEmail, 'password');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in with demo account.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-blue-700 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <Shield size={48} />
          </div>
          <h1 className="text-3xl font-bold">ReliefLink</h1>
          <p className="mt-2 text-blue-100">AI-Powered Disaster Relief Platform</p>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start rounded">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Quick login for demo:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickLogin('responder')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                Responder
              </button>
              <button
                onClick={() => handleQuickLogin('volunteer')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                Volunteer
              </button>
              <button
                onClick={() => handleQuickLogin('civilian')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                Civilian
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <p className="mt-8 text-sm text-gray-600">
        This is a simulation. Emergency chip features are simulated in-browser.
      </p>
    </div>
  );
};

export default LoginPage;