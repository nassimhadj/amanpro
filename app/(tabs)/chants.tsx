import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet } from 'react-native';
import chantiers from './chantiers';
import chantierster from './chantierster';
import chantsannul from './chantsannul';
import chantsacc from './chantsacc';
import chantssav from './chantssav';
import chantsfac from './chantsfac';
import chantspay from './chantspay';

const TopTab = createMaterialTopTabNavigator();

export default function ChantierTopTabNavigator() {
  return (
    <View style={styles.container}>
      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#888',
          lazy: true,
          swipeEnabled: false,
          tabBarPressColor: 'transparent',
          tabBarGap: 0,
        }}
      >
        <TopTab.Screen 
          name="acceptes" 
          component={chantsacc}
          options={{ 
            tabBarLabel: 'acceptés' 
          }} 
        />
        <TopTab.Screen 
          name="EnCours" 
          component={chantiers}
          options={{ 
            tabBarLabel: 'En Cours' 
          }} 
        />
        <TopTab.Screen 
          name="SAV" 
          component={chantssav}
          options={{ 
            tabBarLabel: 'SAV' 
          }} 
        />
        <TopTab.Screen 
          name="attente_facturation"
          component={chantsfac}
          options={{ 
            tabBarLabel: 'attente de facturation' 
          }} 
        />
        <TopTab.Screen 
          name="attente_payement"
          component={chantspay}
          options={{ 
            tabBarLabel: 'attente de payement' 
          }} 
        />
        <TopTab.Screen 
          name="finis" 
          component={chantierster}
          options={{ 
            tabBarLabel: 'finis' 
          }} 
        />
        <TopTab.Screen 
          name="annules" 
          component={chantsannul}
          options={{ 
            tabBarLabel: 'annulés' 
          }} 
        />
      </TopTab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    paddingHorizontal: 8,
  },
  tabBarIndicator: {
    backgroundColor: '#000',
    height: 3,
  },
});