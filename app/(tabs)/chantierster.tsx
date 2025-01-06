import React, { useState } from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useChantierTer } from './chantiertercontext'; // Import the context

export default function Chantierster({navigation}) {
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input
  const { chantierTers } = useChantierTer(); // Access the completed chantier data

  // Filter the completed chantiers based on the search query
  const filteredChantiers = chantierTers.filter((chantier) => {
    const query = searchQuery.toLowerCase();
    return (
      (chantier.title && chantier.title.toLowerCase().includes(query)) ||
      (chantier.name && chantier.name.toLowerCase().includes(query)) ||
      (chantier.email && chantier.email.toLowerCase().includes(query)) ||
      (chantier.phone && chantier.phone.includes(query)) ||
      (chantier.address && chantier.address.toLowerCase().includes(query))
    );
  });
  const goToChantierTer = (chantier) => {
    console.log("Passing data to Chantierter:", chantier);
    navigation.navigate("chantierter", { rdv : chantier });
  };
  
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.barrech}>
          <Image source={require("../../assets/images/search.png")}  
          style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        {filteredChantiers.map((chantier) => (
          <View key={chantier.id} style={styles.column}>
            <Text style={styles.grdtext}>{chantier.title}</Text>
            <Text style={styles.mintext}>{chantier.name}</Text>
            <Text style={styles.mintext}>{chantier.email}</Text>
            <Text style={styles.mintext}>{chantier.phone}</Text>
            <Text style={styles.mintext}>{chantier.address}</Text>
            <View style={styles.vbutton}>
              <TouchableOpacity style={styles.button}
            onPress={goToChantierTer(chantier)}  >
                <Text style={styles.buttonText}>Afficher les détails</Text>
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
    marginLeft: 130,
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
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
