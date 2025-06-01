import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useDisaster } from '../../contexts/DisasterContext';
import { getCurrentLocation, simulateEmergencyChip } from '../../utils/geolocation';

const SOSButton: React.FC = () => {
  const { currentUser } = useAuth();
  const { createSOSAlert } = useDisaster();
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendSOS = async () => {
    if (!currentUser) return;
    
    setIsSending(true);
    
    try {
      const location = await getCurrentLocation();
      
      // Try to send via normal channel first
      if (navigator.onLine && !simulateEmergencyChip.isOfflineModeEnabled()) {
        await createSOSAlert({
          userId: currentUser.id,
          location,
          message: message || 'Emergency assistance needed',
          medicalInfo: currentUser.medicalInfo,
          priority: 'high',
        });
      } else {
        // Fall back to emergency chip simulation if offline
        await simulateEmergencyChip.sendSOS(
          message || 'Emergency assistance needed',
          location
        );
      }
      
      setSent(true);
      setTimeout(() => {
        setIsExpanded(false);
        setSent(false);
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending SOS:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-lg shadow-lg p-4 mb-4 w-72"
          >
            <h3 className="text-lg font-bold text-red-600 mb-2">Send Emergency SOS</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will alert emergency responders of your situation and location.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your emergency situation (optional)"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4 h-24"
              disabled={isSending || sent}
            />
            <button
              onClick={handleSendSOS}
              disabled={isSending || sent}
              className={`w-full py-2 rounded-lg font-medium text-white ${
                sent 
                  ? 'bg-green-600' 
                  : (isSending ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700')
              }`}
            >
              {sent ? 'SOS Sent!' : (isSending ? 'Sending...' : 'Send SOS Alert')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-center ${
          isExpanded ? 'bg-gray-700' : 'bg-red-600'
        } text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-colors`}
      >
        <AlertOctagon size={28} />
      </motion.button>
    </div>
  );
};

export default SOSButton;