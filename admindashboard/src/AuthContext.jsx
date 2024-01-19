// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useAddress } from "@thirdweb-dev/react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const address = useAddress();

  useEffect(() => {
    if (address) {
      const storedToken = localStorage.getItem('walletToken-8c01910f5d85805c35ee554294b9e5a4');
      if (storedToken) {
        try {
          const decoded = jwt.decode(storedToken);
          if (decoded && decoded.storedToken && decoded.storedToken.authDetails) {
            setEmail(decoded.storedToken.authDetails.email);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    } else {
      setEmail(null);
    }
  }, [address]);

  return (
    <AuthContext.Provider value={{ email, address }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
