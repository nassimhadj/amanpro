import React, { useEffect, useState } from "react";
import { Platform, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { API_URL } from "@/config/api.config";

interface Appointment {
  id: string;
  date: string;
  time: string;
  address: string;
  name: string;
  phone: string;
}

export default function RDVScreen() {
  const navigation = useNavigation();
  const [rdvs, setRdvs] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRdvs = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setRdvs(data);
    } catch (error) {
      console.error('Failed to load appointments', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRdvs();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Clean up past appointments
  const cleanupRDVs = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments/cleanup`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchRdvs(); // Refresh the list after cleanup
      }
    } catch (error) {
      console.error('Error cleaning up appointments:', error);
    }
  };

  const handleButtonPress = () => {
    // Implement navigation to add appointment screen
    navigation.navigate('ajoutrdv');
  };

  useEffect(() => {
    fetchRdvs();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchRdvs();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#000000']}
        />
      }
    >
      <View style={styles.vbutton}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Ajouter un RDV</Text>
        </TouchableOpacity>
      </View>

      {rdvs.map((rdv) => (
        <View key={rdv.id} style={styles.column}>
          <Text style={styles.grdtext}>
            {rdv.date} {rdv.time}
          </Text>
          <View style={styles.row}>
            <Image
              source={require('../../assets/images/map-pin.png')}
              style={styles.image}
            />
            <Text style={styles.mintext}>{rdv.address}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require('../../assets/images/Group 769.png')}
              style={styles.image}
            />
            <Text style={styles.mintext}>{rdv.name}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require('../../assets/images/phone.png')}
              style={styles.image}
            />
            <Text style={styles.mintext}>{rdv.phone}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  column: {
    padding: 10,
    width: '100%',
    flexDirection: 'column',
    borderRadius: 40,
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 3,
    gap: 20,
  },
  vbutton: {
    alignItems: 'center',
  },
  grdtext: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#333",
  },
  image: {
    width: 21,
    height: 24,
    marginRight: 15,
  },
  mintext: {
    fontSize: 18,
    color: "#555",
  },
  row: {
    flexDirection: 'row',
    marginLeft: 15,
    alignItems: 'flex-start',
    width: '100%',
  },
  button: {
    backgroundColor: "#000000",
    height: 40,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});