import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useChantier } from "./chantiercontext";
import { API_URL } from '../../config/api.config';

export default function chantsfac({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { chantiers, setChantiers } = useChantier();
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    // Clear existing data first
    setChantiers([]);
    
    const fetchfacChantiers = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch(`${API_URL}/rdv`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('All chantiers:', data);
        
        const facChantiers = data.filter(rdv => rdv.status === 'attente de facturation');
        console.log('Filtered en cours chantiers:', facChantiers);
        
        setChantiers(facChantiers);
      } catch (error) {
        console.error("Error fetching chantiers:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Add navigation focus listener
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchfacChantiers();
    });
  
    // Initial fetch
    fetchfacChantiers();
  
    // Cleanup listener
    return unsubscribe;
  }, [navigation]);

  // Add this logging to see when chantiers changes
  useEffect(() => {
    console.log('Current chantiers in state:', chantiers);
  }, [chantiers]);

  const filteredChantiers = chantiers.filter(chantier => 
    chantier.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chantier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chantier.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Chargement des chantiers...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.barrech}>
          <Image
            source={require("../../assets/images/search.png")}
            style={styles.image}
          />
          <TextInput
            style={styles.input}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {filteredChantiers.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.grdtext}>
              Aucun chantier en attente de     facturation trouvé
            </Text>
          </View>
        ) : (
          filteredChantiers.map((chantier) => (
            <View key={chantier._id} style={styles.column}>
              <Text style={styles.grdtext}>{chantier.title}</Text>
              <Text style={styles.mintext}>{chantier.name}</Text>
              <Text style={styles.mintext}>{chantier.email}</Text>
              <Text style={styles.mintext}>{chantier.phone}</Text>
              <Text style={styles.mintext}>{chantier.address}</Text>
              <Text style={styles.mintext}>{chantier.status}</Text>
              <View style={styles.vbutton}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => 
                    navigation.navigate("chantfac", { chantier: chantier })
                  }
                >
                  <Text style={styles.buttonText}>Afficher les détails</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  noResultsContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  } ,

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
