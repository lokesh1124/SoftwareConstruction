import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4 items-center">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  const colorMap = {
    success: 'text-[#6FFB85]',
    error: 'text-[#FF4D4D]',
    info: 'text-primary'
  };

  return (
    <div className="bg-[rgba(25,25,28,0.95)] backdrop-blur-3xl border border-white/10 rounded-2xl py-3 px-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto w-fit max-w-full">
      <span className={`material-symbols-outlined ${colorMap[toast.type]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {iconMap[toast.type]}
      </span>
      <p className="text-sm font-semibold text-white flex-1 whitespace-normal">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-on-surface-variant hover:text-white transition-colors ml-2 flex-shrink-0">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
