import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '@/config/api.config';

export const RdvContext = createContext();

export const RdvProvider = ({ children }) => {
  const [rdvs, setRdvs] = useState([]);

  const fetchRdvs = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setRdvs(data);
    } catch (error) {
      console.error('Failed to load appointments', error);
    }
  };

  useEffect(() => {
    fetchRdvs();
  }, []);

  return (
    <RdvContext.Provider value={{ rdvs, setRdvs, fetchRdvs }}>
      {children}
    </RdvContext.Provider>
  );
};