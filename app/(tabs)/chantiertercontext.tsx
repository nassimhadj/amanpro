import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to handle circular references during JSON.stringify
const safeStringify = (obj) => {
  const cache = new Set();
  const result = JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return; // If the value has been visited, return undefined to avoid circular reference
      }
      cache.add(value);
    }
    return value;
  });
  return result;
};

// Create the chantierTer context
const ChantierTerContext = createContext();

// Create a provider for the context
export const ChantierTerProvider = ({ children }) => {
  const [chantierTers, setChantierTers] = useState([]); // Manage completed chantier data

  // Function to generate a unique ID for chantier
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9); // Simple unique ID generator
  };

  // Function to add a new chantier
  const addChantierTer = async (chantier) => {
    // Ensure the chantier has a valid ID before adding it
    if (!chantier.id) {
      chantier.id = generateId(); // Automatically assign an ID if not present
    }

    console.log("Adding chantier ter:", chantier);

    setChantierTers((prev) => {
      const newChantierTers = [...prev, chantier];
      AsyncStorage.setItem("chantierTers", safeStringify(newChantierTers)); // Use safe stringify to avoid circular references
      console.log("Chantiers ter after addition:", newChantierTers);
      return newChantierTers; // Return the updated list
    });
  };

  // Load chantier data from AsyncStorage when the component is mounted
  useEffect(() => {
    const loadChantiers = async () => {
      try {
        const storedChantiers = await AsyncStorage.getItem("chantierTers");
        if (storedChantiers) {
          setChantierTers(JSON.parse(storedChantiers)); // Parse the stored JSON
        }
      } catch (error) {
        console.error("Error loading chantier data from AsyncStorage", error);
      }
    };
    
    loadChantiers();
  }, []);

  return (
    <ChantierTerContext.Provider value={{ chantierTers, addChantierTer }}>
      {children}
    </ChantierTerContext.Provider>
  );
};

// Create a custom hook to use the chantierTer context
export const useChantierTer = () => {
  return useContext(ChantierTerContext);
};
