import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(localStorage.getItem('user_type'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem('user_type'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userType, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
