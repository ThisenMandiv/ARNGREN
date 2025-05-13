import { useState, useCallback } from 'react';

const useToastNotification = () => {
  const [toast, setToast] = useState({
    type: '',
    message: '',
    isVisible: false
  });

  const showToast = useCallback((type, message) => {
    setToast({
      type,
      message,
      isVisible: true
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  return { toast, showToast, hideToast };
};

export default useToastNotification; 