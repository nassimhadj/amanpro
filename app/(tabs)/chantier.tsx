import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, RefreshControl , Alert } from "react-native";
import { useChantierTer } from "./chantiertercontext";
import { useChantier } from "./chantiercontext";
export default function Chantier({ route, navigation }) {
  const { chantier } = route.params || {}; // Safe destructuring
if (!chantier) {
  return <Text>Loading...</Text>; // Display a loading state if no chantier is available
} // Récupérer les données du chantier

  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedChantier, setUpdatedChantier] = useState(chantier); // State to store updated chantier
  const {  addChantierTer } = useChantierTer();
  const { chantiers, removeChantier } = useChantier();
  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request or context update to fetch updated data
    setTimeout(() => {
      setRefreshing(false);
      // Here you can re-fetch your chantier data or trigger an update from the context
    }, 1000); // Simulate network delay of 2 seconds
  };

  // Listen for when the screen comes back into focus (after modification)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.updatedChantier) {
        setUpdatedChantier(route.params.updatedChantier); // Update chantier data with modified values
      }
    });
   
    
    // Cleanup listener when the component is unmounted or navigation changes
    return unsubscribe;
  }, [navigation, route.params?.updatedChantier]);
  const handleMarkAsCompleted = (chantierId) => {
    const chantierToMove = chantiers.find((chantier) => chantier.id === chantierId);
  
    if (chantierToMove) {
      // Debugging: log the chantier to be moved
      addChantierTer(chantierToMove) ;
  
      // Remove the chantier from active chantiers
     
  removeChantier(chantierId);
        // Debugging: log the updated list of active chantiers
    alert("chantier terminé") ;
    navigation.goBack() ;
   
      }};
  
      // Add it to completed chantiers
     
  
      
  
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>{updatedChantier.title}</Text>
          <Text style={styles.text}>{updatedChantier.email}</Text>
          <Text style={styles.text}>{updatedChantier.name}</Text>
          <Text style={styles.text}>{updatedChantier.phone}</Text>
          <Text style={styles.text}>{updatedChantier.address}</Text>
          <Text style={styles.sectionTitle}>Descriptif:</Text>
          <Text style={styles.description}>{updatedChantier.description}</Text>

          {/* Render Etapes */}
         {updatedChantier.etapes && updatedChantier.etapes.length > 0 ? (
  updatedChantier.etapes.map((etape, index) => (
    <View key={index} style={styles.etape}>
      <Text style={styles.title}>{etape.title}</Text>
      <Text style={styles.description}>{etape.descriptif}</Text>
    </View>
  ))
) : (
  <Text style>No etapes available.</Text>  // Fallback text if no etapes exist
)}


          <Text style={styles.sectionTitle}>Pièces jointes:</Text>
          <View style={styles.imageRow}>
            {updatedChantier.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(attachment.uri)} // Afficher l'image en taille réelle
              >
                <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.vbutton}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("modchant", { chantier: updatedChantier })}
        >
          <Text style={styles.buttonText2}>modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
         onPress={() => handleMarkAsCompleted(updatedChantier.id)}>
          <Text style={styles.buttonText}>marquer terminé</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour afficher l'image en plein écran */}
      {selectedImage && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    marginBottom: 15,
    fontSize: 14,
    color: "#555",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  vbutton: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#000000",
    height: 40,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button2: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000",
    borderWidth: 2,
    height: 40,
    width: 125,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText2: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  etape: {
    marginBottom: 10,
  },
  etapeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  etapeDescription: {
    fontSize: 14,
    color: "#555",
  },
});