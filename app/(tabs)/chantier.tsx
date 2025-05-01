import React, { useState, useEffect } from "react";
import { BackHandler } from 'react-native';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Modal, 
  TouchableOpacity, 
  RefreshControl, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { useChantierTer } from "./chantiertercontext";
import { useChantier } from "./chantiercontext";
import { API_URL } from "../../config/api.config";

export default function Chantier({ route, navigation }) {
  const { chantier } = route.params || {};
  if (!chantier) {
    return <Text>Loading...</Text>;
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedChantier, setUpdatedChantier] = useState(chantier);
  const { addChantierTer } = useChantierTer();
  const { chantiers, removeChantier } = useChantier();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const fetchUrl = `${API_URL}/rdv/${updatedChantier._id}`;
      console.log('Fetching from URL:', fetchUrl);

      const response = await fetch(fetchUrl);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error('Failed to refresh data');
      }

      const updatedData = await response.json();
      console.log('Received data:', updatedData);
      
      setUpdatedChantier(updatedData);
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.updatedChantier) {
        setUpdatedChantier(route.params.updatedChantier);
      }
    });
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('chants', { refresh: true });
      return true;
    });
  
    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, route.params?.updatedChantier]);

  const handleMarkAsCompleted = async (chantierId) => {
    try {
      const newEtape = {
        title: "Travaux terminés",
        descriptif: `Chantier marqué comme terminé le ${new Date().toLocaleDateString('fr-FR')}`
      };

      const currentEtapes = updatedChantier.etapes || [];
      const updatedEtapes = [...currentEtapes, newEtape];

      const response = await fetch(`${API_URL}/rdv/${updatedChantier._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'attente de facturation',
          etapes: updatedEtapes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedData = await response.json();
      addChantierTer(updatedData);
      removeChantier(chantierId);
      
      alert("Chantier terminé");
      navigation.navigate('chants', { refresh: true });

    } catch (error) {
      console.error('Error completing chantier:', error);
      alert("Erreur lors de la finalisation du chantier");
    }
  };

  const handleSAV = async (chantierId) => {
    try {
      const newEtape = {
        title: "Mise en SAV",
        descriptif: `Chantier mis en service après-vente le ${new Date().toLocaleDateString('fr-FR')}`
      };

      const currentEtapes = updatedChantier.etapes || [];
      const updatedEtapes = [...currentEtapes, newEtape];

      const response = await fetch(`${API_URL}/rdv/${updatedChantier._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'SAV',
          etapes: updatedEtapes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedData = await response.json();
      addChantierTer(updatedData);
      removeChantier(chantierId);
      
      alert("Chantier en SAV");
      navigation.navigate('chants', { refresh: true });

    } catch (error) {
      console.error('Error completing chantier:', error);
      alert("Erreur lors de la mise en SAV du chantier");
    }
  };

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
          <Text style={styles.title}>les etapes :</Text>
          {/* Render Etapes */}
          {updatedChantier.etapes && updatedChantier.etapes.length > 0 ? (
           
            updatedChantier.etapes.map((etape, index) => (
              <View key={index} style={styles.etape}>
                <Text style={styles.title}>{etape.title}</Text>
                <Text style={styles.description}>{etape.descriptif}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionTitle} >pas d'etapes disponibles</Text>  // Fallback text if no etapes exist
          )}

          <Text style={styles.sectionTitle}>Pièces jointes:</Text>
          <View style={styles.imageRow}>
            {updatedChantier.attachments && updatedChantier.attachments.map((attachment, index) => {
              const imageUri = attachment.uri 
                ? attachment.uri 
                : `${API_URL}/rdv/uploads/${attachment.filename}`;

              return (
                <View key={index} style={styles.attachmentContainer}>
                  <TouchableOpacity onPress={() => setSelectedImage(imageUri)}>
                    <Image 
                      source={{ uri: imageUri }}
                      style={styles.attachmentImage}
                      onError={(e) => console.log('Image error:', e.nativeEvent.error)}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.vbutton}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("modchant", { 
            chantier: updatedChantier,
            chantierId: updatedChantier._id
          })}
        >
          <Text style={styles.buttonText2}>modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleMarkAsCompleted(updatedChantier._id)}
        >
          <Text style={styles.buttonText}>marquer terminé</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button2}
          onPress={() => handleSAV(updatedChantier._id)}
        >
          <Text style={styles.buttonText2}>mettre SAV</Text>
        </TouchableOpacity>
      </View>

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

            {isImageLoading && (
              <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            )}

            <Image 
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color:"#0077b6"
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color:"#0077b6"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color:"#0077b6"
  },
  description: {
    marginBottom: 15,
    fontSize: 14,
    color: "#0077b6",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    justifyContent: "space-between",
  },
  attachmentContainer: {
    position: "relative",
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
    zIndex: 2,
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
    zIndex: 1,
  },
  vbutton: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0077b6",
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
    borderColor: "#0077b6",
    borderWidth: 2,
    height: 40,
    width: 125,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText2: {
    color: "#0077b6",
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
    color: "#0077b6",
  }
});