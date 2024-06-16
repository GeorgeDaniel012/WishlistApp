import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as configData from '../config.json';
import { StackActions, CommonActions, useNavigation } from '@react-navigation/native';
import MyButton from './MyButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EditProfile = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  const handleRefresh = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Wishlist' },
          { name: 'ProfileView' }
        ],
      })
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userString = await AsyncStorage.getItem('@user');
        const userId = JSON.parse(userString).uid;

        const profileResponse = await axios.get(configData.connection + '/userprofile/user/' + userId);
        setName(profileResponse.data.displayName);
        setDescription(profileResponse.data.description);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const saveChanges = async () => {
    try {
      const userString = await AsyncStorage.getItem('@user');
      const userId = JSON.parse(userString).uid;

      // Implement your logic to save changes here, for example:
      await axios.put(configData.connection + '/userprofile/displayName', {
        userId: userId,
        displayName: name,
        // description: description,
      });

      // Implement your logic to save changes here, for example:
      await axios.put(configData.connection + '/userprofile/description/', {
        userId: userId,
        // displayName: name,
        description: description,
      });

      // Handle success (e.g., show a message, navigate away, etc.)
      console.log('Profile updated successfully');
      handleRefresh();
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  return (
    <View style={styles.container}>
      <MyButton style={styles.input} title="Change Image" navigation={navigation} page='ChangeImage'/>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.multilineInput}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline={true}
      />
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={saveChanges} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#ADD8E6'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
  },
  multilineInput: {
    height: 100,  // Adjust the height as needed for multiline input
    textAlignVertical: 'top',  // Align text at the top of the input field
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  }
});

export default EditProfile;
