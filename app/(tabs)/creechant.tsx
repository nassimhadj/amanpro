import React, { useState } from "react";
import {
  Modal,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator, // Importer l'indicateur de chargement
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useChantier } from "./chantiercontext"; // Importer le context pour ajouter un chantier

export default function creerchant({ navigation }) {
  const { addChantier } = useChantier(); // Récupérer la fonction pour ajouter un chantier

  const [rdv, setRdv] = useState({
    title: "",
    email: "",
    name: "",
    phone: "",
    address: "",
    description: "",
    attachments: [],
    etapes: [],
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [newEtape, setNewEtape] = useState({ title: "", descriptif: "" });

  const modifyEtape = (index, field, value) => {
    const newEtapes = [...rdv.etapes];
    newEtapes[index][field] = value;
    setRdv({ ...rdv, etapes: newEtapes });
  };

  const deleteEtape = (index) => {
    const newEtapes = rdv.etapes.filter((_, i) => i !== index);
    setRdv({ ...rdv, etapes: newEtapes });
  };

  const deleteAttachment = (index) => {
    const newAttachments = rdv.attachments.filter((_, i) => i !== index);
    setRdv({ ...rdv, attachments: newAttachments });
  };

  const addEtape = () => {
    if (newEtape.title && newEtape.descriptif) {
      setRdv({ ...rdv, etapes: [...rdv.etapes, newEtape] });
      setNewEtape({ title: "", descriptif: "" });
    }
  };

  const addImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setRdv((prevRdv) => ({
        ...prevRdv,
        attachments: [...prevRdv.attachments, { uri: imageUri }],
      }));
    }
  };

  const handleCancel = () => {
    setRdv({
      title: "",
      email: "",
      name: "",
      phone: "",
      address: "",
      description: "",
      attachments: [],
      etapes: [],
    });
    navigation.goBack(); // Revenir en arrière quand on annule
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    // Vérification des champs
    if (!rdv.title || !rdv.email || !rdv.name || !rdv.phone || !rdv.address || !rdv.description) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    if (!validateEmail(rdv.email)) {
      alert("Email invalide.");
      return;
    }

    if (rdv.phone.length !== 10) {
      alert("Le numéro de téléphone doit comporter 10 chiffres.");
      return;
    }

    // Ajouter le chantier au contexte
    addChantier(rdv);

    // Réinitialiser les champs
    setRdv({
      title: "",
      email: "",
      name: "",
      phone: "",
      address: "",
      description: "",
      attachments: [],
      etapes: [],
    });

    alert("Chantier créé avec succès!");
    navigation.goBack(); // Revenir à la page précédente après la création
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Champ titre */}
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={rdv.title}
            onChangeText={(text) => setRdv({ ...rdv, title: text })}
          />
          {/* Champ email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={rdv.email}
            onChangeText={(text) => setRdv({ ...rdv, email: text })}
          />
          {/* Champ nom */}
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={rdv.name}
            onChangeText={(text) => setRdv({ ...rdv, name: text })}
          />
          {/* Champ téléphone */}
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={rdv.phone}
            onChangeText={(text) => setRdv({ ...rdv, phone: text })}
            keyboardType="numeric"
            maxLength={10} // Limite à 10 chiffres
          />
          {/* Champ adresse */}
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={rdv.address}
            onChangeText={(text) => setRdv({ ...rdv, address: text })}
          />
          {/* Champ description */}
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            multiline
            value={rdv.description}
            onChangeText={(text) => setRdv({ ...rdv, description: text })}
          />
          <Text style={styles.sectionTitle}>Étapes:</Text>
          {rdv.etapes.map((etape, index) => (
            <View key={index} style={styles.etape}>
              <TextInput
                style={styles.input}
                placeholder="Titre de l'étape"
                value={etape.title}
                onChangeText={(text) => modifyEtape(index, "title", text)}
              />
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Description de l'étape"
                multiline
                value={etape.descriptif}
                onChangeText={(text) =>
                  modifyEtape(index, "descriptif", text)
                }
              />
            </View>
          ))}

          {/* Ajout d'une nouvelle étape */}
          <TextInput
            style={styles.input}
            placeholder="Titre de l'étape"
            value={newEtape.title}
            onChangeText={(text) => setNewEtape({ ...newEtape, title: text })}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Description de l'étape"
            multiline
            value={newEtape.descriptif}
            onChangeText={(text) =>
              setNewEtape({ ...newEtape, descriptif: text })
            }
          />
          <TouchableOpacity onPress={addEtape} style={styles.button2}>
            <Text style={styles.buttonText2}>Ajouter l'étape</Text>
          </TouchableOpacity>

          {/* Pièces jointes */}
          <TouchableOpacity onPress={addImage} style={styles.button2}>
            <Text style={styles.buttonText2}>Ajouter image</Text>
          </TouchableOpacity>

          <View style={styles.imageRow}>
            {rdv.attachments.map((attachment, index) => (
              <Image key={index} source={{ uri: attachment.uri }} style={styles.attachmentImage} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleCancel} style={styles.button}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Créer</Text>
        </TouchableOpacity>
      </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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
  loader: {
    position: "absolute",
    top: "40%",
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
  attachmentContainer: {
    position: "relative",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  etape: {
    marginBottom: 10,
  },
  Row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    width: "45%",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButtonIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  deleteIconImage: {
    width: 20,
    height: 20,
  },
});