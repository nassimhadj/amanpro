import React, { useState, useContext } from "react";
import { Platform, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RdvContext } from "./rdvcontext";

export default function RDVScreen() {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate("ajoutrdv");
  };

  const { rdvs, setRdvs } = useContext(RdvContext);
  const [refreshing, setRefreshing] = useState(false);

  // Sort rdvs by datetime, closest to current time
  const sortedRdvs = [...rdvs].sort((a, b) => {
    const now = new Date();
    if (a.datetime < now && b.datetime < now) {
      return a.datetime - b.datetime; // Both past, sort by datetime
    }
    if (a.datetime >= now && b.datetime >= now) {
      return a.datetime - b.datetime; // Both future, sort by datetime
    }
    // One is in the future and one is in the past, show future ones first
    return a.datetime >= now ? -1 : 1;
  });

  // Cleanup RDVs by removing those that have passed
  const cleanupRDVs = () => {
    const now = new Date();
    const validRdvs = rdvs.filter(rdv => new Date(rdv.datetime) > now); // Filter out RDVs in the past
    setRdvs(validRdvs); // Update the RDVs in the context
  };

  // Trigger cleanup on pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    cleanupRDVs();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container} // Fix: use contentContainerStyle instead of style for child layout
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#000000']} // Customize refresh control colors if needed
        />
      }
    >
      <View style={styles.vbutton}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Ajouter un RDV</Text>
        </TouchableOpacity>
      </View>

      {sortedRdvs.map((rdv) => (
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
    alignItems: 'flex-start',  // Fix: Move alignItems here
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
