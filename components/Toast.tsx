import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <XCircle size={20} className="text-red-600" />,
    info: <Info size={20} className="text-blue-600" />
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${styles[type]} transition-all duration-500 animate-[slideIn_0.3s_ease-out]`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors">
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;