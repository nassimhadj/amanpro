import React, { useState, useEffect } from "react"; 
import { API_URL } from "../../config/api.config";
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
  Platform
} from "react-native";
import { useChantier } from "./chantiercontext";
import * as ImagePicker from "expo-image-picker";

export default function ModChant({ route, navigation }) {
  const [rdv, setRdv] = useState(route?.params?.chantier || { etapes: [], attachments: [] });
  const { chantierId } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false); 
  const [newEtape, setNewEtape] = useState({ title: "", descriptif: "" });
  const { chantiers, setChantiers } = useChantier();
 
  useEffect(() => {
    if (route?.params?.chantier) {
      setRdv(route.params.chantier);
    }
  }, [route?.params?.chantier]);
  
  useEffect(() => {
    const currentChantier = chantiers.find(
      (chantier) => chantier._id === route.params.chantierId
    );
    if (currentChantier) {
      setRdv(currentChantier);
    }
  }, [chantiers, route.params.chantierId]);
  useEffect(() => {
    const currentChantier = chantiers.find((chantier) => chantier.id === chantierId);
    if (currentChantier) {
      setRdv(currentChantier);
    }
  }, [chantiers, chantierId]);

  const modifyEtape = (index, field, value) => {
    const newEtapes = [...rdv?.etapes];
    newEtapes[index][field] = value;
    setRdv({ ...rdv, etapes: newEtapes });
  };

  const deleteEtape = (index) => {
    const newEtapes = rdv?.etapes?.filter((_, i) => i !== index);
    setRdv({ ...rdv, etapes: newEtapes });
  };

  const deleteAttachment = (index) => {
    const newAttachments = rdv?.attachments?.filter((_, i) => i !== index);
    setRdv({ ...rdv, attachments: newAttachments });
  };

  const addEtape = () => {
    if (newEtape.title && newEtape.descriptif) {
      setRdv({ ...rdv, etapes: [...rdv?.etapes, newEtape] });
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
      setRdv(prevRdv => ({
        ...prevRdv,
        attachments: [...prevRdv.attachments, { uri: imageUri }]
      }));
    }
  };
  
  
  const handleCancel = () => {
    navigation.goBack();
    alert("Modifications annulées!");
  };

  const handleApply = async () => {
    if (!rdv?.title || !rdv?.email) {
      alert("Title and Email are required!");
      return;
    }
  
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', rdv.title);
      formData.append('email', rdv.email);
      formData.append('name', rdv.name);
      formData.append('phone', rdv.phone);
      formData.append('address', rdv.address);
      formData.append('description', rdv.description);
      formData.append('status', rdv.status);
      formData.append('etapes', JSON.stringify(rdv.etapes));
  
      // Handle existing attachments
      const existingAttachments = rdv.attachments
        .filter(att => att.path) // Only those with path are existing
        .map(({filename, path, uploadDate}) => ({
          filename,
          path,
          uploadDate
        }));
  
      // Add existing attachments to formData
      formData.append('existingAttachments', JSON.stringify(existingAttachments));
  
      // Handle new attachments (those with uri)
      const newAttachments = rdv.attachments.filter(att => att.uri && !att.path);
      
      for (let i = 0; i < newAttachments.length; i++) {
        const attachment = newAttachments[i];
        console.log('Processing new attachment:', i);
        
        // Get the file name from the URI
        const uriParts = attachment.uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
  
        // Create the file object for the new attachment
        formData.append('attachments', {
          uri: attachment.uri,
          type: 'image/jpeg',
          name: fileName,
        });
        
        console.log('Added new attachment:', fileName);
      }
  
      console.log('Sending update request with formData:', {
        existingAttachments: existingAttachments.length,
        newAttachments: newAttachments.length
      });
  
      const response = await fetch(`${API_URL}/rdv/${rdv._id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update chantier: ${errorData}`);
      }
  
      const data = await response.json();
      
      // Update local state
      setRdv(data);
      
      // Update global chantiers state if needed
      setChantiers(prevChantiers => {
        const updatedChantiers = prevChantiers.map(chantier => 
          chantier._id === data._id ? data : chantier
        );
        return updatedChantiers;
      });
  
      alert("Changes applied successfully!");
      navigation.navigate("chantier", { chantier: data });
  
    } catch (error) {
      console.error('Failed to apply changes:', error);
      alert('Error: ' + error.message);
    }
  };
  
  const openImage = (uri) => {
    setIsImageLoading(true);
    setSelectedImage(uri);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setIsImageLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Champs de saisie */}
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={rdv?.title}
            onChangeText={(text) => setRdv({ ...rdv, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={rdv?.email}
            onChangeText={(text) => setRdv({ ...rdv, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={rdv?.name}
            onChangeText={(text) => setRdv({ ...rdv, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={rdv?.phone}
            onChangeText={(text) => setRdv({ ...rdv, phone: text })}
          />
          <AddressAutocomplete
  value={rdv.address}
  onSelectAddress={(address) => setRdv({ ...rdv, address })}
  
/>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            multiline
            value={rdv?.description}
            onChangeText={(text) => setRdv({ ...rdv, description: text })}
          />
          <Text style={styles.sectionTitle}>Étapes:</Text>
          {rdv?.etapes?.map((etape, index) => (
            <View key={index} style={styles.etape}>
              <View style={styles.Row}>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={etape?.title}
                  onChangeText={(text) => modifyEtape(index, "title", text)}
                />
                <TouchableOpacity onPress={() => deleteEtape(index)}>
                  <Image
                    source={require('../../assets/images/Vector.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Description"
                multiline
                value={etape?.descriptif}
                onChangeText={(text) => modifyEtape(index, "descriptif", text)}
              />
            </View>
          ))}
          <Text style={styles.sectionTitle}>Add Étape:</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newEtape?.title}
            onChangeText={(text) => setNewEtape({ ...newEtape, title: text })}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Description"
            multiline
            value={newEtape?.descriptif}
            onChangeText={(text) =>
              setNewEtape({ ...newEtape, descriptif: text })
            }
          />
          <TouchableOpacity onPress={addEtape} style={styles.button2}>
            <Text style={styles.buttonText2}>Add Étape</Text>
          </TouchableOpacity>

          {/* Section des pièces jointes */}
          <Text style={styles.sectionTitle}>Pièces jointes:</Text>
          <TouchableOpacity onPress={addImage} style={styles.button2}>
            <Text style={styles.buttonText2}>Add Image</Text>
          </TouchableOpacity>
          <View style={styles.imageRow}>
  {rdv?.attachments?.map((attachment, index) => {
    const imageUri = attachment.uri 
      ? attachment.uri  // For new images
      : `${API_URL}/rdv/uploads/${attachment.filename}`; // For server images
    
    console.log('Trying to load image from:', imageUri);

    return (
      <View key={index} style={styles.attachmentContainer}>
        <TouchableOpacity onPress={() => openImage(imageUri)}>
          <Image 
            source={{ uri: imageUri }}
            style={styles.attachmentImage}
            onError={(e) => console.log('Image error:', e.nativeEvent.error)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteAttachment(index)}
          style={styles.deleteButtonIcon}
        >
          <Image
            source={require('../../assets/images/Vector.png')}
            style={styles.deleteIconImage}
          />
        </TouchableOpacity>
      </View>
    );
  })}
</View>
  
 
        </View>
      </ScrollView>

      {/* Boutons Annuler et Appliquer */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleCancel} style={styles.button}>
          <Text style={styles.buttonText}>annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleApply} style={styles.button}>
          <Text style={styles.buttonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour l'image */}
      {selectedImage && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={true}
          onRequestClose={closeImage}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={closeImage}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            {/* Indicateur de chargement pendant le chargement de l'image */}
            {isImageLoading && (
              <ActivityIndicator size="large" color="#000" style={styles.loader} />
            )}

            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              onLoadEnd={() => setIsImageLoading(false)} // Cache le loader une fois l'image chargée
            />
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
    gap: 10,
  },
  image: {
    width: 33,
    height: 40,
    marginRight: 15,
  },
  deleteButtonIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 15,
    padding: 5,
  },
  deleteIconImage: {
    width: 20,
    height: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  button: {
    backgroundColor: "#000",
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
});
