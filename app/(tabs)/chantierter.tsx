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

export default function Chantierter({ route, navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { rdv } = route.params || {}; // Get the passed data

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

          {/* Render Etapes */}
          {rdv.etapes && rdv.etapes.length > 0 ? (
            rdv.etapes.map((etape, index) => (
              <View key={index} style={styles.etape}>
                <Text style={styles.title}>{etape.title}</Text>
                <Text style={styles.description}>{etape.descriptif}</Text>
              </View>
            ))
          ) : (
            <Text>No steps available.</Text>
          )}

          <Text style={styles.sectionTitle}>Pièces jointes:</Text>
          <View style={styles.imageRow}>
            {rdv.attachments && rdv.attachments.length > 0 ? (
              rdv.attachments.map((attachment, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(attachment.uri)}
                >
                  <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                </TouchableOpacity>
              ))
            ) : (
              <Text>No attachments available.</Text>
            )}
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0)",
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
