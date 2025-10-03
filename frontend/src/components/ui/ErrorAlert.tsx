"use client";

import React from 'react';
import { AlertCircle, X, Mail, Lock, User, Wifi, AlertTriangle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  type?: 'email' | 'password' | 'account' | 'network' | 'general';
  suggestions?: string[];
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  type = 'general', 
  suggestions = [], 
  onClose 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'password':
        return <Lock className="h-5 w-5" />;
      case 'account':
        return <User className="h-5 w-5" />;
      case 'network':
        return <Wifi className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'email':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'password':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'account':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'network':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconColorClasses = () => {
    switch (type) {
      case 'email':
        return 'text-blue-500';
      case 'password':
        return 'text-yellow-500';
      case 'account':
        return 'text-red-500';
      case 'network':
        return 'text-purple-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getColorClasses()}`} dir="rtl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${getIconColorClasses()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{message}</p>
            {suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium mb-1">نصائح للحل:</p>
                <ul className="text-xs space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="إغلاق التنبيه"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;