import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RdvContext = createContext();

export const RdvProvider = ({ children }) => {
  const [rdvs, setRdvs] = useState([]);

  // Load RDVs from AsyncStorage when the app loads
  useEffect(() => {
    const loadRdvs = async () => {
      try {
        const savedRdvs = await AsyncStorage.getItem('rdvs');
        if (savedRdvs) {
          setRdvs(JSON.parse(savedRdvs));
        }
      } catch (error) {
        console.error('Failed to load RDVs', error);
      }
    };

    loadRdvs();
  }, []);

  // Save RDVs to AsyncStorage whenever they change
  useEffect(() => {
    const saveRdvs = async () => {
      try {
        await AsyncStorage.setItem('rdvs', JSON.stringify(rdvs));
      } catch (error) {
        console.error('Failed to save RDVs', error);
      }
    };

    if (rdvs.length > 0) {
      saveRdvs();
    }
  }, [rdvs]);

  return (
    <RdvContext.Provider value={{ rdvs, setRdvs }}>
      {children}
    </RdvContext.Provider>
  );
};
