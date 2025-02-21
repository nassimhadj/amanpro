import React, { useState, useEffect } from "react";
import { BackHandler } from 'react-native';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, RefreshControl, Alert, TextInput } from "react-native";
import { useChantierTer } from "./chantiertercontext";
import { useChantier } from "./chantiercontext";
import { API_URL } from "@/config/api.config";

export default function chantpay({ route, navigation }) {
  const { chantier } = route.params || {};
  if (!chantier) {
    return <Text>Loading...</Text>;
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedChantier, setUpdatedChantier] = useState(chantier);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
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
      navigation.navigate('chants');
      return true;
    });
  
    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, route.params?.updatedChantier]);

  const handlepayement = () => {
    setPaymentAmount('');
    setIsPaymentModalVisible(true);
  };

  const handlePaymentSubmit = async (chantierId) => {
    if (!paymentAmount || isNaN(paymentAmount)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    try {
      const newEtape = {
        title: "Archivage du chantier",
        descriptif: `Chantier archivé le ${new Date().toLocaleDateString('fr-FR')} - Montant payé: ${paymentAmount}€`
      };

      const updatedEtapes = [...updatedChantier.etapes || [], newEtape];

      const response = await fetch(`${API_URL}/rdv/${updatedChantier._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'fini',
          etapes: updatedEtapes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedData = await response.json();
      addChantierTer(updatedData);
      removeChantier(chantierId);
      setIsPaymentModalVisible(false);
      alert("Chantier archivé");
      navigation.navigate('chants', { refresh: true });

    } catch (error) {
      console.error('Error archiving chantier:', error);
      alert("Erreur lors de l'archivage du chantier");
    }
  };

  const handelcancel = async (chantierId) => {
    try {
      const newEtape = {
        title: "Annulation du chantier",
        descriptif: `Chantier annulé le ${new Date().toLocaleDateString('fr-FR')}`
      };

      const updatedEtapes = [...updatedChantier.etapes || [], newEtape];

      const response = await fetch(`${API_URL}/rdv/${updatedChantier._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'annulé',
          etapes: updatedEtapes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedData = await response.json();
      setUpdatedChantier(updatedData);
      removeChantier(chantierId);
      alert("Chantier annulé");
      navigation.navigate('chantmsg', { refresh: true });
    } catch (error) {
      console.error('Error cancelling chantier:', error);
      alert("Erreur lors de l'annulation du chantier");
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
          onPress={() => handelcancel(updatedChantier.id)}
        >
          <Text style={styles.buttonText2}>annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={handlepayement}
        >
          <Text style={styles.buttonText}>archiver</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      <Modal
        visible={isPaymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Entrer le montant du paiement</Text>
            <TextInput
              style={styles.paymentInput}
              placeholder="Montant en €"
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsPaymentModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => handlePaymentSubmit(updatedChantier.id)}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Modal */}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 25,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
