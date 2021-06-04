import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import APIUser from './api/userAPI';
import AuthActions from './logic/action/auth_actions';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    // alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  const [fullName, setFullName] = useState(user.fullName);

  const logOut = () => {
    APIUser.logOut(
      user,
      () => {
        dispatch(AuthActions.setUser({}));
        navigation.goBack();
        navigation.dispatch(StackActions.replace('Login'));
      },
      (error) => {
        console.log(error);
        alert(error);
      }
    );
  };

  const editUser = () => {
    APIUser.editUser(
      user,
      fullName,
      (user2) => {
        dispatch(AuthActions.setUser(user2));
        alert('Nom changé !');
      },
      (error) => {
        console.log(error);
        alert(error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Image
        style={{
          height: 200,
          width: 200,
          alignSelf: 'center',
          margin: 30,
          resizeMode: 'contain'
        }}
        source={
          user && user.avatar
            ? { uri: user.avatar }
            : require('../assets/user.png')
        }
      />
      {/* <Button disabled title="Modifier l'avatar" onPress={() => null} /> */}
      <TextInput
        style={styles.text}
        placeholder='Prenom Nom'
        placeholderTextColor='#aaaaaa'
        onChangeText={(text) => setFullName(text)}
        value={fullName}
        underlineColorAndroid='transparent'
        autoCapitalize='none'
      />
      <View style={styles.text}>
        <Text>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={editUser}>
        <Text style={styles.buttonTitle}>Changer le nom</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logOut}>
        <Text style={styles.buttonTitle}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
