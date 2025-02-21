import React, { createContext, useState, useContext } from "react";

const ChantierContext = createContext();

export const useChantier = () => useContext(ChantierContext);

export const ChantierProvider = ({ children }) => {
  const [chantiers, setChantiers] = useState([]);

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

  // Add a new chantier
  const addChantier = (chantier) => {
    console.log("Adding chantier:", chantier);
    setChantiers((prevChantiers) => [...prevChantiers, chantier]);
  };

  // Remove a chantier
  const removeChantier = (chantierId) => {
    console.log("Removing chantier with ID:", chantierId);
    setChantiers((prevChantiers) => 
      prevChantiers.filter((chantier) => chantier.id !== chantierId)
    );
  };

  return (
    <ChantierContext.Provider
      value={{ 
        chantiers, 
        setChantiers,  // Added this to expose setChantiers
        addChantier, 
        removeChantier, 
        filterChantiers 
      }}
    >
      {children}
    </ChantierContext.Provider>
  );
};