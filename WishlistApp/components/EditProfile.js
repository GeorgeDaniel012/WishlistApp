import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions, Switch, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as configData from '../config.json';
import { StackActions, CommonActions, useNavigation } from '@react-navigation/native';
import MyButton from './MyButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EditProfile = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isWishlistVisible, setWishlistVisible] = useState(false);

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
        setWishlistVisible(profileResponse.data.isWishlistVisible);
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

      await axios.put(configData.connection + '/userprofile/wishlistvisibility', {
        userId: userId,
        isWishlistVisible: isWishlistVisible,
      });

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
        maxLength={30}
      />
      <TextInput
        style={styles.multilineInput}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline={true}
        maxLength={255}
      />
      <View style={styles.switchContainer}>
        <Text>Wishlist Visibility</Text>
        <Switch
          value={isWishlistVisible}
          onValueChange={setWishlistVisible}
          // trackColor={{ false: "#767577", true: "#2196F3" }}
          // thumbColor={{false: "#f5dd4b", true: "#2196F3"}}
          // ios_backgroundColor="#3e3e3e"
        />
      </View>
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
    height: 0.05 * screenHeight,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 0.02 * screenHeight,
    marginTop: 0.02 * screenHeight,
    padding: 0.0125 * screenHeight,
  },
  multilineInput: {
    height: 0.12 * screenHeight,
    textAlignVertical: 'top',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 0.02 * screenHeight,
    padding: 0.01 * screenHeight,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0.02 * screenHeight,
  },
  // switch: {
  //   trackColor: { false: "#767577", true: "#81b0ff" },
  //   thumbColor: isWishlistVisible ? "#f5dd4b" : "#f4f3f4",
  //   ios_backgroundColor: "#3e3e3e",
  // },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  }
});

export default EditProfile;
