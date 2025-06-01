import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'amber' | 'purple';
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  change 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: 'bg-blue-200 text-blue-700',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: 'bg-red-200 text-red-700',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: 'bg-green-200 text-green-700',
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      icon: 'bg-amber-200 text-amber-700',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      icon: 'bg-purple-200 text-purple-700',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colorClasses[color].bg} rounded-xl p-6 shadow-sm`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold mt-1 ${colorClasses[color].text}`}>{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change.isPositive ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last 24h</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses[color].icon}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;