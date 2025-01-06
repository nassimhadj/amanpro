import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RdvContext } from './rdvcontext'; // Adjust the path if needed
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function Ajoutrdv() {
  const { rdvs, setRdvs } = useContext(RdvContext);

  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  // Load RDVs from AsyncStorage when the component mounts
  useEffect(() => {
    const loadRdvs = async () => {
      try {
        const storedRdvs = await AsyncStorage.getItem('rdvs');
        if (storedRdvs) {
          setRdvs(JSON.parse(storedRdvs)); // Parse and set RDVs if they exist
        }
      } catch (error) {
        console.error('Error loading RDVs:', error);
      }
    };

    loadRdvs();
  }, []);

  // Save RDVs to AsyncStorage whenever they change
  useEffect(() => {
    const saveRdvs = async () => {
      try {
        await AsyncStorage.setItem('rdvs', JSON.stringify(rdvs)); // Save RDVs as a JSON string
      } catch (error) {
        console.error('Error saving RDVs:', error);
      }
    };

    saveRdvs();
  }, [rdvs]); // Run every time rdvs change

  const handleAddRDV = () => {
    if (!address || !name || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs !');
      return;
    }

    const newRDV = {
      id: Math.random().toString(),
      name,
      address,
      phone,
      date: date.toLocaleDateString('en-GB'),
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      datetime: new Date(date.setHours(time.getHours(), time.getMinutes())),
    };

    // Check if the new RDV is in the past
    const now = new Date();
    if (newRDV.datetime < now) {
      Alert.alert('Erreur', 'La date et l\'heure du RDV sont déjà passées !');
      return;
    }

    // Add the new RDV and sort the list
    setRdvs(prevRdvs => {
      const updatedRdvs = [...prevRdvs, newRDV].sort((a, b) => a.datetime - b.datetime);
      return updatedRdvs;
    });

    Alert.alert('Succès', 'RDV ajouté avec succès !');
    clearForm();
  };

  const clearForm = () => {
    setAddress('');
    setName('');
    setPhone('');
    setDate(new Date());
    setTime(new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un RDV</Text>
      <View style={styles.column}>
        {/* Adresse */}
        <View style={styles.row}>
          <Image source={require('../../assets/images/map-pin.png')} style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Entrez l'adresse du RDV"
            placeholderTextColor="#888"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Nom */}
        <View style={styles.row}>
          <Image source={require('../../assets/images/Group 769.png')} style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Téléphone */}
        <View style={styles.row}>
          <Image source={require('../../assets/images/phone.png')} style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Entrez le numéro"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Picker de date */}
        <View style={styles.row}>
          <Image source={require('../../assets/images/calendar.png')} style={styles.image} />
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{date.toLocaleDateString('en-GB')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
          )}
        </View>

        {/* Picker de temps */}
        <View style={styles.row}>
          <Image source={require('../../assets/images/timer.png')} style={styles.image} />
          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
            <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} />
          )}
        </View>
      </View>

      {/* Bouton Ajouter */}
      <View style={styles.vbutton}>
        <TouchableOpacity style={styles.button} onPress={handleAddRDV}>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  column: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    gap: 20,
  },
  vbutton: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 40,
    textAlign: 'center',
    color: "#333",
  },
  image: {
    width: 43,
    height: 47,
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: "#000000",
    height: 40,
    width: 115,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
