import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChantierContext = createContext();

export const useChantier = () => useContext(ChantierContext);

export const ChantierProvider = ({ children }) => {
  const [chantiers, setChantiers] = useState([]);

  // Load chantiers from AsyncStorage
  const loadChantiers = async () => {
    try {
      const storedChantiers = await AsyncStorage.getItem("chantiers");
      if (storedChantiers) {
        const parsedChantiers = JSON.parse(storedChantiers);
        // Ensure valid data
        const validChantiers = parsedChantiers.filter(
          (chantier) => chantier && typeof chantier === "object"
        );
        setChantiers(validChantiers); // Update the state only if valid data exists
        console.log("Chantiers loaded from AsyncStorage:", validChantiers);
      } else {
        console.log("No chantiers found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error loading chantiers from AsyncStorage", error);
    }
  };

  const generateId = () => {
    return Date.now(); // This ensures that each ID is unique based on the current timestamp
  };

  const addChantier = async (chantier) => {
    // Ensure the chantier has a valid ID before adding it
    if (!chantier.id) {
      chantier.id = generateId(); // Automatically assign an ID if not present
    }

    console.log("Adding chantier:", chantier);

    // Use functional update to safely update the state
    setChantiers((prevChantiers) => {
      const newChantiers = [...prevChantiers, chantier];
      AsyncStorage.setItem("chantiers", JSON.stringify(newChantiers)); // Save to AsyncStorage
      console.log("Chantiers after addition:", newChantiers);
      return newChantiers; // Return the updated list
    });
  };

  const removeChantier = async (chantierId) => {
    console.log("Removing chantier with ID:", chantierId);

    // Use functional update to safely update the state
    setChantiers((prevChantiers) => {
      const updatedChantiers = prevChantiers.filter(
        (chantier) => chantier.id !== chantierId
      );
      AsyncStorage.setItem("chantiers", JSON.stringify(updatedChantiers)); // Save to AsyncStorage
      console.log("Chantiers after removal:", updatedChantiers);
      return updatedChantiers; // Return the updated list
    });
  };

  // Filter chantiers based on search criteria
  const filterChantiers = (searchQuery) => {
    console.log("Filtering chantiers with query:", searchQuery);
    return chantiers
      .filter((chantier) => chantier && typeof chantier === "object")
      .filter((chantier) => {
        return (
          chantier.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chantier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chantier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chantier.phone.includes(searchQuery) ||
          chantier.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  };

  // Load chantiers when the component mounts
  useEffect(() => {
    loadChantiers();
  }, []);

  return (
    <ChantierContext.Provider
      value={{ chantiers, addChantier, removeChantier, filterChantiers }}
    >
      {children}
    </ChantierContext.Provider>
  );
};
