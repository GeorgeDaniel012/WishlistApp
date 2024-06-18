import React, { useState, useEffect } from 'react';
import { Text, Button, Image, View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import * as configData from '../config.json';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from './MyButton';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
  const baseWidth = 375;
  return size * (screenWidth / baseWidth);
};

const ProfileView = () => {
  const [imageData, setImageData] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userString = await AsyncStorage.getItem('@user');
        const userId = JSON.parse(userString).uid;

        const profileResponse = await axios.get(configData.connection + '/userprofile/user/' + userId);
        setDisplayName(profileResponse.data.displayName);
        setDescription(profileResponse.data.description);
        const imageUrl = profileResponse.data.imageName;
        if (imageUrl !== null) {
          const filename = imageUrl.split('/').pop();
          const imageResponse = await axios.get(configData.connection + '/userprofile/' + filename, {
            responseType: 'arraybuffer',
          });
          const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
          setImageData(`data:image/jpeg;base64,${base64Image}`);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={
          imageData !== null
            ? { uri: imageData }
            : { uri: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }
        }
        style={styles.profileImage}
      />
      <Text style={styles.nameText}>{displayName}</Text>
      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <MyButton color="rgba(0, 75, 128, 50)" title="View Wishlist" navigation={navigation} page="ProfileWishlist" style={styles.button} />
        <MyButton color="rgba(0, 75, 128, 50)" title="Edit Profile" navigation={navigation} page='EditProfile' style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ADD8E6',
    position: 'relative',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 40,
  },
  nameText: {
    fontSize: scaleFontSize(48),
    fontWeight: 'bold',
    marginTop: screenHeight * 0.02,
  },
  descriptionContainer: {
    marginVertical: screenHeight * 0.02,
  },
  descriptionText: {
    fontSize: scaleFontSize(24),
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchButton: {
    // to be added later
  },
});

export default ProfileView;
