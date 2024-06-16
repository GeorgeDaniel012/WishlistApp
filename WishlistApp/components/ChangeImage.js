import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as configData from '../config.json';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeImage = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    const canceled = result.canceled;

    if (!canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
    }
  };

  const uploadImage = async () => {
    console.log("fjhjsjkf")
    if (image) {
      const formData = new FormData();
      const userId = JSON.parse(await AsyncStorage.getItem('@user')).uid;
      console.log(userId);
      formData.append('userId', userId);
      formData.append('profileImage', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
      console.log("aaaaaa")

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
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
};

export default ChangeImage;
