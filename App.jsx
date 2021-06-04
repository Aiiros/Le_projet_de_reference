import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, StyleSheet, Button, Text, Pressable, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './src/logic/store';
import Login from './src/Login';
import Menu from './src/Menu';
import Details from './src/Details';
import Edit from './src/Edit';
import Profile from './src/Profile';
import Signup from './src/Signup';

const styles = StyleSheet.create({
  // statusBar: default
});

const Stack = createStackNavigator();

const layouts = {
  clear: {
    title: "c'est pas censé s'afficher"
    // todo clear in options
  },
  basic: ({ navigation }) => ({
    title: 'Accueil',
    headerRight: () => (
      <Pressable
        onPress={() => navigation.navigate('Profile')}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text />
        <View
          style={{
            height: 40,
            width: 40,
            borderWidth: 1,
            borderRadius: 40,
            marginHorizontal: 5
          }}
        >
          <Image />
        </View>
      </Pressable>
    )
  }),
  details: ({ route, navigation }) => ({
    title: route.params.title,
    headerRight: () => (
      <Button
        title='Edit'
        onPress={() => navigation.navigate('Edit', route.params)}
      />
    )
  }),
  edit: ({ route }) => ({
    title: route.params.title
  }),
  Profile: () => ({
    title: 'Profil'
  })
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style={styles.statusBar} />
        <Stack.Navigator initialRouteName='Login'>
          {/* <Stack.Navigator initialRouteName='First'> */}
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ title: 'Connexion' }}
          />
          <Stack.Screen
            name='Signup'
            component={Signup}
            options={{ title: 'Nouveau compte' }}
          />
          <Stack.Screen name='Menu' component={Menu} options={layouts.basic} />
          <Stack.Screen
            name='Details'
            component={Details}
            options={layouts.details}
          />
          <Stack.Screen name='Edit' component={Edit} options={layouts.edit} />
          <Stack.Screen
            name='Profile'
            component={Profile}
            options={layouts.profile}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
