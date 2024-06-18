import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as configData from '../config.json';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ChangeImage = () => {
  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  const handleRefresh = () => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                { name: 'Wishlist' },
                { name: 'ProfileView' },
                { name: 'EditProfile' }
            ],
        })
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });


    const canceled = result.canceled;

    if (!canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
    }
  };

  const uploadImage = async () => {
    if (image) {
      const formData = new FormData();
      const userId = JSON.parse(await AsyncStorage.getItem('@user')).uid;
      formData.append('userId', userId);
      formData.append('profileImage', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
      
      try {
        const response_upload = await axios.post(configData.connection + '/userprofile/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        if(response_upload.status === 200){
          //do put for filename!
          fetch(configData.connection + "/userprofile/imageName", {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  userId: userId,
                  imageName: response_upload.data.filename
              }),
          })
          .then(() => handleRefresh())
          .catch(error => {
              console.error('Error:', error);
              Alert.alert('Error', 'Failed to change status');
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <Button title="Upload Image" onPress={uploadImage} />
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
  image: {
    width: screenWidth*0.6,
    height: screenWidth*0.6,
    //marginBottom: screenHeight*0.02,
    marginTop: screenHeight*0.06,
    borderRadius: screenWidth*0.6,
    alignSelf: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  }
});

export default ChangeImage;
