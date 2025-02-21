import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { RdvProvider } from './rdvcontext';
import { ChantierProvider } from './chantiercontext';
import { ChantierTerProvider } from './chantiertercontext';
import RDVScreen from './rdvs';
import ajoutrdv from './ajoutrdv'; // Import your Ajouter RDV screen
import chantiers from './chantiers';
import Chantier from './chantier';
import chantierster from './chantierster';
import creerchant from './creechant';
import modchant from './modchant';
import chantmsg from './chantmsg' ;
import chantprop from './chantprop' ;
import chantierter from './chantierter';
import chantannul from './chantannul';
import chantsannul from './chantsannul' ;
import chants from './chants' ;
import chantsacc from './chantsacc';
import chantssav from './chantssav';
import chantsfac from './chantsfac';
import chantspay from './chantspay';
import chantacc from './chantacc';
import chantsav from './chantsav';
import chantfac from './chantfac';
import chantpay from './chantpay';
import { Image, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// RDV Stack
const RDVStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RDV"
      component={RDVScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ajoutrdv"
      component={ajoutrdv}
      options={{ headerShown:false}}
    />
   

  </Stack.Navigator>
);
const chantmsgstack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="chantmsg"
      component={chantmsg}
      options={{ headerShown: false ,
         unmountOnBlur: true}}
    />
    <Stack.Screen
      name="chantprop"
      component={chantprop}
      options={{ headerShown:false }}
    />
  </Stack.Navigator>
);


const creerchantstack = ()=>(
  <Stack.Navigator>

     <Stack.Screen
    name="chants"
    component={chants}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantsacc"
    component={chantsacc}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantssav"
    component={chantssav}
    options={{ headerShown: false , unmountOnBlur: true }}
  /><Stack.Screen
  name="chantsfac"
  component={chantsfac}
  options={{ headerShown: false , unmountOnBlur: true }}
/>
<Stack.Screen
    name="chantspay"
    component={chantspay}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantacc"
    component={chantacc}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantsav"
    component={chantsav}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantfac"
    component={chantfac}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantpay"
    component={chantpay}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
  <Stack.Screen
    name="chantiers"
    component={chantiers}
    options={{ headerShown: false , unmountOnBlur: true }}
  />
    <Stack.Screen
      name="chantierster"
      component={chantierster}
      options={{ headerShown: false }}
    />
     <Stack.Screen
      name="chantsannul"
      component={chantsannul}
      options={{ headerShown: false ,
         unmountOnBlur: true}}
    />
    <Stack.Screen
      name="chantannul"
      component={chantannul}
      options={{ headerShown:false }}
    />
    <Stack.Screen
      name="chantierter"
      component={chantierter}
      options={{ headerShown:false}}
    />
  <Stack.Screen
    name="creerchantier"
    component={creerchant}
    options={{ title: 'Ajouter un chantier' }}
  />
    <Stack.Screen
    name="chantier"
    component={Chantier}
    options={{ headerShown : false }}
  />
  <Stack.Screen
      name="modchant"
      component={modchant}
      options={{ headerShown:false}}
    />
</Stack.Navigator>
);

const DrawerNavigator = () => {
  return (
    <ChantierTerProvider>
    <RdvProvider>
      <ChantierProvider>
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#000',
          width: 240,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff',
        },
      }}
    >
      <Drawer.Screen
        name="RDVStack"
        component={RDVStack} // Use the stack for RDV
        options={{
          drawerLabel: 'Mes RDVs',
          drawerIcon: () => (
            <Image
              source={require('../../assets/images/calendarb.png')}
              style={styles.icon}
            />
          ),
        }}
      />
        <Drawer.Screen
        name="chantmsg"
        component={chantmsgstack}
        options={{
          drawerLabel: 'propositions',
          drawerIcon: () => (
            <Image
              source={require('../../assets/images/mail-in.png')}
              style={styles.icon}
            />
            
          ),
        }}
      />
      <Drawer.Screen
        name="chantiers"
        component={creerchantstack}
        options={{
          drawerLabel: 'Mes chantiers',
          drawerIcon: () => (
            <Image
              source={require('../../assets/images/building.png')}
              style={styles.icon}
            />
          ),
        }}
      />
      
      
    </Drawer.Navigator>
    </ChantierProvider>
    </RdvProvider>
    </ChantierTerProvider>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
