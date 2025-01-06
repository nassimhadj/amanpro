import React, { useState } from "react";
import {
  Modal,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const rdv = {
    title: "Objet Objet",
    email: "nsmhadj@gmail.com",
    name: "Hadjebar Nassim",
    phone: "0748418023",
    address: "3 allée du vieux chene, 49000 Angers",
    description:
      "text text text text text text text text text text text text text text textext texte textetxt texte etxet text text text text text text text text text text text text text textext texte textetxt texte etxet text tetext text text text text text text text text text text text text text text textext texte textetxt texte etxettext text text text text text text text text text text text text text text textext texte textetxt texte etxettext text text text text text text text text text text text text text text textext texte textetxt texte etxettext text text text text text text text text text text text text textext texte textetxt texte etxettext text text text text text text text text text text text text text textext texte textetxt texte etxetxt text text text text text text text text text text text text text textext texte textetxt texte etxet",
    attachments: [
      { uri: "https://via.placeholder.com/150/0000FF?text=Image1" },
      { uri: "https://via.placeholder.com/150/FF0000?text=Image2" },
      { uri: "https://via.placeholder.com/150/00FF00?text=Image3" },
      { uri: "https://via.placeholder.com/150/FFFF00?text=Image4" },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{rdv.title}</Text>
          <Text style={styles.text}>{rdv.email}</Text>
          <Text style={styles.text}>{rdv.name}</Text>
          <Text style={styles.text}>{rdv.phone}</Text>
          <Text style={styles.text}>{rdv.address}</Text>
          <Text style={styles.sectionTitle}>Descriptif:</Text>
          <Text style={styles.description}>{rdv.description}</Text>
          <Text style={styles.sectionTitle}>Pièces jointes:</Text>
          <View style={styles.imageRow}>
            {rdv.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(attachment.uri)}
              >
                <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      

      <View style={styles.vbutton}>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.buttonText2}>refuser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>accepter</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      {/* Modal for displaying full-size image */}
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
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#000000",
    height: 40,
    width: 125,
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
});
