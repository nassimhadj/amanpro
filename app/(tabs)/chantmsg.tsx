import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

export default function App() {
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input
  const rdvs = [
    {
      id: 1,
      title: "objet 1",
      date: "mercredi 21 novembre",
      hour: "16:30",
      email: "nsmhadj@gmail.com",
      address: "3 alle de vieux chene , ecuille",
      name: "nassim hadjebar",
      phone: "0748418023",
    },
    {
      id: 2,
      date: "jeudi 22 novembre",
      title: "objet 2",
      email: "nsmhadj@gmail.com",
      hour: "16:30",
      address: "4 rue de la paix , Paris",
      name: "amine bouzid",
      phone: "0756342011",
    },
    {
      id: 3,
      title: "objet 3",
      date: "vendredi 23 novembre",
      hour: "14:30",
      email: "sara@gmail.com",
      address: "12 avenue Champs, Lyon",
      name: "sara benamar",
      phone: "0789012345",
    },
    {
      id: 4,
      title: "objet 4",
      date: "samedi 24 novembre",
      hour: "09:00",
      email: "yasmine@gmail.com",
      address: "6 boulevard Haussmann, Marseille",
      name: "yasmine saad",
      phone: "0765432109",
    },
    {
      id: 5,
      title: "objet 5",
      date: "dimanche 25 novembre",
      hour: "11:15",
      email: "rachid@gmail.com",
      address: "8 rue Jean Jaurès, Toulouse",
      name: "rachid messaoudi",
      phone: "0712345678",
    },
    // Add more RDVs as needed
  ];

  // Filter the RDVs based on the search query
  const filteredRdvs = rdvs.filter((rdv) => {
    const query = searchQuery.toLowerCase();
    return (
      rdv.title.toLowerCase().includes(query) ||
      rdv.name.toLowerCase().includes(query) ||
      rdv.email.toLowerCase().includes(query) ||
      rdv.phone.includes(query) ||
      rdv.address.toLowerCase().includes(query)
    );
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.barrech}>
          <Image
            source={require("../../assets/images/search.png")} // Adjust the path to your image
            style={styles.image}
          />
          <TextInput
            style={styles.input}
            placeholder="Search..." // Add placeholder text
            value={searchQuery} // Bind the value to the state
            onChangeText={(text) => setSearchQuery(text)} // Update the state on input
          />
        </View>
        {filteredRdvs.map((rdv) => (
          <View key={rdv.id} style={styles.column}>
            <Text style={styles.grdtext}>{rdv.title}</Text>
            <Text style={styles.mintext}>{rdv.name}</Text>
            <Text style={styles.mintext}>{rdv.email}</Text>
            <Text style={styles.mintext}>{rdv.phone}</Text>
            <Text style={styles.mintext}>{rdv.address}</Text>
            <View style={styles.vbutton}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>afficher les details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  column: {
    padding: 10,
    width: "100%",
    flexDirection: "column",
    borderRadius: 40,
    marginBottom: 20,
    borderColor: "#000000",
    borderWidth: 3,
  },
  vbutton: {
    alignItems: "flex-end",
  },
  grdtext: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 15,
    color: "#333",
  },
  barrech: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#000000",
    borderWidth: 3,
    borderRadius: 200,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  mintext: {
    marginLeft: 10,
    fontSize: 18,
    color: "#555",
  },
  image: {
    width: 21,
    height: 24,
    marginRight: 15,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#000000",
    height: 35,
    width: 120,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 50,
  },
  buttonText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    flex: 1, // Take up the remaining space in the search bar
    height: 40,
    fontSize: 16,
  },
});
