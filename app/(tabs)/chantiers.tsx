// chantiers.tsx

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
import { useChantier } from "./chantiercontext"; // Assure-toi que le chemin est correct

export default function Chantiers({ navigation }) {
  const [searchQuery, setSearchQuery] = useState(""); 
  const { chantiers, filterChantiers } = useChantier(); // On récupère la fonction filterChantiers du contexte

  // Applique le filtre sur les chantiers via la fonction du contexte
  const filteredChantiers = filterChantiers(searchQuery); 

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.barrech}>
          <Image
            source={require("../../assets/images/search.png")} // Assure-toi que le chemin est correct
            style={styles.image}
          />
          <TextInput
            style={styles.input}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)} // Met à jour la requête de recherche
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => 
                  navigation.navigate("chantier", { chantier: chantier }) // Navigate with chantier data
                }
              >
                <Text style={styles.buttonText}>Afficher les détails</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate("creerchantier")} // Naviguer vers l'écran de création de chantier
      >
        <Text style={styles.buttonText}>Ajouter un chantier</Text>
      </TouchableOpacity>
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
