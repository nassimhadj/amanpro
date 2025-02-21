import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import debounce from 'lodash.debounce';

const AddressAutocomplete = ({ onSelectAddress, value, style }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchAddress = debounce(async (text) => {
    if (!text || text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(text)}&limit=5`
      );
      const data = await response.json();
      if (data && data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 300);

  const handleSelect = (item) => {
    if (item && item.properties) {
      const fullAddress = item.properties.label;
      setQuery(fullAddress);
      onSelectAddress(fullAddress);
      setShowSuggestions(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          searchAddress(text);
        }}
        placeholder="adresse"
        placeholderTextColor="#888"
      />
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          style={styles.suggestionsList}
          keyExtractor={(item, index) => `${item.properties?.id || index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.suggestionText}>
                {item.properties?.label || ''}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    width: '90%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestionsList: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
  },
});

export default AddressAutocomplete;