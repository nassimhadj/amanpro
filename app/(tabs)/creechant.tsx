import React, { useState,useEffect } from "react";
import {API_URL} from '../../config/api.config' ;
import AddressAutocomplete from "./adrresseauto";
import {
  Modal,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useChantier } from "./chantiercontext";

export default function CreerChantier({ navigation }) {
  const { addChantier } = useChantier();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rdv, setRdv] = useState({
    title: "",
    email: "",
    name: "",
    phone: "",
    address: "",
    description: "",
    status:"",
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
      allowsEditing: true,
      aspect: [4, 3],
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
      status: 'en cours',
      attachments: [],
      etapes: [],
    });
    navigation.goBack();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!rdv.title || !rdv.email || !rdv.name || !rdv.phone || !rdv.address || !rdv.description) {
      alert("Tous les champs doivent être remplis.");
      return false;
    }

    if (!validateEmail(rdv.email)) {
      alert("Email invalide.");
      return false;
    }

    if (rdv.phone.length !== 10) {
      alert("Le numéro de téléphone doit comporter 10 chiffres.");
      return false;
    }

    return true;
  };
 // In creechant.tsx, update your handleSubmit:
const handleSubmit = async () => {
  if (!validateForm()) return;
  console.log('Etapes being sent:', rdv.etapes);
  setIsSubmitting(true);
  try {
    const formData = new FormData();
    
    console.log('Creating FormData...');
    
    // Add basic fields
    formData.append('title', rdv.title);
    formData.append('email', rdv.email);
    formData.append('name', rdv.name);
    formData.append('phone', rdv.phone);
    formData.append('address', rdv.address);
    formData.append('description', rdv.description);
    formData.append('status','attente de demarrage') ;
    console.log('Added basic fields...');
    
    formData.append('etapes', JSON.stringify(rdv.etapes));
    console.log('Added etapes...');
    
    // Modified image handling
    for (let i = 0; i < rdv.attachments.length; i++) {
      const attachment = rdv.attachments[i];
      console.log('Processing attachment:', i);
      
      // Get the file name from the URI
      const uriParts = attachment.uri.split('/');
      const fileName = uriParts[uriParts.length - 1];

      formData.append('attachments', {
        uri: attachment.uri,
        type: 'image/jpeg',
        name: fileName,
      });
      
      console.log('Added attachment:', fileName);
    }

    console.log('FormData created, starting fetch...');
    
    // Log the entire FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    console.log('Starting fetch request...');
    
    const response = await fetch(API_URL+'/rdv', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      // Remove Content-Type header, let it be set automatically
    });

    console.log('Got response:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(errorText || 'Failed to create chantier');
    }

    const result = await response.json();
    console.log('Success result:', result);

    addChantier(result);
    alert("Chantier créé avec succès!");
    navigation.goBack();

  } catch (error) {
    console.error('Submission error:', error);
    alert('Erreur lors de la création: ' + error.message);
  } finally {
    setIsSubmitting(false);
  }
};
  // Add this function to test the connection
const testConnection = async () => {
  try {
    console.log('Before fetch call'); 
    const response = await fetch(API_URL+'/test');
    console.log('Connection test:', response.ok);
  } catch (error) {
    console.error('Connection error:', error);
  }
};

// Call it when component mounts
useEffect(() => {
  console.log('useEffect running...'); 
  testConnection();
}, []);
 

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={rdv.title}
            onChangeText={(text) => setRdv({ ...rdv, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={rdv.email}
            onChangeText={(text) => setRdv({ ...rdv, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={rdv.name}
            onChangeText={(text) => setRdv({ ...rdv, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={rdv.phone}
            onChangeText={(text) => setRdv({ ...rdv, phone: text })}
            keyboardType="numeric"
            maxLength={10}
          />
          <AddressAutocomplete
  value={rdv.address}
  onSelectAddress={(address) => setRdv({ ...rdv, address })}
  
/>
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
          <Text style={styles.sectionTitle}>pieces jointes:</Text>
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
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Créer</Text>
          )}
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
    marginBottom:30,
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
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.7
  }
});