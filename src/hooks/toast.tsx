import React, { createContext, useContext, useCallback, useState } from 'react';

import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

export interface ToastMessage {
  id: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  title: string;
}

const Toast = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ title, description, type }: Omit<ToastMessage, 'id'>) => {
      const message = {
        id: uuid(),
        title,
        description,
        type,
      };

      setMessages(state => [...state, message]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <Toast.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </Toast.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(Toast);

  if (!context) {
    throw Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { ToastProvider, useToast };
